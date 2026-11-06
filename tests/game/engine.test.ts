import { describe, expect, it } from "vitest";
import { DEFAULT_PACKS, getBlack, PACKS, packKey } from "@/game/cards";
import {
  buildView,
  chooseWinner,
  createGame,
  GameError,
  HAND_SIZE,
  joinPlayer,
  nextRound,
  removePlayer,
  setConnected,
  setPacks,
  startGame,
  submitCards,
} from "@/game/engine";
import { countBlanks, fillBlanks } from "@/game/text";
import type { HostState, PlayerRec } from "@/game/types";

function seeded(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function newGame(players = 3): HostState {
  const rng = seeded();
  const s = createGame("ABCDE", "p0", "Ana");
  for (let i = 1; i < players; i++) joinPlayer(s, `p${i}`, `Jogador ${i}`, rng);
  startGame(s, rng);
  return s;
}

const nonCzar = (s: HostState) => s.players.filter((p) => p.id !== s.czarId);

function playAll(s: HostState) {
  const pick = getBlack(s.blackId as string)?.pick ?? 1;
  for (const p of nonCzar(s)) submitCards(s, p.id, p.hand.slice(0, pick));
}

describe("pacotes de cartas", () => {
  const allIds = PACKS.flatMap((p) =>
    [...p.black, ...p.white].map((c) => c.id),
  );

  it("tem IDs únicos entre todos os pacotes", () => {
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it("tem chaves de pacote únicas e o pacote padrão existe", () => {
    const keys = PACKS.map(packKey);
    expect(new Set(keys).size).toBe(keys.length);
    for (const key of DEFAULT_PACKS) expect(keys).toContain(key);
  });

  it.each(
    PACKS.map((p) => [packKey(p), p] as const),
  )("%s: cartas válidas", (_, pack) => {
    expect(pack.black.length).toBeGreaterThan(0);
    expect(pack.white.length).toBeGreaterThan(0);
    for (const card of [...pack.black, ...pack.white]) {
      expect(card.text.trim()).not.toBe("");
    }
    for (const card of pack.black) {
      expect(card.pick).toBeGreaterThanOrEqual(1);
      expect(card.pick).toBeGreaterThanOrEqual(countBlanks(card.text));
    }
    for (const card of pack.white) expect(countBlanks(card.text)).toBe(0);
  });

  it.each([
    "pt-BR.base",
    "en.base",
  ])("%s tem 100 pretas e 500 brancas", (key) => {
    const base = PACKS.find((p) => packKey(p) === key);
    expect(base?.black).toHaveLength(100);
    expect(base?.white).toHaveLength(500);
  });

  it("segue a convenção de IDs <lang>.<pacote>.<b|w><número>", () => {
    for (const pack of PACKS) {
      const prefix = `${packKey(pack)}.`;
      for (const [kind, cards] of [
        ["b", pack.black],
        ["w", pack.white],
      ] as const) {
        for (const c of cards) {
          expect(c.id.startsWith(prefix)).toBe(true);
          expect(c.id.slice(prefix.length)).toMatch(
            new RegExp(`^${kind}\\d{3,}$`),
          );
        }
      }
    }
  });
});

describe("fillBlanks", () => {
  it("preenche lacunas e remove o ponto final da resposta no meio da frase", () => {
    const segs = fillBlanks(
      { id: "x", text: "E o Oscar de ____ vai para ____.", pick: 2 },
      ["Batman.", "Queijo quente."],
    );
    expect(segs.map((s) => s.text).join("")).toBe(
      "E o Oscar de Batman vai para Queijo quente.",
    );
  });

  it("anexa a resposta quando a carta é uma pergunta", () => {
    const segs = fillBlanks({ id: "x", text: "O que é esse som?", pick: 1 }, [
      "Batman.",
    ]);
    expect(segs.map((s) => s.text).join("")).toBe("O que é esse som? Batman.");
  });
});

describe("engine", () => {
  it("exige ao menos 3 jogadores", () => {
    const s = createGame("ABCDE", "p0", "Ana");
    joinPlayer(s, "p1", "Beto");
    expect(() => startGame(s)).toThrow(GameError);
  });

  it("distribui 10 cartas a cada jogador, sem repetir", () => {
    const s = newGame(4);
    const all = s.players.flatMap((p) => p.hand);
    expect(s.players.every((p) => p.hand.length === HAND_SIZE)).toBe(true);
    expect(new Set(all).size).toBe(all.length);
    expect(s.phase).toBe("playing");
  });

  it("não deixa desmarcar todos os pacotes", () => {
    const s = createGame("ABCDE", "p0", "Ana");
    expect(() => setPacks(s, [])).toThrow(GameError);
    expect(() => setPacks(s, ["xx.inexistente"])).toThrow(GameError);
    expect(s.packs).toEqual(DEFAULT_PACKS);
  });

  it("evita nomes duplicados", () => {
    const s = createGame("ABCDE", "p0", "Ana");
    const p = joinPlayer(s, "p1", "Ana");
    expect(p.name).toBe("Ana (2)");
  });

  it("vai para o julgamento quando todos jogam e esconde autores", () => {
    const s = newGame();
    playAll(s);
    expect(s.phase).toBe("judging");
    const view = buildView(s, s.czarId as string);
    expect(view.submissions).toHaveLength(2);
    expect(view.submissions.every((x) => x.playerId === undefined)).toBe(true);
  });

  it("não deixa o Czar jogar nem jogar cartas que não tem", () => {
    const s = newGame();
    const czar = s.players.find((p) => p.id === s.czarId);
    expect(() =>
      submitCards(s, s.czarId as string, [czar?.hand[0] ?? ""]),
    ).toThrow();
    const [p] = nonCzar(s);
    const foreign = s.players.find((x) => x.id !== p.id)?.hand[0] as string;
    expect(() => submitCards(s, p.id, [foreign])).toThrow(GameError);
  });

  it("pontua o vencedor, revela autores e roda o Czar", () => {
    const s = newGame();
    const czar = s.czarId as string;
    playAll(s);
    const key = s.order[0];
    const winnerId = s.submissions[key].playerId;
    expect(() => chooseWinner(s, nonCzar(s)[0].id, key)).toThrow(GameError);
    chooseWinner(s, czar, key);
    expect(s.players.find((p) => p.id === winnerId)?.score).toBe(1);
    expect(buildView(s, czar).submissions[0].playerId).toBeDefined();
    nextRound(s);
    expect(s.czarId).not.toBe(czar);
    expect(s.round).toBe(2);
    expect(s.players.every((p) => p.hand.length === HAND_SIZE)).toBe(true);
  });

  it("termina o jogo ao atingir a pontuação alvo", () => {
    const s = newGame();
    s.targetScore = 1;
    playAll(s);
    chooseWinner(s, s.czarId as string, s.order[0]);
    expect(s.gameOver).toBe(true);
    nextRound(s);
    expect(s.phase).toBe("ended");
  });

  it("avança quando um jogador pendente desconecta", () => {
    const s = newGame();
    const [a, b] = nonCzar(s);
    submitCards(
      s,
      a.id,
      a.hand.slice(0, getBlack(s.blackId as string)?.pick ?? 1),
    );
    expect(s.phase).toBe("playing");
    setConnected(s, b.id, false);
    expect(s.phase).toBe("judging");
  });

  it("pula a rodada quando o Czar desconecta e devolve as cartas", () => {
    const s = newGame();
    const czar = s.czarId as string;
    const [a] = nonCzar(s);
    submitCards(
      s,
      a.id,
      a.hand.slice(0, getBlack(s.blackId as string)?.pick ?? 1),
    );
    setConnected(s, czar, false);
    expect(s.czarId).not.toBe(czar);
    expect(s.phase).toBe("playing");
    expect(s.submissions).toHaveLength(0);
    expect(a.hand).toHaveLength(HAND_SIZE);
  });

  it("remove jogador no meio da partida sem quebrar o estado", () => {
    const s = newGame(4);
    const victim = nonCzar(s).find((p) => p.id !== s.hostId) as PlayerRec;
    removePlayer(s, victim.id);
    expect(s.players).toHaveLength(3);
    playAll(s);
    expect(s.phase).toBe("judging");
  });

  it("reaproveita o descarte quando o baralho acaba", () => {
    const s = newGame();
    s.whiteDiscard = s.whiteDeck.splice(0);
    playAll(s);
    chooseWinner(s, s.czarId as string, s.order[0]);
    nextRound(s);
    expect(s.players.every((p) => p.hand.length === HAND_SIZE)).toBe(true);
  });
});
