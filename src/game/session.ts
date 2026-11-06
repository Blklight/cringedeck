import type { DataConnection, Peer } from "peerjs";
import {
  backToLobby,
  buildView,
  chooseWinner,
  createGame,
  GameError,
  joinPlayer,
  nextRound,
  removePlayer,
  STATE_VERSION,
  setConnected,
  setPacks,
  setTargetScore,
  startGame,
  submitCards,
} from "./engine";
import type { ClientMsg, GameView, HostMsg, HostState } from "./types";

const PEER_PREFIX = "cringedeck-";
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const HOST_STORAGE_KEY = "cringedeck:host-state";
const RECONNECT_DELAY_MS = 2000;
const MAX_RECONNECTS = 15;
const CONNECT_TIMEOUT_MS = 15000;

export interface SessionEvents {
  onView: (view: GameView) => void;
  onError: (message: string) => void;
  onClosed: (message: string) => void;
  onReconnecting?: (attempt: number) => void;
}

export const normalizeCode = (raw: string) =>
  raw.toUpperCase().replace(/[^A-Z0-9]/g, "");

const randomCode = () =>
  Array.from(
    { length: 5 },
    () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)],
  ).join("");

const safeStorage = {
  get(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  },
  remove(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  },
};

export function loadSavedHostState(): HostState | null {
  const raw = safeStorage.get(HOST_STORAGE_KEY);
  if (!raw) return null;
  try {
    const state = JSON.parse(raw) as HostState;
    return state.version === STATE_VERSION ? state : null;
  } catch {
    return null;
  }
}

export function clearSavedHostState() {
  safeStorage.remove(HOST_STORAGE_KEY);
}

async function openPeer(id?: string): Promise<Peer> {
  const { Peer } = await import("peerjs");
  const peer = id ? new Peer(id) : new Peer();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      peer.destroy();
      reject(new Error("Não foi possível alcançar o servidor de conexão."));
    }, CONNECT_TIMEOUT_MS);
    peer.once("open", () => {
      clearTimeout(timer);
      resolve(peer);
    });
    peer.once("error", (err) => {
      clearTimeout(timer);
      peer.destroy();
      reject(err);
    });
  });
}

const errorType = (err: unknown) =>
  (err as { type?: string } | null)?.type ?? "";

export class HostSession {
  readonly state: HostState;
  private peer: Peer | null = null;
  private conns = new Map<string, DataConnection>();
  private closed = false;

  private constructor(
    state: HostState,
    private events: SessionEvents,
  ) {
    this.state = state;
  }

  static async create(
    hostId: string,
    name: string,
    events: SessionEvents,
  ): Promise<HostSession> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = randomCode();
      try {
        const session = new HostSession(createGame(code, hostId, name), events);
        await session.listen();
        session.commit();
        return session;
      } catch (err) {
        if (errorType(err) !== "unavailable-id") throw err;
      }
    }
    throw new Error("Não foi possível reservar um código de sala.");
  }

  static async resume(
    saved: HostState,
    events: SessionEvents,
  ): Promise<HostSession> {
    const session = new HostSession(saved, events);
    for (const p of session.state.players) {
      if (p.id !== saved.hostId) p.connected = false;
    }
    for (let attempt = 0; ; attempt++) {
      try {
        await session.listen();
        break;
      } catch (err) {
        if (errorType(err) !== "unavailable-id" || attempt >= 4) throw err;
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    session.commit();
    return session;
  }

  private async listen() {
    const peer = await openPeer(PEER_PREFIX + this.state.code);
    this.peer = peer;
    peer.on("connection", (conn) => this.onConnection(conn));
    peer.on("disconnected", () => {
      if (!this.closed) peer.reconnect();
    });
    peer.on("error", (err) => {
      if (errorType(err) !== "peer-unavailable") {
        this.events.onError("Erro de conexão com o servidor de sinalização.");
      }
    });
  }

  private onConnection(conn: DataConnection) {
    let playerId: string | null = null;
    conn.on("data", (raw) => {
      const msg = raw as ClientMsg;
      if (msg.t === "join") {
        try {
          const player = joinPlayer(this.state, msg.pid, msg.name);
          const previous = this.conns.get(player.id);
          this.conns.set(player.id, conn);
          if (previous && previous !== conn) previous.close();
          playerId = player.id;
          this.commit();
        } catch (err) {
          this.send(conn, { t: "error", message: messageOf(err) });
          setTimeout(() => conn.close(), 300);
        }
        return;
      }
      if (!playerId) return;
      if (msg.t === "leave") {
        this.run(() => removePlayer(this.state, playerId as string), conn);
        this.conns.delete(playerId);
        conn.close();
        return;
      }
      this.handleRemote(playerId, msg, conn);
    });
    conn.on("close", () => {
      if (!playerId || this.conns.get(playerId) !== conn) return;
      this.conns.delete(playerId);
      setConnected(this.state, playerId, false);
      this.commit();
    });
  }

  private handleRemote(playerId: string, msg: ClientMsg, conn: DataConnection) {
    this.run(() => {
      if (msg.t === "play") submitCards(this.state, playerId, msg.cards);
      else if (msg.t === "pick") chooseWinner(this.state, playerId, msg.key);
      else if (msg.t === "next") {
        if (playerId !== this.state.czarId && playerId !== this.state.hostId) {
          throw new GameError("Só o Czar ou o anfitrião avança a rodada.");
        }
        nextRound(this.state);
      }
    }, conn);
  }

  private run(action: () => void, conn?: DataConnection) {
    try {
      action();
      this.commit();
    } catch (err) {
      if (!(err instanceof GameError)) throw err;
      if (conn) this.send(conn, { t: "error", message: err.message });
      else this.events.onError(err.message);
    }
  }

  private send(conn: DataConnection, msg: HostMsg) {
    if (conn.open) conn.send(msg);
  }

  private commit() {
    safeStorage.set(HOST_STORAGE_KEY, JSON.stringify(this.state));
    for (const [pid, conn] of this.conns) {
      this.send(conn, { t: "view", view: buildView(this.state, pid) });
    }
    this.events.onView(buildView(this.state, this.state.hostId));
  }

  start() {
    this.run(() => startGame(this.state));
  }

  setTarget(target: number) {
    this.run(() => setTargetScore(this.state, target));
  }

  setPacks(keys: string[]) {
    this.run(() => setPacks(this.state, keys));
  }

  play(cards: string[]) {
    this.run(() => submitCards(this.state, this.state.hostId, cards));
  }

  pick(key: number) {
    this.run(() => chooseWinner(this.state, this.state.hostId, key));
  }

  next() {
    this.run(() => nextRound(this.state));
  }

  restart() {
    this.run(() => backToLobby(this.state));
  }

  kick(playerId: string) {
    const conn = this.conns.get(playerId);
    if (conn) {
      this.send(conn, { t: "kicked" });
      this.conns.delete(playerId);
      setTimeout(() => conn.close(), 300);
    }
    this.run(() => removePlayer(this.state, playerId));
  }

  close(options: { keepSaved?: boolean } = {}) {
    this.closed = true;
    for (const conn of this.conns.values()) {
      this.send(conn, { t: "closed" });
    }
    const peer = this.peer;
    setTimeout(() => peer?.destroy(), 300);
    if (!options.keepSaved) clearSavedHostState();
  }
}

export class GuestSession {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private closed = false;
  private attempts = 0;

  private constructor(
    private code: string,
    private pid: string,
    private name: string,
    private events: SessionEvents,
  ) {}

  static async join(
    code: string,
    pid: string,
    name: string,
    events: SessionEvents,
  ): Promise<GuestSession> {
    const session = new GuestSession(code, pid, name, events);
    session.peer = await openPeer();
    await session.connect();
    return session;
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const peer = this.peer;
      if (!peer) return reject(new Error("Conexão encerrada."));
      const conn = peer.connect(PEER_PREFIX + this.code, {
        reliable: true,
        serialization: "json",
      });
      let settled = false;
      const timer = setTimeout(
        () => fail(new Error("A sala não respondeu.")),
        CONNECT_TIMEOUT_MS,
      );
      const fail = (err: unknown) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      };
      const onPeerError = (err: unknown) => {
        if (errorType(err) === "peer-unavailable") {
          fail(new Error("Sala não encontrada. Confira o código."));
        }
      };
      peer.on("error", onPeerError);
      conn.on("open", () => {
        this.conn = conn;
        conn.send({
          t: "join",
          pid: this.pid,
          name: this.name,
        } satisfies ClientMsg);
      });
      conn.on("data", (raw) => {
        const msg = raw as HostMsg;
        if (msg.t === "view") {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve();
          }
          this.attempts = 0;
          this.events.onView(msg.view);
        } else if (msg.t === "error") {
          this.closed = true;
          fail(new Error(msg.message));
          this.events.onError(msg.message);
        } else if (msg.t === "kicked") {
          this.closed = true;
          this.events.onClosed("Você foi removido da sala.");
        } else if (msg.t === "closed") {
          this.closed = true;
          this.events.onClosed("O anfitrião encerrou a sala.");
        }
      });
      conn.on("close", () => {
        if (!settled) return fail(new Error("A sala recusou a conexão."));
        if (!this.closed) this.reconnect();
      });
      conn.on("error", fail);
    });
  }

  private async reconnect() {
    if (this.closed) return;
    if (this.attempts >= MAX_RECONNECTS) {
      this.events.onClosed("Conexão com a sala perdida.");
      return;
    }
    this.attempts += 1;
    this.events.onReconnecting?.(this.attempts);
    await new Promise((r) => setTimeout(r, RECONNECT_DELAY_MS));
    if (this.closed) return;
    try {
      if (this.peer?.disconnected && !this.peer.destroyed)
        this.peer.reconnect();
      await this.connect();
    } catch {
      this.reconnect();
    }
  }

  private send(msg: ClientMsg) {
    if (this.conn?.open) this.conn.send(msg);
  }

  play(cards: string[]) {
    this.send({ t: "play", cards });
  }

  pick(key: number) {
    this.send({ t: "pick", key });
  }

  next() {
    this.send({ t: "next" });
  }

  leave() {
    this.send({ t: "leave" });
    this.close();
  }

  close() {
    this.closed = true;
    const peer = this.peer;
    setTimeout(() => peer?.destroy(), 300);
  }
}

export const messageOf = (err: unknown) =>
  err instanceof Error ? err.message : "Algo deu errado.";
