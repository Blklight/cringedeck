"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { type Corner, chamferClass } from "./chamfer-utils";
import { useFillet } from "./fillet-card";

export function FlipCard({
  front,
  back,
  axis = "y",
  flipped,
  onFlippedChange,
  className,
  corners = ["tl", "br"],
  trigger = "card",
  shape = "cut",
  radius = 4,
  rounded = 0,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  axis?: "x" | "y";
  flipped?: boolean;
  onFlippedChange?: (v: boolean) => void;
  className?: string;
  corners?: "all" | Corner[];
  /** "card": todo o card vira ao clicar. "peel": só a orelha (frente) e o botão Voltar (verso). */
  trigger?: "card" | "peel";
  /** "smooth" suaviza os cortes; `rounded` arredonda os cantos sem chanfro (px) */
  shape?: "cut" | "smooth";
  radius?: number;
  rounded?: number;
}) {
  const [inner, setInner] = React.useState(false);
  const isFlipped = flipped ?? inner;
  const toggle = () => {
    onFlippedChange?.(!isFlipped);
    if (flipped === undefined) setInner(!isFlipped);
  };
  const c = chamferClass(corners);
  const mirror: Record<Corner, Corner> =
    axis === "x"
      ? { tl: "bl", tr: "br", bl: "tl", br: "tr" }
      : { tl: "tr", tr: "tl", bl: "br", br: "bl" };
  const backCorners: "all" | Corner[] =
    corners === "all" ? "all" : corners.map((k) => mirror[k]);
  const cBack = chamferClass(backCorners);
  const whole = trigger === "card";
  const smooth = shape === "smooth" || rounded > 0;
  const r = shape === "smooth" ? radius : 0;
  const [fo, foc] = useFillet(corners, "md", r, 0, rounded);
  const [fi, fic] = useFillet(corners, "md", r, 1, rounded);
  const [bo, boc] = useFillet(backCorners, "md", r, 0, rounded);
  const [bi, bic] = useFillet(backCorners, "md", r, 1, rounded);
  const st = (clip?: string) =>
    smooth && clip ? { clipPath: clip } : undefined;
  const cardProps = whole
    ? {
        role: "button",
        tabIndex: 0,
        onClick: toggle,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        },
      }
    : {};
  return (
    <div className={cn("flip-scene h-64 w-full", className)}>
      <div
        {...cardProps}
        className={cn(
          "flip-inner relative h-full w-full",
          whole && "cursor-pointer",
          isFlipped && (axis === "x" ? "flipped-x" : "flipped"),
        )}
      >
        <div
          ref={fo}
          style={st(foc)}
          className={cn("flip-face absolute inset-0 bg-border p-px", c)}
          aria-hidden={isFlipped}
        >
          <div
            ref={fi}
            style={st(fic)}
            className={cn(
              c,
              "relative h-full bg-card p-6 text-card-foreground",
            )}
          >
            {front}
            {!whole && (
              <button
                type="button"
                onClick={toggle}
                aria-label="Virar card"
                tabIndex={isFlipped ? -1 : 0}
                className="absolute bottom-0 right-0 flex h-10 w-10 items-end justify-end bg-gradient-to-tl from-primary from-50% to-transparent to-50% p-1 text-xs text-primary-foreground transition-transform hover:scale-110"
              >
                ↻
              </button>
            )}
          </div>
        </div>
        <div
          ref={bo}
          style={st(boc)}
          className={cn(
            "flip-face absolute inset-0 bg-border p-px",
            cBack,
            axis === "x" ? "flip-back-x" : "flip-back",
          )}
          aria-hidden={!isFlipped}
        >
          <div
            ref={bi}
            style={st(bic)}
            className={cn(
              cBack,
              "relative h-full bg-muted p-6 text-card-foreground",
            )}
          >
            {back}
            {!whole && (
              <button
                type="button"
                onClick={toggle}
                tabIndex={isFlipped ? 0 : -1}
                className="absolute bottom-3 left-6 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                [↺ Voltar]
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
