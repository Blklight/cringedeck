import type { DataConnection, Peer } from "peerjs";
import { APP_SLUG } from "@/lib/brand";
import {
  backToLobby,
  buildView,
  chooseWinner,
  createGame,
  joinPlayer,
  nextRound,
  removePlayer,
  STATE_VERSION,
  setConnected,
  setDeckLanguage,
  setPacks,
  setTargetScore,
  startGame,
  submitCards,
} from "./engine";
import { AppError, type ErrorCode, type Notice, toNotice } from "./errors";
import type { ClientMsg, GameView, HostMsg, HostState } from "./types";

const PEER_PREFIX = `${APP_SLUG}-`;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const HOST_STORAGE_KEY = `${APP_SLUG}:host-state`;
const RECONNECT_DELAY_MS = 2000;
const MAX_RECONNECTS = 15;
const CONNECT_TIMEOUT_MS = 15000;

export interface SessionEvents {
  onView: (view: GameView) => void;
  onError: (notice: Notice) => void;
  onClosed: (code: ErrorCode) => void;
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

const errorType = (err: unknown) =>
  (err as { type?: string } | null)?.type ?? "";

async function openPeer(id?: string): Promise<Peer> {
  const { Peer } = await import("peerjs");
  const peer = id ? new Peer(id) : new Peer();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      peer.destroy();
      reject(new AppError("signalingUnreachable"));
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
    lang: string,
    events: SessionEvents,
  ): Promise<HostSession> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const session = new HostSession(
        createGame(randomCode(), hostId, name, lang),
        events,
      );
      try {
        await session.listen();
        session.commit();
        return session;
      } catch (err) {
        if (errorType(err) !== "unavailable-id") throw asAppError(err);
      }
    }
    throw new AppError("roomCodeFailed");
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
        if (errorType(err) !== "unavailable-id" || attempt >= 4) {
          throw asAppError(err);
        }
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
        this.events.onError({ code: "signalingError" });
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
          this.send(conn, { t: "error", ...toNotice(err) });
          setTimeout(() => conn.close(), 300);
        }
        return;
      }
      if (!playerId) return;
      const pid = playerId;
      if (msg.t === "leave") {
        this.run(() => removePlayer(this.state, pid), conn);
        this.conns.delete(pid);
        conn.close();
        return;
      }
      this.handleRemote(pid, msg, conn);
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
          throw new AppError("onlyCzarOrHost");
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
      if (!(err instanceof AppError)) throw err;
      if (conn) this.send(conn, { t: "error", ...toNotice(err) });
      else this.events.onError(toNotice(err));
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

  setDeckLanguage(lang: string) {
    this.run(() => setDeckLanguage(this.state, lang));
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

  close() {
    this.closed = true;
    for (const conn of this.conns.values()) {
      this.send(conn, { t: "closed" });
    }
    const peer = this.peer;
    setTimeout(() => peer?.destroy(), 300);
    clearSavedHostState();
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
    try {
      session.peer = await openPeer();
      await session.connect();
    } catch (err) {
      session.close();
      throw asAppError(err);
    }
    return session;
  }

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const peer = this.peer;
      if (!peer) return reject(new AppError("connectionClosed"));
      const conn = peer.connect(PEER_PREFIX + this.code, {
        reliable: true,
        serialization: "json",
      });
      let settled = false;
      const fail = (err: unknown) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        peer.off("error", onPeerError);
        reject(err);
      };
      const timer = setTimeout(
        () => fail(new AppError("roomNoResponse")),
        CONNECT_TIMEOUT_MS,
      );
      const onPeerError = (err: unknown) => {
        if (errorType(err) === "peer-unavailable") {
          fail(new AppError("roomNotFound"));
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
            peer.off("error", onPeerError);
            resolve();
          }
          this.attempts = 0;
          this.events.onView(msg.view);
        } else if (msg.t === "error") {
          if (!settled) {
            this.closed = true;
            fail(new AppError(msg.code, msg.params));
          } else {
            this.events.onError({ code: msg.code, params: msg.params });
          }
        } else if (msg.t === "kicked") {
          this.closed = true;
          this.events.onClosed("kicked");
        } else if (msg.t === "closed") {
          this.closed = true;
          this.events.onClosed("hostClosed");
        }
      });
      conn.on("close", () => {
        if (!settled) return fail(new AppError("roomRefused"));
        if (!this.closed) this.reconnect();
      });
      conn.on("error", fail);
    });
  }

  private async reconnect() {
    if (this.closed) return;
    if (this.attempts >= MAX_RECONNECTS) {
      this.events.onClosed("connectionLost");
      return;
    }
    this.attempts += 1;
    this.events.onReconnecting?.(this.attempts);
    await new Promise((r) => setTimeout(r, RECONNECT_DELAY_MS));
    if (this.closed) return;
    try {
      if (this.peer?.disconnected && !this.peer.destroyed) {
        this.peer.reconnect();
      }
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

function asAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  return new AppError(
    errorType(err) === "peer-unavailable" ? "roomNotFound" : "signalingError",
  );
}
