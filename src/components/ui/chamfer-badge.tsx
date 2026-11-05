"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { useFillet } from "./fillet-card";

export function ChamferBadge({
  variant = "default",
  shape = "cut",
  radius = 2,
  rounded = 0,
  className,
  children,
}: {
  variant?: "default" | "outline" | "secondary";
  className?: string;
  children: React.ReactNode;
  /** "smooth" suaviza o corte; `rounded` arredonda os outros cantos (px) */
  shape?: "cut" | "smooth";
  radius?: number;
  rounded?: number;
}) {
  const c = "chamfer chamfer-sm chamfer-tl";
  const smooth = shape === "smooth" || rounded > 0;
  const r = shape === "smooth" ? radius : 0;
  const [oRef, oClip] = useFillet<HTMLSpanElement>(["tl"], "sm", r, 0, rounded);
  const [iRef, iClip] = useFillet<HTMLSpanElement>(["tl"], "sm", r, 1, rounded);
  const os = smooth && oClip ? { clipPath: oClip } : undefined;
  const is = smooth && iClip ? { clipPath: iClip } : undefined;
  if (variant === "outline") {
    return (
      <span
        ref={oRef}
        className={cn(c, "inline-block bg-border p-px")}
        style={os}
      >
        <span
          ref={iRef}
          className={cn(
            c,
            "block bg-background px-2 py-0.5 text-xs font-medium",
            className,
          )}
          style={is}
        >
          {children}
        </span>
      </span>
    );
  }
  return (
    <span
      ref={oRef}
      style={os}
      className={cn(
        c,
        "inline-block px-2 py-0.5 text-xs font-medium",
        variant === "default"
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
