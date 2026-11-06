"use client";

import { useT } from "@/i18n";

export function SkipLink() {
  const t = useT();
  return (
    <a
      href="#content"
      className="sr-only z-200 rounded-md bg-prompt px-4 py-2 font-medium text-prompt-foreground text-sm shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:outline-none focus:ring-3 focus:ring-ring"
    >
      {t("a11y.skip")}
    </a>
  );
}
