"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { ctaClass } from "./styles";

function initialCode() {
  if (typeof window === "undefined") return "";
  const match = window.location.hash.match(
    /^#\/?(?:sala|room)\/([A-Za-z0-9]+)/,
  );
  return match ? match[1].toUpperCase() : "";
}

export function HomeScreen() {
  const t = useT();
  const status = useGameStore((s) => s.status);
  const savedName = useGameStore((s) => s.savedName);
  const lastRoom = useGameStore((s) => s.lastRoom);
  const createRoom = useGameStore((s) => s.createRoom);
  const joinRoom = useGameStore((s) => s.joinRoom);
  const resumeRoom = useGameStore((s) => s.resumeRoom);
  const hydrate = useGameStore((s) => s.hydrate);
  const setName = useGameStore((s) => s.setName);

  const [code, setCode] = useState(initialCode);
  const name = savedName;

  useEffect(() => {
    hydrate();
  }, [hydrate]);
  const busy = status === "connecting";
  const hasName = name.trim().length > 0;

  return (
    <div className="mx-auto flex w-full max-w-md grow flex-col justify-center gap-6 p-6">
      <header className="space-y-3 text-center">
        <h1 className="flex justify-center">
          <Logo size="lg" stacked />
        </h1>
        <p className="text-muted-foreground text-sm">{t("app.tagline")}</p>
      </header>

      <div className="space-y-1.5">
        <label htmlFor="player-name" className="font-medium text-sm">
          {t("home.nameLabel")}
        </label>
        <Input
          id="player-name"
          value={name}
          maxLength={20}
          autoComplete="nickname"
          placeholder={t("home.namePlaceholder")}
          onChange={(e) => setName(e.target.value)}
          disabled={busy}
        />
      </div>

      <div className="space-y-3">
        <Hint
          label={!hasName ? t("hint.needName") : null}
          wrapClassName="block"
        >
          <Button
            size="lg"
            className={cn("w-full", ctaClass)}
            disabled={!hasName || busy}
            onClick={() => createRoom(name)}
          >
            {busy ? <Loader2 className="animate-spin" /> : null}
            {t("home.createRoom")}
          </Button>
        </Hint>

        <div className="flex items-center gap-3 text-muted-foreground text-xs">
          <div className="h-px grow bg-border" />
          {t("home.orJoin")}
          <div className="h-px grow bg-border" />
        </div>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            joinRoom(code, name);
          }}
        >
          <Input
            value={code}
            maxLength={8}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder={t("home.codePlaceholder")}
            className="font-mono uppercase tracking-widest"
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={busy}
            aria-label={t("home.codeLabel")}
          />
          <Hint
            label={
              !hasName
                ? t("hint.needName")
                : code.trim().length < 3
                  ? t("hint.needCode")
                  : null
            }
            wrapClassName="inline-flex"
          >
            <Button
              type="submit"
              variant="outline"
              disabled={!hasName || code.trim().length < 3 || busy}
            >
              {t("home.join")}
            </Button>
          </Hint>
        </form>

        {lastRoom ? (
          <Hint label={t("hint.resume")}>
            <Button
              variant="secondary"
              className="w-full"
              disabled={busy}
              onClick={() => resumeRoom()}
            >
              {t("home.resume", { code: lastRoom.code })}
            </Button>
          </Hint>
        ) : null}
      </div>
    </div>
  );
}
