"use client";

import { Check, Copy, Crown, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PACK_LANGS, packsFor } from "@/game/cards";
import { MIN_PLAYERS } from "@/game/engine";
import type { GameView } from "@/game/types";
import { isLocale, LOCALE_NAMES, useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

function inviteLink(code: string) {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/room/${code}`;
}

const langName = (lang: string) => (isLocale(lang) ? LOCALE_NAMES[lang] : lang);

export function Lobby({ view, isHost }: { view: GameView; isHost: boolean }) {
  const t = useT();
  const startGame = useGameStore((s) => s.startGame);
  const setTarget = useGameStore((s) => s.setTarget);
  const setDeckLanguage = useGameStore((s) => s.setDeckLanguage);
  const setPacks = useGameStore((s) => s.setPacks);
  const kick = useGameStore((s) => s.kick);
  const leave = useGameStore((s) => s.leave);
  const [copied, setCopied] = useState(false);
  const connected = view.players.filter((p) => p.connected).length;
  const packs = packsFor(view.lang);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink(view.code));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("lobby.copyFailed"));
    }
  };

  const togglePack = (key: string, active: boolean) =>
    setPacks(
      active ? view.packs.filter((k) => k !== key) : [...view.packs, key],
    );

  return (
    <div className="mx-auto flex w-full max-w-lg grow flex-col justify-center gap-6 p-6 pt-16">
      <section className="space-y-3 text-center">
        <p className="text-muted-foreground text-sm">{t("lobby.roomCode")}</p>
        <p className="font-bold font-mono text-5xl tracking-[0.3em]">
          {view.code}
        </p>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          {t("lobby.copyInvite")}
        </Button>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-sm">
          {t("lobby.players", { count: connected, min: MIN_PLAYERS })}
        </h2>
        <ul className="divide-y rounded-lg border">
          {view.players.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 px-3 py-2 text-sm"
            >
              <span className={p.connected ? "" : "text-muted-foreground"}>
                {p.name}
                {p.id === view.me ? ` ${t("lobby.you")}` : ""}
              </span>
              {p.isHost ? <Crown className="size-3.5 text-amber-500" /> : null}
              {!p.connected ? (
                <span className="text-muted-foreground text-xs">
                  {t("lobby.offline")}
                </span>
              ) : null}
              {isHost && !p.isHost ? (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="ml-auto"
                  aria-label={t("lobby.kick", { name: p.name })}
                  onClick={() => kick(p.id)}
                >
                  <UserX />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-sm">{t("lobby.deckLanguage")}</h2>
          {isHost ? (
            <div
              className="flex gap-1"
              role="radiogroup"
              aria-label={t("lobby.deckLanguage")}
            >
              {PACK_LANGS.map((lang) => (
                <Button
                  key={lang}
                  size="xs"
                  role="radio"
                  aria-checked={view.lang === lang}
                  variant={view.lang === lang ? "default" : "outline"}
                  onClick={() => setDeckLanguage(lang)}
                >
                  {langName(lang)}
                </Button>
              ))}
            </div>
          ) : (
            <span className="text-sm">{langName(view.lang)}</span>
          )}
        </div>
        <h3 className="sr-only">{t("lobby.cards")}</h3>
        <ul className="divide-y rounded-lg border">
          {packs.map((pack) => {
            const active = view.packs.includes(pack.key);
            const details = t("lobby.packDetails", {
              black: pack.black,
              white: pack.white,
            });
            return (
              <li key={pack.key} className="px-3 py-2 text-sm">
                {isHost ? (
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={active}
                      disabled={active && view.packs.length === 1}
                      onChange={() => togglePack(pack.key, active)}
                      className="accent-blklight-500"
                    />
                    <span className="grow">{pack.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {details}
                    </span>
                  </label>
                ) : (
                  <div
                    className={cn(
                      "flex items-center gap-2",
                      !active && "text-muted-foreground line-through",
                    )}
                  >
                    <span className="grow">{pack.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {details}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {isHost ? (
        <section className="space-y-4">
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>{t("lobby.targetScore")}</span>
            <input
              type="range"
              min={3}
              max={15}
              value={view.targetScore}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="grow accent-blklight-500"
            />
            <span className="w-6 text-right font-mono">{view.targetScore}</span>
          </label>
          <Button
            size="lg"
            className="w-full"
            disabled={connected < MIN_PLAYERS}
            onClick={startGame}
          >
            {t("lobby.start")}
          </Button>
        </section>
      ) : (
        <p className="text-center text-muted-foreground text-sm">
          {t("lobby.waitingHost")}
        </p>
      )}

      <Button variant="ghost" size="sm" className="mx-auto" onClick={leave}>
        {t("lobby.leave")}
      </Button>
    </div>
  );
}
