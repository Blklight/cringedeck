import type { ErrorCode, ErrorParams } from "./errors";

export interface WhiteCard {
  id: string;
  text: string;
  source?: string;
  translatedFrom?: string;
}

export interface BlackCard extends WhiteCard {
  pick: number;
}

export interface CardPack {
  id: string;
  lang: string;
  name: string;
  description?: string;
  source?: string;
  license?: string | string[];
  translatedFrom?: string;
  black: BlackCard[];
  white: WhiteCard[];
}

export interface PackInfo {
  key: string;
  name: string;
  lang: string;
  black: number;
  white: number;
}

export type Phase =
  | "lobby"
  | "mulligan"
  | "playing"
  | "judging"
  | "reveal"
  | "ended";

export interface PlayerRec {
  id: string;
  name: string;
  score: number;
  connected: boolean;
  hand: string[];
  swapped: boolean;
  ready: boolean;
}

export interface Submission {
  playerId: string;
  cards: string[];
}

export interface HostState {
  version: number;
  code: string;
  hostId: string;
  phase: Phase;
  round: number;
  targetScore: number;
  players: PlayerRec[];
  lang: string;
  packs: string[];
  whiteDeck: string[];
  whiteDiscard: string[];
  blackDeck: string[];
  blackId: string | null;
  czarId: string | null;
  submissions: Submission[];
  order: number[];
  winnerKey: number | null;
  gameOver: boolean;
}

export interface PlayerView {
  id: string;
  name: string;
  score: number;
  connected: boolean;
  isHost: boolean;
  isCzar: boolean;
  submitted: boolean;
  ready: boolean;
  swapped: boolean;
}

export interface SubmissionView {
  key: number;
  cards: string[];
  playerId?: string;
}

export interface GameView {
  code: string;
  me: string;
  phase: Phase;
  round: number;
  targetScore: number;
  lang: string;
  packs: string[];
  players: PlayerView[];
  czarId: string | null;
  nextCzarId: string | null;
  black: BlackCard | null;
  hand: string[];
  mySubmission: string[] | null;
  submissions: SubmissionView[];
  winnerKey: number | null;
  gameOver: boolean;
}

export type ClientMsg =
  | { t: "join"; pid: string; name: string }
  | { t: "play"; cards: string[] }
  | { t: "pick"; key: number }
  | { t: "next" }
  | { t: "swap" }
  | { t: "ready" }
  | { t: "leave" };

export type HostMsg =
  | { t: "view"; view: GameView }
  | { t: "error"; code: ErrorCode; params?: ErrorParams }
  | { t: "kicked" }
  | { t: "closed" };
