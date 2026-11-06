"use client";

import { useEffect } from "react";
import { isProduction, withBasePath } from "@/lib/env";

export function ServiceWorker() {
  useEffect(() => {
    if (!isProduction || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register(withBasePath("/sw.js"), { scope: withBasePath("/") })
      .catch(() => {});
  }, []);
  return null;
}
