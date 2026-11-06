"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useGameStore } from "@/store/useGameStore";
import { HomeScreen } from "./home-screen";
import { Lobby } from "./lobby";
import { Table } from "./table";

export function GameRoot() {
  const view = useGameStore((s) => s.view);
  const role = useGameStore((s) => s.role);
  const notice = useGameStore((s) => s.notice);
  const hydrate = useGameStore((s) => s.hydrate);
  const dismissNotice = useGameStore((s) => s.dismissNotice);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (notice) {
      toast.error(notice);
      dismissNotice();
    }
  }, [notice, dismissNotice]);

  if (!view) return <HomeScreen />;
  const isHost = role === "host";
  return view.phase === "lobby" ? (
    <Lobby view={view} isHost={isHost} />
  ) : (
    <Table view={view} isHost={isHost} />
  );
}
