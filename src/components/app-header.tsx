"use client";

import { Download, Languages } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInstallPrompt } from "@/hooks/use-install-prompt";
import { isLocale, LOCALE_NAMES, LOCALES, useLocale, useT } from "@/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

export function AppHeader() {
  const t = useT();
  const locale = useLocale();
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { canInstall, install } = useInstallPrompt();

  return (
    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 lg:top-5 lg:right-5">
      {canInstall ? (
        <Button variant="outline" size="sm" onClick={install}>
          <Download /> {t("header.install")}
        </Button>
      ) : null}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              aria-label={t("header.language")}
            />
          }
        >
          <Languages />
          <span className="uppercase">{locale.split("-")[0]}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(value) => {
              if (isLocale(value)) setLanguage(value);
            }}
          >
            {LOCALES.map((l) => (
              <DropdownMenuRadioItem key={l} value={l}>
                {LOCALE_NAMES[l]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AnimatedThemeToggler className="h-8 w-10 px-2" />
    </div>
  );
}
