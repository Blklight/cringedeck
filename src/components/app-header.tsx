"use client";

import { Download, Languages } from "lucide-react";
import { AboutDialog } from "@/components/about-dialog";
import { Logo } from "@/components/brand/logo";
import { headerButtonClass } from "@/components/header-button";
import { Hint } from "@/components/hint";
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
import { cn } from "@/lib/utils";
import { useLanguageStore } from "@/store/useLanguageStore";

export function AppHeader({ showLogo = true }: { showLogo?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const { canInstall, install } = useInstallPrompt();

  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 px-3 py-3 lg:px-5 lg:py-4">
      <div
        className={cn("transition-opacity", !showLogo && "invisible opacity-0")}
      >
        <Logo />
      </div>
      <div className="ml-auto flex items-center gap-1">
        {canInstall ? (
          <Hint label={t("header.installHint")} side="bottom">
            <Button variant="outline" size="sm" onClick={install}>
              <Download aria-hidden="true" />
              <span className="hidden sm:inline">{t("header.install")}</span>
              <span className="sr-only sm:hidden">{t("header.install")}</span>
            </Button>
          </Hint>
        ) : null}
        <DropdownMenu modal={false}>
          <Hint label={t("header.language")} side="bottom">
            <DropdownMenuTrigger
              className={cn(headerButtonClass, "px-2.5 font-semibold text-xs")}
            >
              <Languages aria-hidden="true" />
              <span className="uppercase">{locale.split("-")[0]}</span>
              <span className="sr-only">
                , {t("header.language")}: {LOCALE_NAMES[locale]}
              </span>
            </DropdownMenuTrigger>
          </Hint>
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
        <AboutDialog />
        <AnimatedThemeToggler />
      </div>
    </header>
  );
}
