import { deckFor, defaultPacksFor, getBlack, getPack, hasPacks } from "./cards";
import { AppError } from "./errors";
import type {
  GameView,
  HostState,
  PlayerRec,
  PlayerView,
  SubmissionView,
} from "./types";

export const HAND_SIZE = 10;
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 10;
export const DEFAULT_TARGET_SCORE = 7;
export const STATE_VERSION = 4;

export type Rng = () => number;

export function shuffle<T>(items: readonly T[], rng: Rng = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export function createGame(
  code: string,
  hostId: string,
  hostName: string,
  lang = "pt-BR",
): HostState {
  const deckLang = hasPacks(lang) ? lang : "pt-BR";
  return {
    version: STATE_VERSION,
    code,
    hostId,
    phase: "lobby",
    round: 0,
    targetScore: DEFAULT_TARGET_SCORE,
    players: [
      {
        id: hostId,
        name: hostName,
        score: 0,
        connected: true,
        hand: [],
        swapped: false,
        ready: false,
      },
    ],
    lang: deckLang,
    packs: defaultPacksFor(deckLang),
    whiteDeck: [],
    whiteDiscard: [],
    blackDeck: [],
    blackId: null,
    czarId: null,
    submissions: [],
    order: [],
    winnerKey: null,
    gameOver: false,
  };
}

const findPlayer = (s: HostState, id: string) =>
  s.players.find((p) => p.id === id);

function uniqueName(s: HostState, name: string) {
  const base = name.trim().slice(0, 20) || "Player";
  const taken = new Set(s.players.map((p) => p.name.toLowerCase()));
  let candidate = base;
  for (let n = 2; taken.has(candidate.toLowerCase()); n++) {
    candidate = `${base} (${n})`;
  }
  return candidate;
}

function draw(s: HostState, count: number, rng: Rng): string[] {
  const cards: string[] = [];
  while (cards.length < count) {
    if (s.whiteDeck.length === 0) {
      if (s.whiteDiscard.length === 0) break;
      s.whiteDeck = shuffle(s.whiteDiscard, rng);
      s.whiteDiscard = [];
    }
    const card = s.whiteDeck.pop();
    if (card !== undefined) cards.push(card);
  }
  return cards;
}

function refillHands(s: HostState, rng: Rng) {
  for (const p of s.players) {
    const missing = HAND_SIZE - p.hand.length;
    if (missing > 0) p.hand.push(...draw(s, missing, rng));
  }
}

function drawBlack(s: HostState, rng: Rng) {
  if (s.blackDeck.length === 0) {
    s.blackDeck = shuffle(deckFor(s.packs).black, rng);
  }
  s.blackId = s.blackDeck.pop() ?? null;
}

export function joinPlayer(
  s: HostState,
  id: string,
  name: string,
  rng: Rng = Math.random,
): PlayerRec {
  const existing = findPlayer(s, id);
  if (existing) {
    existing.connected = true;
    return existing;
  }
  if (s.players.length >= MAX_PLAYERS) {
    throw new AppError("roomFull");
  }
  const player: PlayerRec = {
    id,
    name: uniqueName(s, name),
    score: 0,
    connected: true,
    hand: [],
    swapped: false,
    ready: false,
  };
  s.players.push(player);
  if (s.phase !== "lobby" && s.phase !== "ended") {
    player.hand = draw(s, HAND_SIZE, rng);
    player.ready = true;
  }
  return player;
}

export function setTargetScore(s: HostState, target: number) {
  if (s.phase !== "lobby") throw new AppError("gameStarted");
  s.targetScore = Math.min(20, Math.max(1, Math.round(target)));
}

export function setDeckLanguage(s: HostState, lang: string) {
  if (s.phase !== "lobby") throw new AppError("gameStarted");
  if (!hasPacks(lang)) throw new AppError("unknownLanguage");
  s.lang = lang;
  s.packs = defaultPacksFor(lang);
}

export function setPacks(s: HostState, keys: string[]) {
  if (s.phase !== "lobby") throw new AppError("gameStarted");
  const valid = [...new Set(keys)].filter((k) => getPack(k)?.lang === s.lang);
  if (valid.length === 0) {
    throw new AppError("needPack");
  }
  s.packs = valid;
}

export function startGame(s: HostState, rng: Rng = Math.random) {
  if (s.phase !== "lobby") throw new AppError("gameStarted");
  const connected = s.players.filter((p) => p.connected);
  if (connected.length < MIN_PLAYERS) {
    throw new AppError("needPlayers", { min: MIN_PLAYERS });
  }
  const deck = deckFor(s.packs);
  if (
    deck.black.length === 0 ||
    deck.white.length < connected.length * HAND_SIZE * 2
  ) {
    throw new AppError("notEnoughCards");
  }
  s.players = connected;
  s.whiteDeck = shuffle(deck.white, rng);
  s.whiteDiscard = [];
  s.blackDeck = shuffle(deck.black, rng);
  for (const p of s.players) {
    p.hand = [];
    p.score = 0;
    p.swapped = false;
    p.ready = false;
  }
  refillHands(s, rng);
  s.round = 1;
  s.gameOver = false;
  s.czarId = null;
  s.blackId = null;
  s.submissions = [];
  s.order = [];
  s.winnerKey = null;
  s.phase = "mulligan";
}

function beginGame(s: HostState, rng: Rng) {
  const connected = s.players.filter((p) => p.connected);
  if (connected.length === 0) return;
  s.czarId = connected[Math.floor(rng() * connected.length)].id;
  beginRound(s, rng);
}

function maybeBeginGame(s: HostState, rng: Rng) {
  if (s.phase !== "mulligan") return;
  const connected = s.players.filter((p) => p.connected);
  if (connected.length > 0 && connected.every((p) => p.ready)) {
    beginGame(s, rng);
  }
}

export function swapHand(
  s: HostState,
  playerId: string,
  rng: Rng = Math.random,
) {
  if (s.phase !== "mulligan") throw new AppError("notMulliganPhase");
  const player = findPlayer(s, playerId);
  if (!player) throw new AppError("unknownPlayer");
  if (player.swapped || player.ready) throw new AppError("alreadySwapped");
  const fresh = draw(s, HAND_SIZE, rng);
  s.whiteDeck = shuffle([...s.whiteDeck, ...player.hand], rng);
  player.hand = fresh;
  player.swapped = true;
}

export function confirmHand(
  s: HostState,
  playerId: string,
  rng: Rng = Math.random,
) {
  if (s.phase !== "mulligan") throw new AppError("notMulliganPhase");
  const player = findPlayer(s, playerId);
  if (!player) throw new AppError("unknownPlayer");
  player.ready = true;
  maybeBeginGame(s, rng);
}

export function forceBegin(s: HostState, rng: Rng = Math.random) {
  if (s.phase !== "mulligan") throw new AppError("notMulliganPhase");
  beginGame(s, rng);
}

function beginRound(s: HostState, rng: Rng) {
  refillHands(s, rng);
  drawBlack(s, rng);
  s.submissions = [];
  s.order = [];
  s.winnerKey = null;
  s.phase = "playing";
}

export function nextCzar(s: HostState): string {
  const idx = s.players.findIndex((p) => p.id === s.czarId);
  for (let step = 1; step <= s.players.length; step++) {
    const candidate = s.players[(idx + step) % s.players.length];
    if (candidate.connected) return candidate.id;
  }
  return s.players[(idx + 1) % s.players.length].id;
}

const eligibleSubmitters = (s: HostState) =>
  s.players.filter((p) => p.connected && p.id !== s.czarId);

function maybeAdvanceToJudging(s: HostState, rng: Rng) {
  if (s.phase !== "playing") return;
  const waiting = eligibleSubmitters(s).filter(
    (p) => !s.submissions.some((sub) => sub.playerId === p.id),
  );
  if (waiting.length > 0 || s.submissions.length === 0) return;
  s.order = shuffle(range(s.submissions.length), rng);
  s.phase = "judging";
}

export function submitCards(
  s: HostState,
  playerId: string,
  cards: string[],
  rng: Rng = Math.random,
) {
  if (s.phase !== "playing") throw new AppError("notPlayingPhase");
  const player = findPlayer(s, playerId);
  if (!player) throw new AppError("unknownPlayer");
  if (playerId === s.czarId) {
    throw new AppError("czarCantPlay");
  }
  if (s.submissions.some((sub) => sub.playerId === playerId)) {
    throw new AppError("alreadyPlayed");
  }
  const pick = (s.blackId && getBlack(s.blackId)?.pick) || 1;
  const unique = new Set(cards);
  if (
    cards.length !== pick ||
    unique.size !== pick ||
    !cards.every((c) => player.hand.includes(c))
  ) {
    throw new AppError("invalidPlay");
  }
  player.hand = player.hand.filter((c) => !unique.has(c));
  s.submissions.push({ playerId, cards });
  maybeAdvanceToJudging(s, rng);
}

export function chooseWinner(s: HostState, playerId: string, key: number) {
  if (s.phase !== "judging") throw new AppError("notJudgingPhase");
  if (playerId !== s.czarId) {
    throw new AppError("onlyCzarPicks");
  }
  const submission = s.submissions[key];
  if (!submission) throw new AppError("invalidAnswer");
  const winner = findPlayer(s, submission.playerId);
  if (winner) {
    winner.score += 1;
    s.gameOver = winner.score >= s.targetScore;
  }
  s.winnerKey = key;
  s.phase = "reveal";
}

function discardSubmissions(s: HostState) {
  for (const sub of s.submissions) s.whiteDiscard.push(...sub.cards);
  s.submissions = [];
}

export function canAdvance(s: HostState, playerId: string): boolean {
  if (s.phase !== "reveal") return false;
  if (s.gameOver) return playerId === s.hostId;
  return playerId === nextCzar(s);
}

export function nextRound(s: HostState, rng: Rng = Math.random, by?: string) {
  if (s.phase !== "reveal") throw new AppError("roundNotOver");
  if (by !== undefined && !canAdvance(s, by)) {
    throw new AppError("onlyNextCzar");
  }
  discardSubmissions(s);
  if (s.gameOver) {
    s.phase = "ended";
    s.order = [];
    return;
  }
  s.czarId = nextCzar(s);
  s.round += 1;
  beginRound(s, rng);
}

function skipRound(s: HostState, rng: Rng) {
  for (const sub of s.submissions) {
    const owner = findPlayer(s, sub.playerId);
    if (owner) owner.hand.push(...sub.cards);
    else s.whiteDiscard.push(...sub.cards);
  }
  s.submissions = [];
  s.czarId = nextCzar(s);
  beginRound(s, rng);
}

const inRound = (s: HostState) =>
  s.phase === "playing" || s.phase === "judging";

export function setConnected(
  s: HostState,
  playerId: string,
  connected: boolean,
  rng: Rng = Math.random,
) {
  const player = findPlayer(s, playerId);
  if (!player) return;
  player.connected = connected;
  if (s.phase === "mulligan") {
    if (!connected) maybeBeginGame(s, rng);
    return;
  }
  if (connected || !inRound(s)) return;
  if (playerId === s.czarId) {
    skipRound(s, rng);
  } else {
    maybeAdvanceToJudging(s, rng);
  }
}

export function removePlayer(
  s: HostState,
  playerId: string,
  rng: Rng = Math.random,
) {
  const player = findPlayer(s, playerId);
  if (!player || playerId === s.hostId) return;
  const wasCzar = playerId === s.czarId;
  const wasInRound = inRound(s);
  const successor = wasCzar ? nextCzar(s) : null;
  s.whiteDiscard.push(...player.hand);
  s.players = s.players.filter((p) => p.id !== playerId);
  if (s.phase === "mulligan") {
    maybeBeginGame(s, rng);
    return;
  }
  const mine = s.submissions.findIndex((sub) => sub.playerId === playerId);
  if (mine >= 0) {
    s.whiteDiscard.push(...s.submissions[mine].cards);
    s.submissions.splice(mine, 1);
    s.order = s.order
      .filter((k) => k !== mine)
      .map((k) => (k > mine ? k - 1 : k));
  }
  if (wasCzar && wasInRound) {
    s.czarId = successor;
    for (const sub of s.submissions) {
      const owner = findPlayer(s, sub.playerId);
      if (owner) owner.hand.push(...sub.cards);
    }
    s.submissions = [];
    s.czarId = successor;
    beginRound(s, rng);
  } else if (wasCzar) {
    s.czarId = successor;
  } else if (wasInRound) {
    if (s.phase === "judging" && s.submissions.length === 0) {
      beginRound(s, rng);
    } else {
      maybeAdvanceToJudging(s, rng);
    }
  }
}

export function backToLobby(s: HostState) {
  if (s.phase !== "ended") throw new AppError("notEnded");
  s.phase = "lobby";
  s.round = 0;
  s.czarId = null;
  s.blackId = null;
  s.submissions = [];
  s.order = [];
  s.winnerKey = null;
  s.gameOver = false;
  s.whiteDeck = [];
  s.whiteDiscard = [];
  for (const p of s.players) {
    p.hand = [];
    p.score = 0;
    p.swapped = false;
    p.ready = false;
  }
  s.players = s.players.filter((p) => p.connected);
}

export function playAgain(s: HostState, rng: Rng = Math.random) {
  backToLobby(s);
  try {
    startGame(s, rng);
  } catch (err) {
    if (!(err instanceof AppError)) throw err;
  }
}

export function buildView(s: HostState, playerId: string): GameView {
  const me = findPlayer(s, playerId);
  const players: PlayerView[] = s.players.map((p) => ({
    id: p.id,
    name: p.name,
    score: p.score,
    connected: p.connected,
    isHost: p.id === s.hostId,
    isCzar: p.id === s.czarId,
    submitted: s.submissions.some((sub) => sub.playerId === p.id),
    ready: p.ready,
    swapped: p.swapped,
  }));
  const mine = s.submissions.find((sub) => sub.playerId === playerId);
  const revealed = s.phase === "reveal" || s.phase === "ended";
  const showSubmissions = s.phase === "judging" || s.phase === "reveal";
  const submissions: SubmissionView[] = showSubmissions
    ? s.order.map((key) => ({
        key,
        cards: s.submissions[key].cards,
        ...(revealed ? { playerId: s.submissions[key].playerId } : {}),
      }))
    : [];
  return {
    code: s.code,
    me: playerId,
    phase: s.phase,
    round: s.round,
    targetScore: s.targetScore,
    lang: s.lang,
    packs: s.packs,
    players,
    czarId: s.czarId,
    nextCzarId: s.phase === "reveal" && !s.gameOver ? nextCzar(s) : null,
    black: (s.blackId && getBlack(s.blackId)) || null,
    hand: me?.hand ?? [],
    mySubmission: mine?.cards ?? null,
    submissions,
    winnerKey: s.winnerKey,
    gameOver: s.gameOver,
  };
}
