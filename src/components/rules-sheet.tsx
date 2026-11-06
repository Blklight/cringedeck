"use client";

import { BookOpen } from "lucide-react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { type TranslationKey, useT } from "@/i18n";
import { cn } from "@/lib/utils";

const STEPS: TranslationKey[] = [
  "rules.step1",
  "rules.step2",
  "rules.step3",
  "rules.step4",
  "rules.step5",
];

const SECTIONS: [TranslationKey, TranslationKey][] = [
  ["rules.pickTitle", "rules.pick"],
  ["rules.winTitle", "rules.win"],
  ["rules.notesTitle", "rules.notes"],
];

export function RulesSheet({ className }: { className?: string }) {
  const t = useT();
  return (
    <Sheet>
      <Hint label={t("hint.rules")} side="left">
        <SheetTrigger
          render={
            <Button
              className={cn(
                "fixed right-4 bottom-4 z-40 h-11 rounded-full border-answer-edge bg-answer px-4 text-answer-foreground shadow-lg hover:bg-answer-edge lg:right-6 lg:bottom-6",
                className,
              )}
            />
          }
        >
          <BookOpen aria-hidden="true" /> {t("rules.open")}
        </SheetTrigger>
      </Hint>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("rules.title")}</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 px-4 pb-6 text-sm leading-relaxed">
          <ol className="space-y-3">
            {STEPS.map((key, i) => (
              <li key={key} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-6 shrink-0 place-items-center rounded-full bg-prompt font-mono text-prompt-foreground text-xs"
                >
                  {i + 1}
                </span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ol>
          {SECTIONS.map(([title, body]) => (
            <section key={title} className="space-y-1">
              <h3 className="font-semibold">
                <span className="flat-mark">{t(title)}</span>
              </h3>
              <p>{t(body)}</p>
            </section>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
