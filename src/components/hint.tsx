"use client";

import type { ReactElement, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Hint({
  label,
  children,
  side = "top",
  wrapClassName,
}: {
  label?: ReactNode;
  children: ReactElement;
  side?: "top" | "bottom" | "left" | "right";
  wrapClassName?: string;
}) {
  if (!label) return children;
  return (
    <Tooltip>
      {wrapClassName === undefined ? (
        <TooltipTrigger render={children} />
      ) : (
        <TooltipTrigger render={<span className={wrapClassName} />}>
          {children}
        </TooltipTrigger>
      )}
      <TooltipContent side={side}>{label}</TooltipContent>
    </Tooltip>
  );
}
