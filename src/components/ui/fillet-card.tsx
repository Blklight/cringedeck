"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ChamferBase, Corner, Size } from "./chamfer-utils";

function filletPath(
  w: number,
  h: number,
  c: Record<Corner, number>,
  r: number,
  round = 0,
) {
  const pts: [number, number, number][] = [];
  const add = (x: number, y: number, rr: number) => pts.push([x, y, rr]);
  const { tl, tr, br, bl } = c;
  if (tl) {
    add(0, tl, r);
    add(tl, 0, r);
  } else add(0, 0, round);
  if (tr) {
    add(w - tr, 0, r);
    add(w, tr, r);
  } else add(w, 0, round);
  if (br) {
    add(w, h - br, r);
    add(w - br, h, r);
  } else add(w, h, round);
  if (bl) {
    add(bl, h, r);
    add(0, h - bl, r);
  } else add(0, h, round);
  const n = pts.length;
  const f = (v: number) => +v.toFixed(2);
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const [x, y, rr] = pts[i] as [number, number, number];
    const [px, py] = pts[(i - 1 + n) % n] as [number, number, number];
    const [nx, ny] = pts[(i + 1) % n] as [number, number, number];
    const lp = Math.hypot(x - px, y - py);
    const ln = Math.hypot(nx - x, ny - y);
    const t = Math.min(rr, lp / 2, ln / 2);
    const ax = x + ((px - x) / lp) * t;
    const ay = y + ((py - y) / lp) * t;
    const bx = x + ((nx - x) / ln) * t;
    const by = y + ((ny - y) / ln) * t;
    out.push(`${i === 0 ? "M" : "L"} ${f(ax)} ${f(ay)}`);
    if (t > 0) {
      const k = 0.55;
      out.push(
        `C ${f(ax + (x - ax) * k)} ${f(ay + (y - ay) * k)} ${f(bx + (x - bx) * k)} ${f(by + (y - by) * k)} ${f(bx)} ${f(by)}`,
      );
    }
  }
  out.push("Z");
  return out.join(" ");
}

const SIZE_PX: Record<Exclude<Size, number>, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

/** Mede o elemento e devolve [ref, clipPath]. `rounded` arredonda os cantos SEM chanfro. */
export function useFillet<T extends HTMLElement = HTMLDivElement>(
  corners: "all" | Corner[],
  size: Size,
  radius: number,
  inset = 0,
  rounded = 0,
) {
  const [el, ref] = React.useState<T | null>(null);
  const [clip, setClip] = React.useState<string>();
  const cornersKey = JSON.stringify(corners);
  React.useLayoutEffect(() => {
    if (!el) return;
    const px = typeof size === "number" ? size : SIZE_PX[size];
    const leg = Math.max(0, px - inset * 2 * (Math.SQRT2 - 1));
    const rr = Math.max(0, radius - inset * 0.5);
    const ro2 = Math.max(0, rounded - inset);
    const on = (k: Corner) =>
      corners === "all" || corners.includes(k) ? leg : 0;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setClip(
        `path("${filletPath(width, height, { tl: on("tl"), tr: on("tr"), br: on("br"), bl: on("bl") }, rr, ro2)}")`,
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [el, cornersKey, size, radius, inset, rounded]);
  return [ref, clip] as const;
}

export function FilletCard({
  corners = ["tl", "br"],
  size = "md",
  radius = 4,
  rounded = 0,
  bordered = true,
  className,
  children,
  style,
  ...props
}: ChamferBase & {
  radius?: number;
  /** raio (px) dos cantos sem chanfro */
  rounded?: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [outerRef, outerClip] = useFillet(corners, size, radius, 0, rounded);
  const [innerRef, innerClip] = useFillet(corners, size, radius, 1, rounded);
  if (!bordered) {
    return (
      <div
        ref={outerRef}
        className={cn("bg-card text-card-foreground", className)}
        style={{ clipPath: outerClip, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
  return (
    <div
      ref={outerRef}
      className="bg-border p-px"
      style={{ clipPath: outerClip, ...style }}
      {...props}
    >
      <div
        ref={innerRef}
        className={cn("h-full bg-card text-card-foreground", className)}
        style={{ clipPath: innerClip }}
      >
        {children}
      </div>
    </div>
  );
}
