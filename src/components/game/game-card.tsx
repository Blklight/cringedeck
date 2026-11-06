import { Fragment } from "react";
import { BRAND_PARTS } from "@/components/brand/logo";
import { fillBlanks } from "@/game/text";
import type { BlackCard } from "@/game/types";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { type CardHighlight, CardShell } from "./card-shell";

const body =
  "flex h-full flex-col justify-between gap-3 p-4 text-left font-(family-name:--card-font) text-[0.92rem] font-bold leading-[1.85] tracking-(--card-tracking) sm:p-5";

const sizing = "aspect-[2.5/3.5]";

const BLANK_SPLIT = /(_{3,})/;

function Footer({ pick, tone }: { pick?: number; tone: "prompt" | "answer" }) {
  const t = useT();
  const [head, tail] = BRAND_PARTS;
  return (
    <div
      className={cn(
        "flex items-center justify-between font-mono text-[0.74rem] font-bold leading-none tracking-[0.08em]",
        tone === "prompt" ? "text-prompt-muted" : "text-answer-muted",
      )}
    >
      <span aria-hidden="true">
        {head}
        {tail ? (
          <span
            className={cn(
              "flat-mark ml-[0.06em] pl-[0.1em]",
              tone === "prompt"
                ? "bg-prompt-foreground text-prompt"
                : "bg-answer-foreground text-answer",
            )}
          >
            {tail}
          </span>
        ) : null}
      </span>
      {pick && pick > 1 ? (
        <span className="flex items-center gap-1">
          <span aria-hidden="true" className="flex items-center gap-1">
            PICK
            <span className="grid size-[1.15rem] place-items-center rounded-full bg-answer text-[0.66rem] text-mark-foreground tracking-normal">
              {pick}
            </span>
          </span>
          <span className="sr-only">{t("a11y.pick", { pick })}</span>
        </span>
      ) : null}
    </div>
  );
}

function PromptText({ text }: { text: string }) {
  const t = useT();
  const parts = text.split(BLANK_SPLIT);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: segmentos estáticos
      <Fragment key={i}>
        <span aria-hidden="true">{part}</span>
        <span className="sr-only">{t("a11y.blank")}</span>
      </Fragment>
    ) : (
      part
    ),
  );
}

export function BlackCardView({
  card,
  answers = [],
  highlight,
  lang,
  className,
}: {
  card: BlackCard;
  answers?: string[];
  highlight?: CardHighlight;
  lang?: string;
  className?: string;
}) {
  const segments = fillBlanks(card, answers);
  return (
    <CardShell
      tone="prompt"
      highlight={highlight}
      className={cn(sizing, className)}
    >
      <div className={body}>
        <p lang={lang}>
          {segments.map((seg, i) =>
            seg.filled ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: segmentos estáticos
              <Fragment key={i}>
                {seg.text.startsWith(" ") ? " " : null}
                <mark className="flat-mark">{seg.text.trimStart()}</mark>
              </Fragment>
            ) : (
              // biome-ignore lint/suspicious/noArrayIndexKey: segmentos estáticos
              <span key={i}>
                <PromptText text={seg.text} />
              </span>
            ),
          )}
        </p>
        <Footer pick={card.pick} tone="prompt" />
      </div>
    </CardShell>
  );
}

export function WhiteCardView({
  text,
  selected,
  order,
  disabled,
  onClick,
  lang,
  className,
}: {
  text: string;
  selected?: boolean;
  order?: number;
  disabled?: boolean;
  onClick?: () => void;
  lang?: string;
  className?: string;
}) {
  const t = useT();
  const card = (
    <CardShell
      tone="answer"
      highlight={selected ? "selected" : "none"}
      className={cn(
        sizing,
        "w-full",
        selected && "-translate-y-2",
        disabled && "opacity-60",
      )}
    >
      <div className={cn(body, "relative")}>
        <span lang={lang}>
          {onClick ? (
            <span aria-hidden="true" className="float-right ml-2 size-5" />
          ) : null}
          {text}
        </span>
        <Footer tone="answer" />
        {selected && order ? (
          <>
            <span
              aria-hidden="true"
              className="absolute top-3 right-3 grid size-6 place-items-center rounded-full bg-prompt font-mono text-prompt-foreground text-xs"
            >
              {order}
            </span>
            <span className="sr-only">({t("a11y.order", { order })})</span>
          </>
        ) : null}
      </div>
    </CardShell>
  );

  if (!onClick) return <div className={className}>{card}</div>;
  return (
    <button
      type="button"
      className={cn(
        "block w-full rounded-[18px] text-left outline-none transition hover:-translate-y-1 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      {card}
    </button>
  );
}
