"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";
import { type ChamferBase, chamferClass, chamferStyle } from "./chamfer-utils";
import { FilletCard } from "./fillet-card";

export function ChamferCard({
  corners = ["tl", "br"],
  size = "md",
  bordered = true,
  shape = "cut",
  radius = 4,
  rounded = 0,
  className,
  children,
  style,
  ...props
}: ChamferBase & {
  shape?: "cut" | "smooth";
  radius?: number;
  /** arredonda (px) os cantos sem chanfro; ativa o modo suave */
  rounded?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  if (shape === "smooth" || rounded > 0) {
    return (
      <FilletCard
        {...{ corners, size, bordered, className, style }}
        radius={shape === "smooth" ? radius : 0}
        rounded={rounded}
        {...props}
      >
        {children}
      </FilletCard>
    );
  }
  const c = chamferClass(corners, size);
  const s = { ...chamferStyle(size), ...style };
  if (!bordered) {
    return (
      <div
        className={cn(c, "bg-card text-card-foreground", className)}
        style={s}
        {...props}
      >
        {children}
      </div>
    );
  }
  return (
    <div className={cn(c, "bg-border p-px")} style={s} {...props}>
      <div
        className={cn(c, "h-full bg-card text-card-foreground", className)}
        style={chamferStyle(size)}
      >
        {children}
      </div>
    </div>
  );
}

export const ChamferCardHeader = ({
  className,
  ...p
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 p-6", className)} {...p} />
);
export const ChamferCardTitle = ({
  className,
  ...p
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...p}
  />
);
export const ChamferCardDescription = ({
  className,
  ...p
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...p} />
);
export const ChamferCardContent = ({
  className,
  ...p
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6 pt-0", className)} {...p} />
);
export const ChamferCardFooter = ({
  className,
  ...p
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center gap-2 p-6 pt-0", className)} {...p} />
);
