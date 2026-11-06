import { APP_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: {
    mark: "h-7 w-8",
    card: "h-6 w-[1.1rem] rounded-[4px] border",
    text: "text-base",
    gap: "gap-2",
  },
  lg: {
    mark: "h-24 w-28",
    card: "h-20 w-[3.6rem] rounded-[10px] border-2",
    text: "text-4xl sm:text-5xl",
    gap: "gap-4",
  },
} as const;

const split = APP_NAME.toLowerCase().indexOf("cards");
export const BRAND_PARTS: [string, string] =
  split > 0
    ? [APP_NAME.slice(0, split), APP_NAME.slice(split)]
    : [APP_NAME, ""];

export function LogoMark({ size = "sm" }: { size?: keyof typeof SIZES }) {
  const s = SIZES[size];
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-block shrink-0", s.mark)}
    >
      <span
        className={cn(
          "absolute right-0 bottom-0 rotate-12 border-answer-edge bg-answer shadow-sm",
          s.card,
        )}
      />
      <span
        className={cn(
          "absolute top-0 left-0 -rotate-6 border-prompt-edge bg-prompt shadow-sm",
          s.card,
        )}
      />
    </span>
  );
}

export function Logo({
  size = "sm",
  stacked = false,
  className,
}: {
  size?: keyof typeof SIZES;
  stacked?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  const [head, tail] = BRAND_PARTS;
  return (
    <span
      className={cn(
        "inline-flex items-center",
        stacked && "flex-col",
        s.gap,
        className,
      )}
    >
      <LogoMark size={size} />
      <span
        className={cn(
          "font-(family-name:--card-font) font-bold leading-none tracking-tight",
          s.text,
        )}
      >
        {head}
        {tail ? (
          <span className="flat-mark ml-[0.06em] pl-[0.1em]">{tail}</span>
        ) : null}
      </span>
    </span>
  );
}
