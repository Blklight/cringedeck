"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/i18n";
import { APP_NAME } from "@/lib/brand";
import { useGameStore } from "@/store/useGameStore";

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

  const [typedName, setTypedName] = useState<string | null>(null);
  const [code, setCode] = useState(initialCode);
  const name = typedName ?? savedName;
  const busy = status === "connecting";
  const hasName = name.trim().length > 0;

  return (
    <div className="mx-auto flex w-full max-w-md grow flex-col justify-center gap-6 p-6">
      <header className="space-y-3 text-center">
        <div className="mx-auto w-fit -rotate-2 rounded-xl bg-neutral-950 px-6 py-5 text-left text-white shadow-lg dark:bg-white dark:text-neutral-950">
          <h1 className="font-bold text-4xl leading-none tracking-tight">
            {APP_NAME}
          </h1>
        </div>
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
          placeholder={t("home.namePlaceholder")}
          onChange={(e) => setTypedName(e.target.value)}
          disabled={busy}
        />
      </div>

      <div className="space-y-3">
        <Button
          size="lg"
          className="w-full"
          disabled={!hasName || busy}
          onClick={() => createRoom(name)}
        >
          {busy ? <Loader2 className="animate-spin" /> : null}
          {t("home.createRoom")}
        </Button>

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
            placeholder={t("home.codePlaceholder")}
            className="font-mono uppercase tracking-widest"
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            disabled={busy}
            aria-label={t("home.codeLabel")}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={!hasName || code.trim().length < 3 || busy}
          >
            {t("home.join")}
          </Button>
        </form>

        {lastRoom ? (
          <Button
            variant="secondary"
            className="w-full"
            disabled={busy}
            onClick={() => resumeRoom()}
          >
            {t("home.resume", { code: lastRoom.code })}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
