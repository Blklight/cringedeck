import { getBlack, PACKS } from "@/game/cards";
import {
  buildView,
  chooseWinner,
  createGame,
  joinPlayer,
  nextRound,
  startGame,
  submitCards,
} from "@/game/engine";
import type { GameView, HostState } from "@/game/types";

export type ScenarioId =
  | "home"
  | "lobbyHost"
  | "lobbyGuest"
  | "playing"
  | "playingPick2"
  | "submitted"
  | "czarWaiting"
  | "judgingCzar"
  | "judgingPlayer"
  | "reveal"
  | "ended";

export interface Scenario {
  id: ScenarioId;
  label: string;
  view: GameView | null;
  isHost: boolean;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function lobby(lang: string) {
  const rng = seeded(7);
  const s = createGame("DEMO5", "ana", "Ana", lang);
  for (const [id, name] of [
    ["bia", "Bia"],
    ["caio", "Caio"],
    ["duda", "Duda"],
  ]) {
    joinPlayer(s, id, name, rng);
  }
  return { s, rng };
}

function started(lang: string, pick = 1) {
  const { s, rng } = lobby(lang);
  startGame(s, rng);
  s.czarId = "caio";
  const black = PACKS.find((p) => p.lang === lang)?.black.find(
    (c) => c.pick === pick,
  );
  if (black) s.blackId = black.id;
  return { s, rng };
}

function submitAll(s: HostState, rng: () => number) {
  const pick = getBlack(s.blackId as string)?.pick ?? 1;
  for (const p of s.players) {
    if (p.id !== s.czarId) submitCards(s, p.id, p.hand.slice(0, pick), rng);
  }
}

export function buildScenarios(lang: string): Scenario[] {
  const lobbyState = lobby(lang).s;
  lobbyState.players[3].connected = false;

  const playing = started(lang).s;
  const pick2 = started(lang, 2).s;

  const submitted = started(lang);
  submitCards(submitted.s, "ana", submitted.s.players[0].hand.slice(0, 1));
  submitCards(submitted.s, "bia", submitted.s.players[1].hand.slice(0, 1));

  const judging = started(lang, 2);
  submitAll(judging.s, judging.rng);

  const reveal = started(lang, 2);
  submitAll(reveal.s, reveal.rng);
  reveal.s.players[1].score = 3;
  reveal.s.players[0].score = 2;
  chooseWinner(reveal.s, "caio", reveal.s.order[1]);

  const ended = started(lang);
  ended.s.targetScore = 5;
  ended.s.players[0].score = 4;
  ended.s.players[1].score = 3;
  ended.s.players[3].score = 1;
  submitAll(ended.s, ended.rng);
  const anaKey = ended.s.submissions.findIndex((x) => x.playerId === "ana");
  chooseWinner(ended.s, "caio", anaKey);
  nextRound(ended.s, ended.rng);

  return [
    { id: "home", label: "Início", view: null, isHost: false },
    {
      id: "lobbyHost",
      label: "Lobby (anfitrião)",
      view: buildView(lobbyState, "ana"),
      isHost: true,
    },
    {
      id: "lobbyGuest",
      label: "Lobby (convidado)",
      view: buildView(lobbyState, "bia"),
      isHost: false,
    },
    {
      id: "playing",
      label: "Mão",
      view: buildView(playing, "ana"),
      isHost: true,
    },
    {
      id: "playingPick2",
      label: "Mão (PICK 2)",
      view: buildView(pick2, "ana"),
      isHost: true,
    },
    {
      id: "submitted",
      label: "Já jogou",
      view: buildView(submitted.s, "ana"),
      isHost: true,
    },
    {
      id: "czarWaiting",
      label: "Czar aguardando",
      view: buildView(submitted.s, "caio"),
      isHost: false,
    },
    {
      id: "judgingCzar",
      label: "Julgamento (Czar)",
      view: buildView(judging.s, "caio"),
      isHost: false,
    },
    {
      id: "judgingPlayer",
      label: "Julgamento (jogador)",
      view: buildView(judging.s, "ana"),
      isHost: true,
    },
    {
      id: "reveal",
      label: "Revelação",
      view: buildView(reveal.s, "ana"),
      isHost: true,
    },
    {
      id: "ended",
      label: "Fim de jogo",
      view: buildView(ended.s, "ana"),
      isHost: true,
    },
  ];
}
