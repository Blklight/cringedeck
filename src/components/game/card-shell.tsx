import type * as React from "react";
import { cn } from "@/lib/utils";

export type CardTone = "prompt" | "answer";
export type CardHighlight = "none" | "selected" | "winner";

const toneClass: Record<CardTone, string> = {
  prompt: "border-prompt-edge bg-prompt text-prompt-foreground",
  answer: "border-answer-edge bg-answer text-answer-foreground",
};

const highlightClass: Record<CardHighlight, string> = {
  none: "",
  selected: "ring-4 ring-prompt ring-offset-2 ring-offset-background",
  winner:
    "ring-4 ring-answer ring-offset-2 ring-offset-background shadow-[0_0_28px_rgb(250_204_21/0.55)]",
};

export function CardShell({
  tone,
  highlight = "none",
  className,
  innerClassName,
  children,
}: {
  tone: CardTone;
  highlight?: CardHighlight;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "game-card-surface overflow-hidden rounded-[18px] border-2 shadow-md transition-[box-shadow,translate] duration-200",
        toneClass[tone],
        highlightClass[highlight],
        className,
      )}
    >
      <div className={cn("h-full", innerClassName)}>{children}</div>
    </div>
  );
}
