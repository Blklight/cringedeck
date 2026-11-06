"use client";

import { Crown, LogOut, Trophy, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { whiteText } from "@/game/cards";
import type { GameView } from "@/game/types";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { BlackCardView, WhiteCardView } from "./game-card";
import { ctaClass, czarChipClass } from "./styles";

const texts = (cards: string[]) => cards.map(whiteText);

function Scoreboard({ view }: { view: GameView }) {
  const t = useT();
  return (
    <ul className="flex flex-wrap gap-2" aria-label={t("a11y.scoreboard")}>
      {view.players.map((p) => (
        <li
          key={p.id}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs",
            p.isCzar && czarChipClass,
            !p.connected && "opacity-50",
          )}
        >
          {p.isCzar ? (
            <>
              <Crown aria-hidden="true" className="size-3" />
              <span className="sr-only">{t("a11y.czar")}:</span>
            </>
          ) : null}
          <span className="font-medium">
            {p.name}
            {p.id === view.me ? ` ${t("lobby.you")}` : ""}
          </span>
          <span className="font-mono" aria-hidden="true">
            {p.score}
          </span>
          <span className="sr-only">
            , {t("a11y.points", { count: p.score })}
            {p.connected ? "" : `, ${t("lobby.offline")}`}
          </span>
          {view.phase === "playing" && !p.isCzar && p.connected ? (
            <>
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 rounded-full",
                  p.submitted ? "bg-emerald-500" : "bg-muted-foreground/40",
                )}
                title={p.submitted ? t("table.submitted") : t("table.thinking")}
              />
              <span className="sr-only">
                , {p.submitted ? t("table.submitted") : t("table.thinking")}
              </span>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function Hand({ view }: { view: GameView }) {
  const t = useT();
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
          {need > 1 ? t("table.handPick", { pick: need }) : t("table.hand")}
        </h2>
        <Hint
          label={
            selected.length !== need
              ? t("hint.selectCards", { count: need })
              : null
          }
          wrapClassName="inline-flex"
        >
          <Button
            className={ctaClass}
            disabled={selected.length !== need}
            onClick={() => play(selected)}
          >
            {t("table.play", { count: need })}
          </Button>
        </Hint>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-3 sm:grid-cols-3 lg:grid-cols-5">
        {view.hand.map((card) => (
          <WhiteCardView
            key={card}
            lang={view.lang}
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
  const t = useT();
  const pick = useGameStore((s) => s.pick);
  const [chosen, setChosen] = useState<number | null>(null);
  const black = view.black;
  if (!black) return null;
  const nameOf = (id?: string) => view.players.find((p) => p.id === id)?.name;

  return (
    <section className="space-y-4">
      {canPick ? (
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-sm">{t("table.pickBest")}</h2>
          <Hint
            label={chosen === null ? t("hint.selectAnswer") : null}
            wrapClassName="inline-flex"
          >
            <Button
              className={ctaClass}
              disabled={chosen === null}
              onClick={() => chosen !== null && pick(chosen)}
            >
              <Trophy aria-hidden="true" /> {t("table.chooseWinner")}
            </Button>
          </Hint>
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {view.submissions.map((sub) => {
          const isWinner = view.winnerKey === sub.key;
          const picked = chosen === sub.key;
          const card = (
            <BlackCardView
              card={black}
              answers={texts(sub.cards)}
              lang={view.lang}
              highlight={isWinner ? "winner" : picked ? "selected" : "none"}
              className="w-full"
            />
          );
          return (
            <div key={sub.key} className="space-y-1.5">
              {canPick ? (
                <button
                  type="button"
                  className="block w-full rounded-[18px] text-left outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                  className={cn("text-center text-sm", isWinner && "font-bold")}
                >
                  {isWinner ? (
                    <span className="flat-mark">🏆 {nameOf(sub.playerId)}</span>
                  ) : (
                    nameOf(sub.playerId)
                  )}
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
  const t = useT();
  const restart = useGameStore((s) => s.restart);
  const leave = useGameStore((s) => s.leave);
  const ranked = [...view.players].sort((a, b) => b.score - a.score);
  return (
    <section className="mx-auto w-full max-w-md space-y-4 text-center">
      <Trophy aria-hidden="true" className="mx-auto size-10 text-answer-edge" />
      <h2 className="font-bold text-2xl">
        {t("end.winner", { name: ranked[0]?.name ?? "" })}
      </h2>
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
        {isHost ? (
          <Hint label={t("hint.playAgain")}>
            <Button className={ctaClass} onClick={restart}>
              {t("end.playAgain")}
            </Button>
          </Hint>
        ) : null}
        <Hint label={t("hint.leaveRoom")}>
          <Button variant="outline" onClick={leave}>
            {t("end.leave")}
          </Button>
        </Hint>
      </div>
      {!isHost ? (
        <p className="text-muted-foreground text-xs">{t("end.waitingHost")}</p>
      ) : null}
    </section>
  );
}

function StatusLine({ view, iAmCzar }: { view: GameView; iAmCzar: boolean }) {
  const t = useT();
  const waiting = view.players.filter(
    (p) => p.connected && !p.isCzar && !p.submitted,
  ).length;
  if (view.phase === "playing") {
    if (iAmCzar) return t("table.waitingAnswers", { count: waiting });
    if (view.mySubmission) return t("table.waitingPlayers", { count: waiting });
    return t("table.chooseAnswer");
  }
  if (view.phase === "judging") {
    return iAmCzar ? t("table.readAloud") : t("table.czarChoosing");
  }
  if (view.phase === "reveal") {
    return view.gameOver ? t("table.gameOver") : t("table.roundOver");
  }
  return null;
}

export function Table({ view, isHost }: { view: GameView; isHost: boolean }) {
  const t = useT();
  const next = useGameStore((s) => s.next);
  const leave = useGameStore((s) => s.leave);
  const reconnecting = useGameStore((s) => s.reconnecting);

  const iAmCzar = view.czarId === view.me;
  const czar = view.players.find((p) => p.isCzar);
  const canAdvance = iAmCzar || isHost;
  const winnerId = view.submissions.find(
    (s) => s.key === view.winnerKey,
  )?.playerId;
  const roundWinner =
    view.phase === "reveal"
      ? view.players.find((p) => p.id === winnerId)?.name
      : undefined;
  const showBlackAlone =
    view.black && view.phase !== "judging" && view.phase !== "reveal";

  return (
    <div className="mx-auto flex w-full max-w-7xl grow flex-col gap-5 p-4 pt-16 sm:p-6 sm:pt-16 xl:px-10">
      <header className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <output className="flex items-center">
            {reconnecting ? (
              <WifiOff aria-hidden="true" className="size-4 text-destructive" />
            ) : (
              <Wifi aria-hidden="true" className="size-4" />
            )}
            <span className="sr-only">
              {reconnecting ? t("a11y.reconnecting") : t("a11y.connected")}
            </span>
          </output>
          <h1 className="font-mono">{t("table.room", { code: view.code })}</h1>·{" "}
          {t("table.round", { round: view.round })} ·{" "}
          {t("table.target", { target: view.targetScore })}
        </div>
        <Hint label={t("hint.leaveRoom")}>
          <Button
            variant="ghost"
            size="xs"
            className="ml-auto"
            onClick={() => {
              if (window.confirm(t("table.leaveConfirm"))) leave();
            }}
          >
            <LogOut aria-hidden="true" /> {t("table.leave")}
          </Button>
        </Hint>
      </header>

      <Scoreboard view={view} />

      {view.phase === "ended" ? (
        <Standings view={view} isHost={isHost} />
      ) : (
        <>
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            {showBlackAlone && view.black ? (
              <BlackCardView
                card={view.black}
                lang={view.lang}
                answers={view.mySubmission ? texts(view.mySubmission) : []}
                className="w-full max-w-64"
              />
            ) : null}
            <div className="space-y-1">
              <p className="font-semibold">
                {iAmCzar
                  ? t("table.youAreCzar")
                  : t("table.someoneCzar", {
                      name: czar?.name ?? t("table.someone"),
                    })}
              </p>
              <output
                aria-live="polite"
                className="block text-muted-foreground text-sm"
              >
                <StatusLine view={view} iAmCzar={iAmCzar} />
                {roundWinner ? (
                  <span className="sr-only">
                    {" "}
                    {t("a11y.roundWinner", { name: roundWinner })}
                  </span>
                ) : null}
              </output>
              {view.phase === "reveal" && canAdvance ? (
                <Hint label={view.gameOver ? null : t("hint.nextRound")}>
                  <Button className={ctaClass} onClick={next}>
                    {view.gameOver
                      ? t("table.seeResults")
                      : t("table.nextRound")}
                  </Button>
                </Hint>
              ) : null}
              {view.phase === "reveal" && !canAdvance ? (
                <p className="text-muted-foreground text-xs">
                  {t("table.waitingCzarNext")}
                </p>
              ) : null}
            </div>
          </div>

          {view.phase === "playing" && !iAmCzar && !view.mySubmission ? (
            <Hand key={view.round} view={view} />
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
