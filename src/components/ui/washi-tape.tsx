"use client";

import type React from "react";

import { cn } from "@/lib/utils";

interface WashiTapeProps {
  className?: string;
  pattern?: "stripes" | "dots" | "solid" | "checkered";
  color?: "pink" | "mint" | "peach" | "lavender" | "sage";
  rotation?: number;
  children?: React.ReactNode;
}

const colorClasses = {
  pink: "bg-rose-200/80",
  mint: "bg-violet-200/80",
  peach: "bg-orange-200/80",
  lavender: "bg-purple-200/80",
  sage: "bg-primary/30",
};

const patternClasses = {
  stripes:
    "bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.4)_4px,rgba(255,255,255,0.4)_8px)]",
  dots: "bg-[radial-gradient(circle,rgba(255,255,255,0.5)_2px,transparent_2px)] bg-[size:8px_8px]",
  solid: "",
  checkered:
    "bg-[repeating-conic-gradient(rgba(255,255,255,0.3)_0%_25%,transparent_0%_50%)] bg-[size:8px_8px]",
};

export function WashiTape({
  className,
  pattern = "stripes",
  color = "sage",
  rotation = -2,
  children,
}: WashiTapeProps) {
  return (
    <div
      className={cn(
        "inline-block px-4 py-1.5 text-sm font-medium",
        colorClasses[color],
        patternClasses[pattern],
        className,
      )}
      style={{
        transform: `rotate(${rotation}deg)`,
        clipPath: "polygon(2% 0%, 98% 2%, 100% 98%, 0% 100%)",
      }}
    >
      {children}
    </div>
  );
}
