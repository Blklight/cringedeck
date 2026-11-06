"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { detectLocale, useLocale, useT } from "@/i18n";
import { useGameStore } from "@/store/useGameStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { HomeScreen } from "./home-screen";
import { Lobby } from "./lobby";
import { Table } from "./table";

function useLanguageBootstrap() {
  const locale = useLocale();

  useEffect(() => {
    Promise.resolve(useLanguageStore.persist.rehydrate()).then(() => {
      const { chosen, setLanguage } = useLanguageStore.getState();
      if (!chosen) setLanguage(detectLocale(navigator.languages), false);
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
}

export function GameRoot() {
  const t = useT();
  const view = useGameStore((s) => s.view);
  const role = useGameStore((s) => s.role);
  const notice = useGameStore((s) => s.notice);
  const hydrate = useGameStore((s) => s.hydrate);
  const dismissNotice = useGameStore((s) => s.dismissNotice);

  useLanguageBootstrap();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!notice) return;
    toast.error(t(`errors.${notice.code}`, notice.params));
    dismissNotice();
  }, [notice, dismissNotice, t]);

  const isHost = role === "host";
  return (
    <>
      <AppHeader />
      {!view ? (
        <HomeScreen />
      ) : view.phase === "lobby" ? (
        <Lobby view={view} isHost={isHost} />
      ) : (
        <Table view={view} isHost={isHost} />
      )}
    </>
  );
}
