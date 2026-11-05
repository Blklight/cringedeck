"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CornerPosition = "tl" | "tr" | "br" | "bl";

/**
 * Presets de tamanho:
 * - "2xs" / "xxs": 8px, "xs": 12px, "sm": 16px, "md": 24px (padrão), "lg": 32px, "xl": 40px
 */
export type CornerSizePreset = "2xs" | "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

export type CornerDimension = number | string;

/**
 * Dimensões assimétricas ou livres:
 * - Array: `[width, height]`
 * - Objeto: `{ width, height }` ou `{ x, y }`
 */
export type CornerCustomDimensions =
  | { width?: CornerDimension; height?: CornerDimension }
  | { x?: CornerDimension; y?: CornerDimension }
  | [CornerDimension, CornerDimension];

export type CornerSize =
  | CornerSizePreset
  | CornerDimension
  | CornerCustomDimensions;

export interface CornerMarkersProps {
  /** Cor dos cantos. Sem valor, herda `border-muted-foreground`. */
  color?: string;
  /** Preset, número (px), string CSS/classe Tailwind, `[w, h]` ou `{ width, height }`. */
  cornerSize?: CornerSize;
  /** Espessura (px ou CSS). Padrão: 1px para tamanhos <= 8px, senão 2px. */
  cornerThickness?: number | string;
  /** Opacidade (0 a 1). Padrão: 0.5 quando `color` é fornecido. */
  cornerOpacity?: number;
  /** Deslocamento em relação às bordas (valor único, `[x, y]` ou `{ x, y }`). */
  cornerOffset?:
    | number
    | string
    | { x?: number | string; y?: number | string }
    | [number | string, number | string];
  /** Quais cantos exibir. Padrão: todos. */
  corners?: readonly CornerPosition[] | CornerPosition[];
  /** Classes Tailwind adicionais para cada canto. */
  cornerClassName?: string;
}

export interface CornerFrameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    CornerMarkersProps {
  children?: React.ReactNode;
  /** Cor base mesclada com `color` via color-mix. */
  background?: string;
  /** `true` aplica `.background-texture`; string aplica a classe informada. */
  withTexture?: boolean | string;
  /** Aplica o fundo sutil. Padrão: true. */
  withBackground?: boolean;
}

const DEFAULT_CORNERS: readonly CornerPosition[] = ["tl", "tr", "br", "bl"];

const PRESET_MAP: Record<CornerSizePreset, { className: string }> = {
  "2xs": { className: "size-2" },
  xxs: { className: "size-2" },
  xs: { className: "size-3" },
  sm: { className: "size-4" },
  md: { className: "size-6" },
  lg: { className: "size-8" },
  xl: { className: "size-10" },
};

function formatDimension(dim: CornerDimension): string {
  return typeof dim === "number" ? `${dim}px` : dim;
}

function resolveCornerSize(size: CornerSize): {
  className?: string;
  style?: React.CSSProperties;
} {
  if (Array.isArray(size)) {
    return {
      style: {
        width: formatDimension(size[0]),
        height: formatDimension(size[1]),
      },
    };
  }

  if (typeof size === "object" && size !== null) {
    const w = "width" in size ? size.width : "x" in size ? size.x : undefined;
    const h = "height" in size ? size.height : "y" in size ? size.y : undefined;
    return {
      style: {
        ...(w !== undefined ? { width: formatDimension(w) } : {}),
        ...(h !== undefined ? { height: formatDimension(h) } : {}),
      },
    };
  }

  if (typeof size === "number") {
    return { style: { width: `${size}px`, height: `${size}px` } };
  }

  if (size in PRESET_MAP) {
    return { className: PRESET_MAP[size as CornerSizePreset].className };
  }

  if (
    size.includes(" ") ||
    size.startsWith("size-") ||
    size.startsWith("w-") ||
    size.startsWith("h-")
  ) {
    return { className: size };
  }

  return { style: { width: size, height: size } };
}

/** Renderiza apenas os marcadores de canto; use dentro de um elemento `relative`. */
export const CornerMarkers = ({
  color,
  cornerSize = "md",
  cornerThickness,
  cornerOpacity,
  cornerOffset = 0,
  corners = DEFAULT_CORNERS,
  cornerClassName,
}: CornerMarkersProps) => {
  const hasTheme = !!color;

  const sizeInfo = React.useMemo(
    () => resolveCornerSize(cornerSize),
    [cornerSize],
  );

  const resolvedThickness = React.useMemo(() => {
    if (cornerThickness !== undefined) {
      return typeof cornerThickness === "number"
        ? `${cornerThickness}px`
        : cornerThickness;
    }
    if (
      cornerSize === "2xs" ||
      cornerSize === "xxs" ||
      (typeof cornerSize === "number" && cornerSize <= 8)
    ) {
      return "1px";
    }
    return "2px";
  }, [cornerThickness, cornerSize]);

  const getCornerPositionStyle = (pos: CornerPosition): React.CSSProperties => {
    let offsetX: string;
    let offsetY: string;

    if (Array.isArray(cornerOffset)) {
      offsetX = formatDimension(cornerOffset[0]);
      offsetY = formatDimension(cornerOffset[1]);
    } else if (typeof cornerOffset === "object" && cornerOffset !== null) {
      offsetX = formatDimension(cornerOffset.x ?? 0);
      offsetY = formatDimension(cornerOffset.y ?? 0);
    } else {
      const val = formatDimension(cornerOffset);
      offsetX = val;
      offsetY = val;
    }

    const basePos: React.CSSProperties = {};
    if (pos === "tl") {
      basePos.top = offsetY;
      basePos.left = offsetX;
    } else if (pos === "tr") {
      basePos.top = offsetY;
      basePos.right = offsetX;
    } else if (pos === "br") {
      basePos.bottom = offsetY;
      basePos.right = offsetX;
    } else {
      basePos.bottom = offsetY;
      basePos.left = offsetX;
    }
    return basePos;
  };

  const getCornerBorderStyle = (pos: CornerPosition): React.CSSProperties => {
    const borders: Record<CornerPosition, string> = {
      tl: `${resolvedThickness} 0 0 ${resolvedThickness}`,
      tr: `${resolvedThickness} ${resolvedThickness} 0 0`,
      br: `0 ${resolvedThickness} ${resolvedThickness} 0`,
      bl: `0 0 ${resolvedThickness} ${resolvedThickness}`,
    };

    return {
      borderWidth: borders[pos],
      borderStyle: "solid",
      borderColor: color ?? "currentColor",
      opacity: cornerOpacity ?? (hasTheme ? 0.5 : undefined),
    };
  };

  return (
    <>
      {corners.map((pos) => (
        <div
          key={pos}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute",
            sizeInfo.className,
            !hasTheme && "border-muted-foreground",
            cornerClassName,
          )}
          style={{
            ...sizeInfo.style,
            ...getCornerPositionStyle(pos),
            ...getCornerBorderStyle(pos),
          }}
        />
      ))}
    </>
  );
};

CornerMarkers.displayName = "CornerMarkers";

/** Container com cantos estilizados e fundo adaptável. */
export const CornerFrame = React.forwardRef<HTMLDivElement, CornerFrameProps>(
  (
    {
      children,
      color,
      background,
      withTexture = false,
      withBackground = true,
      cornerSize = "md",
      cornerThickness,
      cornerOpacity,
      cornerOffset = 0,
      corners = DEFAULT_CORNERS,
      cornerClassName,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const hasTheme = !!color;

    const textureClass = React.useMemo(() => {
      if (!withTexture) return undefined;
      return typeof withTexture === "string"
        ? withTexture
        : "background-texture";
    }, [withTexture]);

    const frameBackgroundStyle = React.useMemo(() => {
      if (!withBackground || !hasTheme) return undefined;
      return {
        background: `color-mix(in srgb, ${color} 4%, ${background ?? "transparent"})`,
      };
    }, [withBackground, hasTheme, color, background]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative",
          textureClass,
          withBackground && !hasTheme && "bg-muted-foreground/10",
          className,
        )}
        style={{ ...frameBackgroundStyle, ...style }}
        {...props}
      >
        <CornerMarkers
          color={color}
          cornerSize={cornerSize}
          cornerThickness={cornerThickness}
          cornerOpacity={cornerOpacity}
          cornerOffset={cornerOffset}
          corners={corners}
          cornerClassName={cornerClassName}
        />
        {children}
      </div>
    );
  },
);

CornerFrame.displayName = "CornerFrame";
