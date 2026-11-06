"use client";

import { Check, Copy, Crown, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PACK_INFO } from "@/game/cards";
import { MIN_PLAYERS } from "@/game/engine";
import type { GameView } from "@/game/types";
import { useGameStore } from "@/store/useGameStore";

function inviteLink(code: string) {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/sala/${code}`;
}

export function Lobby({ view, isHost }: { view: GameView; isHost: boolean }) {
  const startGame = useGameStore((s) => s.startGame);
  const setTarget = useGameStore((s) => s.setTarget);
  const setPacks = useGameStore((s) => s.setPacks);
  const kick = useGameStore((s) => s.kick);
  const leave = useGameStore((s) => s.leave);
  const [copied, setCopied] = useState(false);
  const connected = view.players.filter((p) => p.connected).length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink(view.code));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-lg grow flex-col justify-center gap-6 p-6">
      <section className="space-y-3 text-center">
        <p className="text-muted-foreground text-sm">Código da sala</p>
        <p className="font-bold font-mono text-5xl tracking-[0.3em]">
          {view.code}
        </p>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check /> : <Copy />}
          Copiar link de convite
        </Button>
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold text-sm">
          Jogadores ({connected}/{MIN_PLAYERS}+ para começar)
        </h2>
        <ul className="divide-y rounded-lg border">
          {view.players.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 px-3 py-2 text-sm"
            >
              <span className={p.connected ? "" : "text-muted-foreground"}>
                {p.name}
                {p.id === view.me ? " (você)" : ""}
              </span>
              {p.isHost ? <Crown className="size-3.5 text-amber-500" /> : null}
              {!p.connected ? (
                <span className="text-muted-foreground text-xs">offline</span>
              ) : null}
              {isHost && !p.isHost ? (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="ml-auto"
                  aria-label={`Remover ${p.name}`}
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
        <h2 className="font-semibold text-sm">Cartas</h2>
        <ul className="divide-y rounded-lg border">
          {PACK_INFO.map((pack) => {
            const active = view.packs.includes(pack.key);
            const details = `${pack.lang} · ${pack.black} pretas, ${pack.white} brancas`;
            return (
              <li key={pack.key} className="px-3 py-2 text-sm">
                {isHost ? (
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={active}
                      disabled={active && view.packs.length === 1}
                      onChange={() =>
                        setPacks(
                          active
                            ? view.packs.filter((k) => k !== pack.key)
                            : [...view.packs, pack.key],
                        )
                      }
                      className="accent-blklight-500"
                    />
                    <span className="grow">{pack.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {details}
                    </span>
                  </label>
                ) : (
                  <div
                    className={
                      active
                        ? "flex items-center gap-2"
                        : "flex items-center gap-2 text-muted-foreground line-through"
                    }
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
            <span>Pontos para vencer</span>
            <input
              type="range"
              min={3}
              max={15}
              value={view.targetScore}
              onChange={(e) => setTarget(Number(e.target.value))}
              className="grow accent-blklight-500"
              aria-label="Pontos para vencer"
            />
            <span className="w-6 text-right font-mono">{view.targetScore}</span>
          </label>
          <Button
            size="lg"
            className="w-full"
            disabled={connected < MIN_PLAYERS}
            onClick={startGame}
          >
            Começar jogo
          </Button>
        </section>
      ) : (
        <p className="text-center text-muted-foreground text-sm">
          Aguardando o anfitrião começar o jogo…
        </p>
      )}

      <Button variant="ghost" size="sm" className="mx-auto" onClick={leave}>
        Sair da sala
      </Button>
    </div>
  );
}
