"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { useLanguageBootstrap } from "@/components/game/game-root";
import { HomeScreen } from "@/components/game/home-screen";
import { Lobby } from "@/components/game/lobby";
import { Table } from "@/components/game/table";
import { RulesSheet } from "@/components/rules-sheet";
import { Button } from "@/components/ui/button";
import { PACK_LANGS } from "@/game/cards";
import { cn } from "@/lib/utils";
import { buildScenarios, type ScenarioId } from "./scenarios";

export function PreviewGallery() {
  useLanguageBootstrap();
  const [deckLang, setDeckLang] = useState("pt-BR");
  const [current, setCurrent] = useState<ScenarioId>("playing");
  const scenarios = useMemo(() => buildScenarios(deckLang), [deckLang]);
  const scenario = scenarios.find((s) => s.id === current) ?? scenarios[0];

  return (
    <>
      <AppHeader showLogo={Boolean(scenario.view)} />
      <RulesSheet className="bottom-24 lg:bottom-24" />
      <div className="flex grow flex-col pb-28">
        {!scenario.view ? (
          <HomeScreen />
        ) : scenario.view.phase === "lobby" ? (
          <Lobby view={scenario.view} isHost={scenario.isHost} />
        ) : (
          <Table view={scenario.view} isHost={scenario.isHost} />
        )}
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-2 backdrop-blur lg:bottom-3 lg:mx-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-1">
          <span className="mr-1 font-semibold text-muted-foreground text-xs">
            PREVIEW
          </span>
          {scenarios.map((s) => (
            <Button
              key={s.id}
              size="xs"
              variant={s.id === scenario.id ? "default" : "outline"}
              onClick={() => setCurrent(s.id)}
            >
              {s.label}
            </Button>
          ))}
          <span className="ml-auto flex items-center gap-1 text-muted-foreground text-xs">
            Cartas:
            {PACK_LANGS.map((lang) => (
              <Button
                key={lang}
                size="xs"
                variant={lang === deckLang ? "secondary" : "ghost"}
                className={cn(lang === deckLang && "font-bold")}
                onClick={() => setDeckLang(lang)}
              >
                {lang}
              </Button>
            ))}
          </span>
        </div>
      </nav>
    </>
  );
}
