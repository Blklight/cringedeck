"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import type * as React from "react";
import { cn } from "@/lib/utils";
import { type Corner, chamferClass } from "./chamfer-utils";
import { useFillet } from "./fillet-card";

export const ChamferDialog = DialogPrimitive.Root;
export const ChamferDialogTrigger = DialogPrimitive.Trigger;
export const ChamferDialogClose = DialogPrimitive.Close;

function Overlay() {
  return (
    <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px]" />
  );
}

interface PanelProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  /** Ações exibidas no rodapé */
  footer?: React.ReactNode;
  /** Header e footer fixos; só o miolo rola */
  sticky?: boolean;
  /** "smooth" suaviza os cortes; `rounded` arredonda os cantos sem chanfro (px) */
  shape?: "cut" | "smooth";
  radius?: number;
  rounded?: number;
  /** cantos chanfrados (padrão: Dialog tl+br, Sheet lado interno) */
  corners?: Corner[];
}

function useShell(
  corners: Corner[],
  {
    shape = "cut",
    radius = 4,
    rounded = 0,
  }: Pick<PanelProps, "shape" | "radius" | "rounded">,
) {
  const smooth = shape === "smooth" || rounded > 0;
  const r = shape === "smooth" ? radius : 0;
  const [oRef, oClip] = useFillet(corners, "lg", r, 0, rounded);
  const [iRef, iClip] = useFillet(corners, "lg", r, 1, rounded);
  return {
    outer: {
      ref: oRef,
      style: smooth && oClip ? { clipPath: oClip } : undefined,
    },
    inner: {
      ref: iRef,
      style: smooth && iClip ? { clipPath: iClip } : undefined,
    },
  };
}

function PanelBody({
  title,
  description,
  children,
  footer,
  sticky,
  className,
  c,
  heightClass,
  inner,
}: PanelProps & {
  c: string;
  heightClass: string;
  inner: {
    ref: (el: HTMLDivElement | null) => void;
    style: React.CSSProperties | undefined;
  };
}) {
  const header = (
    <div
      className={cn(
        "relative pr-8",
        sticky && "shrink-0 border-b border-border p-6",
      )}
    >
      <DialogPrimitive.Title className="text-lg font-semibold">
        {title}
      </DialogPrimitive.Title>
      {description && (
        <DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
          {description}
        </DialogPrimitive.Description>
      )}
      <DialogPrimitive.Close
        className={cn(
          "absolute right-0 top-0 text-sm text-muted-foreground hover:text-foreground",
          sticky && "right-4 top-4",
        )}
        aria-label="Fechar"
      >
        ✕
      </DialogPrimitive.Close>
    </div>
  );
  if (sticky) {
    return (
      <div
        ref={inner.ref}
        style={inner.style}
        className={cn(
          c,
          "flex flex-col bg-card text-card-foreground",
          heightClass,
          className,
        )}
      >
        {header}
        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-6">
          {children}
        </div>
        {footer && (
          <div className="flex shrink-0 justify-end gap-2 border-t border-border p-4">
            {footer}
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      ref={inner.ref}
      style={inner.style}
      className={cn(
        c,
        "no-scrollbar overflow-y-auto bg-card p-6 text-card-foreground",
        heightClass,
        className,
      )}
    >
      {header}
      <div className="mt-4">{children}</div>
      {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
    </div>
  );
}

export function ChamferDialogContent(props: PanelProps) {
  const corners: Corner[] = props.corners ?? ["tl", "br"];
  const c = chamferClass(corners, "lg");
  const sh = useShell(corners, props);
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Popup
        {...sh.outer}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-border p-px",
          c,
        )}
      >
        <PanelBody
          {...props}
          c={c}
          inner={sh.inner}
          heightClass="max-h-[85vh]"
        />
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export function ChamferSheetContent({
  side = "right",
  ...props
}: PanelProps & { side?: "left" | "right" }) {
  const corners: Corner[] =
    props.corners ?? (side === "right" ? ["tl", "bl"] : ["tr", "br"]);
  const c = chamferClass(corners, "lg");
  const sh = useShell(corners, props);
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Popup
        {...sh.outer}
        className={cn(
          "fixed inset-y-0 z-50 w-full max-w-md bg-border p-px",
          side === "right" ? "right-0" : "left-0",
          c,
        )}
      >
        <PanelBody {...props} c={c} inner={sh.inner} heightClass="h-full" />
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}
