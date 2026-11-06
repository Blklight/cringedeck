export interface WhiteCard {
  id: string;
  text: string;
  source?: string;
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
  license?: string;
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

export type Phase = "lobby" | "playing" | "judging" | "reveal" | "ended";

export interface PlayerRec {
  id: string;
  name: string;
  score: number;
  connected: boolean;
  hand: string[];
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
  packs: string[];
  players: PlayerView[];
  czarId: string | null;
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
  | { t: "leave" };

export type HostMsg =
  | { t: "view"; view: GameView }
  | { t: "error"; message: string }
  | { t: "kicked" }
  | { t: "closed" };
