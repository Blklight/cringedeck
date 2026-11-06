"use client";

import { Crown, LogOut, Trophy, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { whiteText } from "@/game/cards";
import type { GameView, PlayerView } from "@/game/types";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { BlackCardView, WhiteCardView } from "./game-card";

const texts = (cards: string[]) => cards.map(whiteText);

function Scoreboard({ view }: { view: GameView }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {view.players.map((p) => (
        <li
          key={p.id}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
            p.isCzar && "border-amber-500 bg-amber-500/10",
            !p.connected && "opacity-50",
          )}
        >
          {p.isCzar ? <Crown className="size-3 text-amber-500" /> : null}
          <span className="font-medium">
            {p.name}
            {p.id === view.me ? " (você)" : ""}
          </span>
          <span className="font-mono">{p.score}</span>
          {view.phase === "playing" && !p.isCzar && p.connected ? (
            <span
              className={cn(
                "size-1.5 rounded-full",
                p.submitted ? "bg-emerald-500" : "bg-muted-foreground/40",
              )}
              title={p.submitted ? "Já jogou" : "Pensando…"}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function Hand({ view }: { view: GameView }) {
  const play = useGameStore((s) => s.play);
  const [selected, setSelected] = useState<string[]>([]);
  const need = view.black?.pick ?? 1;

  const toggle = (card: string) =>
    setSelected((cur) => {
      if (cur.includes(card)) return cur.filter((c) => c !== card);
      return cur.length >= need ? [...cur.slice(1), card] : [...cur, card];
    });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-semibold text-sm">
          Sua mão{need > 1 ? ` — escolha ${need} cartas, na ordem` : ""}
        </h2>
        <Button
          disabled={selected.length !== need}
          onClick={() => play(selected)}
        >
          Jogar {need > 1 ? "cartas" : "carta"}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {view.hand.map((card) => (
          <WhiteCardView
            key={card}
            text={whiteText(card)}
            selected={selected.includes(card)}
            order={selected.indexOf(card) + 1}
            onClick={() => toggle(card)}
          />
        ))}
      </div>
    </section>
  );
}

function Submissions({ view, canPick }: { view: GameView; canPick: boolean }) {
  const pick = useGameStore((s) => s.pick);
  const [chosen, setChosen] = useState<number | null>(null);
  const black = view.black;
  if (!black) return null;
  const nameOf = (id?: string) =>
    view.players.find((p: PlayerView) => p.id === id)?.name;

  return (
    <section className="space-y-4">
      {canPick ? (
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-sm">Escolha a melhor resposta</h2>
          <Button
            disabled={chosen === null}
            onClick={() => chosen !== null && pick(chosen)}
          >
            <Trophy /> Escolher vencedora
          </Button>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {view.submissions.map((sub) => {
          const isWinner = view.winnerKey === sub.key;
          const picked = chosen === sub.key;
          const card = (
            <BlackCardView
              card={black}
              answers={texts(sub.cards)}
              className={cn(
                "aspect-auto min-h-48 w-full",
                (picked || isWinner) && "ring-4 ring-amber-400",
              )}
            />
          );
          return (
            <div key={sub.key} className="space-y-1.5">
              {canPick ? (
                <button
                  type="button"
                  className="block w-full text-left"
                  aria-pressed={picked}
                  onClick={() => setChosen(sub.key)}
                >
                  {card}
                </button>
              ) : (
                card
              )}
              {sub.playerId ? (
                <p
                  className={cn(
                    "text-center text-sm",
                    isWinner && "font-bold text-amber-500",
                  )}
                >
                  {isWinner ? "🏆 " : ""}
                  {nameOf(sub.playerId)}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Standings({ view, isHost }: { view: GameView; isHost: boolean }) {
  const restart = useGameStore((s) => s.restart);
  const leave = useGameStore((s) => s.leave);
  const ranked = [...view.players].sort((a, b) => b.score - a.score);
  return (
    <section className="mx-auto w-full max-w-md space-y-4 text-center">
      <Trophy className="mx-auto size-10 text-amber-500" />
      <h2 className="font-bold text-2xl">{ranked[0]?.name} venceu!</h2>
      <ol className="divide-y rounded-lg border text-left">
        {ranked.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 px-4 py-2 text-sm">
            <span className="w-5 font-mono text-muted-foreground">{i + 1}</span>
            <span className="grow">{p.name}</span>
            <span className="font-mono">{p.score}</span>
          </li>
        ))}
      </ol>
      <div className="flex justify-center gap-2">
        {isHost ? <Button onClick={restart}>Jogar de novo</Button> : null}
        <Button variant="outline" onClick={leave}>
          Sair
        </Button>
      </div>
      {!isHost ? (
        <p className="text-muted-foreground text-xs">
          Aguardando o anfitrião reabrir a sala…
        </p>
      ) : null}
    </section>
  );
}

export function Table({ view, isHost }: { view: GameView; isHost: boolean }) {
  const next = useGameStore((s) => s.next);
  const leave = useGameStore((s) => s.leave);
  const reconnecting = useGameStore((s) => s.reconnecting);

  const iAmCzar = view.czarId === view.me;
  const czar = view.players.find((p) => p.isCzar);
  const waiting = view.players.filter(
    (p) => p.connected && !p.isCzar && !p.submitted,
  ).length;
  const canAdvance = iAmCzar || isHost;

  return (
    <div className="mx-auto flex w-full max-w-5xl grow flex-col gap-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          {reconnecting ? (
            <WifiOff className="size-4 text-destructive" />
          ) : (
            <Wifi className="size-4" />
          )}
          Sala <span className="font-mono">{view.code}</span> · Rodada{" "}
          {view.round} · Vence quem fizer {view.targetScore} pontos
        </div>
        <Button
          variant="ghost"
          size="xs"
          className="ml-auto"
          onClick={() => {
            if (window.confirm("Sair da partida?")) leave();
          }}
        >
          <LogOut /> Sair
        </Button>
      </header>

      <Scoreboard view={view} />

      {view.phase === "ended" ? (
        <Standings view={view} isHost={isHost} />
      ) : (
        <>
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            {view.black &&
            view.phase !== "judging" &&
            view.phase !== "reveal" ? (
              <BlackCardView card={view.black} className="w-full max-w-60" />
            ) : null}
            <div className="space-y-1">
              <p className="font-semibold">
                {iAmCzar
                  ? "Você é o Czar desta rodada."
                  : `${czar?.name ?? "Alguém"} é o Czar.`}
              </p>
              <p className="text-muted-foreground text-sm">
                {view.phase === "playing" && iAmCzar
                  ? `Aguardando respostas (${waiting} pendente${waiting === 1 ? "" : "s"})…`
                  : null}
                {view.phase === "playing" && !iAmCzar && view.mySubmission
                  ? `Você jogou. Aguardando ${waiting} jogador${waiting === 1 ? "" : "es"}…`
                  : null}
                {view.phase === "playing" && !iAmCzar && !view.mySubmission
                  ? "Escolha sua resposta mais cringe."
                  : null}
                {view.phase === "judging"
                  ? iAmCzar
                    ? "Leia em voz alta e escolha a melhor."
                    : "O Czar está escolhendo…"
                  : null}
                {view.phase === "reveal"
                  ? view.gameOver
                    ? "Fim de jogo!"
                    : "Rodada encerrada."
                  : null}
              </p>
              {view.phase === "reveal" && canAdvance ? (
                <Button onClick={next}>
                  {view.gameOver ? "Ver resultado" : "Próxima rodada"}
                </Button>
              ) : null}
              {view.phase === "reveal" && !canAdvance ? (
                <p className="text-muted-foreground text-xs">
                  Aguardando o Czar seguir para a próxima rodada.
                </p>
              ) : null}
            </div>
          </div>

          {view.phase === "playing" && !iAmCzar && !view.mySubmission ? (
            <Hand key={view.round} view={view} />
          ) : null}
          {view.phase === "playing" && view.mySubmission && view.black ? (
            <BlackCardView
              card={view.black}
              answers={texts(view.mySubmission)}
              className="aspect-auto min-h-40 w-full max-w-sm"
            />
          ) : null}
          {view.phase === "judging" || view.phase === "reveal" ? (
            <Submissions
              key={`${view.round}-${view.phase}`}
              view={view}
              canPick={view.phase === "judging" && iAmCzar}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
