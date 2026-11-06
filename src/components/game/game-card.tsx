import { fillBlanks } from "@/game/text";
import type { BlackCard } from "@/game/types";
import { cn } from "@/lib/utils";

const base =
  "relative flex aspect-[2.5/3.5] flex-col justify-between rounded-xl p-3 text-left font-sans text-[0.95rem] font-bold leading-tight shadow-md sm:p-4";

function Footer({ pick }: { pick?: number }) {
  return (
    <div className="flex items-center justify-between text-[0.6rem] font-semibold opacity-80">
      <span>Cards Against Humanity</span>
      {pick && pick > 1 ? (
        <span className="flex items-center gap-1">
          PICK
          <span className="grid size-4 place-items-center rounded-full bg-current">
            <span className="text-[0.6rem] text-black">{pick}</span>
          </span>
        </span>
      ) : null}
    </div>
  );
}

export function BlackCardView({
  card,
  answers = [],
  className,
}: {
  card: BlackCard;
  answers?: string[];
  className?: string;
}) {
  const segments = fillBlanks(card, answers);
  return (
    <div className={cn(base, "bg-neutral-950 text-white", className)}>
      <p className="whitespace-pre-line">
        {segments.map((seg, i) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: segmentos estáticos
            key={i}
            className={cn(
              seg.filled && "underline decoration-2 underline-offset-4",
            )}
          >
            {seg.text}
          </span>
        ))}
      </p>
      <Footer pick={card.pick} />
    </div>
  );
}

export function WhiteCardView({
  text,
  selected,
  order,
  disabled,
  onClick,
  className,
}: {
  text: string;
  selected?: boolean;
  order?: number;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const classes = cn(
    base,
    "w-full border border-neutral-300 bg-white text-neutral-950 transition",
    onClick && !disabled && "cursor-pointer hover:-translate-y-1",
    selected && "-translate-y-2 ring-4 ring-blklight-500",
    disabled && "opacity-60",
    className,
  );
  const body = (
    <>
      <span>{text}</span>
      <Footer />
      {selected && order ? (
        <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-blklight-500 text-xs text-white">
          {order}
        </span>
      ) : null}
    </>
  );
  if (!onClick) return <div className={classes}>{body}</div>;
  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      {body}
    </button>
  );
}
