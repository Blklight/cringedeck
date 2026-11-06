"use client";

import { BookOpen, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef } from "react";
import { flushSync } from "react-dom";
import { headerButtonClass } from "@/components/header-button";
import { Hint } from "@/components/hint";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type TranslationKey, useT } from "@/i18n";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "book" | "system";

const OPTIONS: { theme: Theme; label: TranslationKey; icon: typeof Sun }[] = [
  { theme: "light", label: "theme.light", icon: Sun },
  { theme: "dark", label: "theme.dark", icon: Moon },
  { theme: "book", label: "theme.book", icon: BookOpen },
  { theme: "system", label: "theme.system", icon: Laptop },
];

export function AnimatedThemeToggler({ className }: { className?: string }) {
  const { setTheme } = useTheme();
  const t = useT();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const label = t("theme.toggle");

  const changeTheme = async (theme: Theme) => {
    const trigger = triggerRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!trigger || !document.startViewTransition || reduceMotion) {
      setTheme(theme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => setTheme(theme));
    }).ready;

    const { top, left, width, height } = trigger.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRad = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  return (
    <DropdownMenu modal={false}>
      <Hint label={label} side="bottom">
        <DropdownMenuTrigger
          ref={triggerRef}
          aria-label={label}
          className={cn(headerButtonClass, className)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
            <path d="M12 3l0 18" />
            <path d="M12 9l4.65 -4.65" />
            <path d="M12 14.3l7.37 -7.37" />
            <path d="M12 19.6l8.85 -8.85" />
          </svg>
        </DropdownMenuTrigger>
      </Hint>
      <DropdownMenuContent
        align="end"
        className="rounded-xs border-[#252525] dark:border-[#eaeaea]"
      >
        {OPTIONS.map(({ theme, label: optionLabel, icon: Icon }) => (
          <DropdownMenuItem
            key={theme}
            className="cursor-pointer rounded-xs"
            onClick={() => changeTheme(theme)}
          >
            <Icon className="mr-1 size-4" />
            {t(optionLabel)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
