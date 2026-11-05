"use client";

import { BookOpen, Laptop, Monitor, Moon, Sun, SunDim } from "lucide-react";
import { useRef, useState } from "react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { LanguageStore } from "@/utils/interfaces";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type props = {
  className?: string;
};

type Theme = "light" | "dark" | "book" | "system";

export const AnimatedThemeToggler = ({ className }: props) => {
  const { theme, setTheme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore() as LanguageStore;
  const themes: Theme[] = ["light", "dark", "system"];
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const isDarkMode = theme === "dark";

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    const newTheme = isDarkMode ? "light" : "dark";

    // Verifica se o browser suporta View Transitions
    if (!document.startViewTransition) {
      // Fallback para browsers que não suportam
      setTheme(newTheme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

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

  const handleChangeTheme = async (theme: Theme) => {
    console.log("Changing to theme:", buttonRef.current);
    if (!buttonRef.current) return;

    const newTheme = theme;
    console.log("New Theme:", newTheme);

    // Verifica se o browser suporta View Transitions
    if (!document.startViewTransition) {
      // Fallback para browsers que não suportam
      setTheme(newTheme);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme);
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

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
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex gap-1 justify-center items-center w-12 h-10 px-4 hover:bg-[#252525] dark:hover:bg-[#eaeaea] text-[#252525] hover:text-[#eaeaea] dark:text-[#eaeaea] dark:hover:text-[#252525] rounded-xs cursor-pointer outline-none"
            suppressHydrationWarning
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
              className="size-4.5"
              aria-label={
                language === "en-us"
                  ? "Toggle light and dark modes"
                  : "Alternar modos de luz e escuro"
              }
            >
              <title>
                {language === "en-us"
                  ? "Toggle light and dark modes"
                  : "Alternar modos de luz e escuro"}
              </title>
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 3l0 18" />
              <path d="M12 9l4.65 -4.65" />
              <path d="M12 14.3l7.37 -7.37" />
              <path d="M12 19.6l8.85 -8.85" />
            </svg>

            <span className="sr-only">Toggle theme</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="rounded-xs border-[#252525] dark:border-[#eaeaea]"
          disablePortal={false}
        >
          <DropdownMenuItem
            ref={buttonRef}
            className="rounded-xs cursor-pointer"
            onClick={() => handleChangeTheme("light")}
          >
            <Sun className="mr-1 h-4 w-4" /> Claro
          </DropdownMenuItem>
          <DropdownMenuItem
            ref={buttonRef}
            className="rounded-xs cursor-pointer"
            onClick={() => handleChangeTheme("dark")}
          >
            <Moon className="mr-1 h-4 w-4" />
            Escuro
          </DropdownMenuItem>
          <DropdownMenuItem
            ref={buttonRef}
            className="rounded-xs cursor-pointer"
            onClick={() => handleChangeTheme("book")}
          >
            <BookOpen className="mr-1 h-4 w-4" />
            Livro
          </DropdownMenuItem>
          <DropdownMenuItem
            ref={buttonRef}
            className="rounded-xs cursor-pointer"
            onClick={() => handleChangeTheme("system")}
          >
            <Laptop className="mr-1 h-4 w-4" />
            Sistema
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
