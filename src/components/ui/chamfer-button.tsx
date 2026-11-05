"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useFillet } from "./fillet-card";

export const chamferButtonVariants = cva(
  "chamfer inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "chamfer-sm h-8 px-3 text-xs",
        md: "chamfer-sm h-9 px-4",
        lg: "h-11 px-6",
      },
      corner: {
        tl: "chamfer-tl",
        tr: "chamfer-tr",
        br: "chamfer-br",
        bl: "chamfer-bl",
      },
    },
    defaultVariants: { variant: "default", size: "md", corner: "br" },
  },
);

export const ChamferButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof chamferButtonVariants> & {
      /** "smooth" suaviza o corte; `rounded` arredonda os outros cantos (px) */
      shape?: "cut" | "smooth";
      radius?: number;
      rounded?: number;
    }
>(
  (
    {
      className,
      variant,
      size,
      corner,
      shape = "cut",
      radius = 2,
      rounded = 0,
      style,
      ...props
    },
    ref,
  ) => {
    const smooth = shape === "smooth" || rounded > 0;
    const [fRef, clip] = useFillet<HTMLButtonElement>(
      [corner ?? "br"],
      size === "lg" ? "md" : "sm",
      smooth ? (shape === "smooth" ? radius : 0) : 0,
      0,
      rounded,
    );
    const setRef = (el: HTMLButtonElement | null) => {
      fRef(el);
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };
    return (
      <button
        ref={setRef}
        type="button"
        className={cn(
          chamferButtonVariants({ variant, size, corner }),
          className,
        )}
        style={smooth && clip ? { ...style, clipPath: clip } : style}
        {...props}
      />
    );
  },
);
ChamferButton.displayName = "ChamferButton";
