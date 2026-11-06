import { create } from "zustand";
import {
  clearSavedHostState,
  GuestSession,
  HostSession,
  loadSavedHostState,
  messageOf,
  normalizeCode,
  type SessionEvents,
} from "@/game/session";
import type { GameView } from "@/game/types";

const PID_KEY = "cringedeck:pid";
const NAME_KEY = "cringedeck:name";
const LAST_ROOM_KEY = "cringedeck:last-room";

type Status = "idle" | "connecting" | "connected";

interface LastRoom {
  code: string;
  role: "host" | "guest";
}

interface GameStore {
  status: Status;
  role: "host" | "guest" | null;
  view: GameView | null;
  notice: string | null;
  reconnecting: boolean;
  savedName: string;
  lastRoom: LastRoom | null;
  hydrate: () => void;
  createRoom: (name: string) => Promise<void>;
  resumeRoom: () => Promise<void>;
  joinRoom: (code: string, name: string) => Promise<void>;
  startGame: () => void;
  setTarget: (target: number) => void;
  setPacks: (keys: string[]) => void;
  play: (cards: string[]) => void;
  pick: (key: number) => void;
  next: () => void;
  restart: () => void;
  kick: (playerId: string) => void;
  leave: () => void;
  dismissNotice: () => void;
}

let host: HostSession | null = null;
let guest: GuestSession | null = null;

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {}
}

function playerId() {
  let pid = readStorage(PID_KEY);
  if (!pid) {
    pid = crypto.randomUUID();
    writeStorage(PID_KEY, pid);
  }
  return pid;
}

function readLastRoom(): LastRoom | null {
  const raw = readStorage(LAST_ROOM_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LastRoom;
  } catch {
    return null;
  }
}

export const useGameStore = create<GameStore>((set, get) => {
  const events = (): SessionEvents => ({
    onView: (view) => set({ view, status: "connected", reconnecting: false }),
    onError: (message) => set({ notice: message }),
    onReconnecting: () => set({ reconnecting: true }),
    onClosed: (message) => {
      host = null;
      guest = null;
      writeStorage(LAST_ROOM_KEY, null);
      set({
        status: "idle",
        role: null,
        view: null,
        notice: message,
        reconnecting: false,
        lastRoom: null,
      });
    },
  });

  const fail = (err: unknown) => {
    host = null;
    guest = null;
    set({ status: "idle", role: null, view: null, notice: messageOf(err) });
  };

  const remember = (name: string, room: LastRoom) => {
    writeStorage(NAME_KEY, name);
    writeStorage(LAST_ROOM_KEY, JSON.stringify(room));
    set({ savedName: name, lastRoom: room });
  };

  return {
    status: "idle",
    role: null,
    view: null,
    notice: null,
    reconnecting: false,
    savedName: "",
    lastRoom: null,

    hydrate: () => {
      const saved = loadSavedHostState();
      const last = readLastRoom();
      set({
        savedName: readStorage(NAME_KEY) ?? "",
        lastRoom:
          last && (last.role === "guest" || saved?.code === last.code)
            ? last
            : null,
      });
    },

    createRoom: async (name) => {
      set({ status: "connecting", notice: null });
      try {
        host = await HostSession.create(playerId(), name.trim(), events());
        set({ role: "host" });
        remember(name.trim(), { code: host.state.code, role: "host" });
      } catch (err) {
        fail(err);
      }
    },

    resumeRoom: async () => {
      const last = get().lastRoom;
      if (!last) return;
      set({ status: "connecting", notice: null });
      try {
        if (last.role === "host") {
          const saved = loadSavedHostState();
          if (!saved) throw new Error("Sala salva não encontrada.");
          host = await HostSession.resume(saved, events());
          set({ role: "host" });
        } else {
          guest = await GuestSession.join(
            last.code,
            playerId(),
            get().savedName || "Jogador",
            events(),
          );
          set({ role: "guest" });
        }
      } catch (err) {
        writeStorage(LAST_ROOM_KEY, null);
        set({ lastRoom: null });
        fail(err);
      }
    },

    joinRoom: async (rawCode, name) => {
      const code = normalizeCode(rawCode);
      set({ status: "connecting", notice: null });
      try {
        guest = await GuestSession.join(
          code,
          playerId(),
          name.trim(),
          events(),
        );
        set({ role: "guest" });
        remember(name.trim(), { code, role: "guest" });
      } catch (err) {
        fail(err);
      }
    },

    startGame: () => host?.start(),
    setTarget: (target) => host?.setTarget(target),
    setPacks: (keys) => host?.setPacks(keys),
    play: (cards) => (host ?? guest)?.play(cards),
    pick: (key) => (host ?? guest)?.pick(key),
    next: () => (host ?? guest)?.next(),
    restart: () => host?.restart(),
    kick: (id) => host?.kick(id),

    leave: () => {
      if (host) {
        host.close();
        clearSavedHostState();
      }
      guest?.leave();
      host = null;
      guest = null;
      writeStorage(LAST_ROOM_KEY, null);
      set({
        status: "idle",
        role: null,
        view: null,
        reconnecting: false,
        lastRoom: null,
      });
    },

    dismissNotice: () => set({ notice: null }),
  };
});
