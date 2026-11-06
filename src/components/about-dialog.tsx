"use client";

import { ExternalLink, Info } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { PartnerLogos } from "@/components/brand/partner-logos";
import { headerButtonClass } from "@/components/header-button";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useT } from "@/i18n";
import { APP_NAME } from "@/lib/brand";

const ORIGINAL_URL = "https://www.cardsagainsthumanity.com/";

export function AboutDialog() {
  const t = useT();
  const app = { app: APP_NAME };
  return (
    <Dialog>
      <Hint label={t("header.about")} side="bottom">
        <DialogTrigger
          className={headerButtonClass}
          aria-label={t("header.about")}
        >
          <Info aria-hidden="true" />
        </DialogTrigger>
      </Hint>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <Logo className="mb-2" />
          <DialogTitle>{t("about.title", app)}</DialogTitle>
          <DialogDescription>{t("about.intro", app)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>{t("about.p2p")}</p>
          <section className="space-y-2 border-answer border-l-4 pl-3">
            <h3 className="font-semibold">{t("about.originalTitle")}</h3>
            <p>{t("about.original")}</p>
            <p className="text-muted-foreground text-xs">
              {t("about.license", app)}
            </p>
            <a
              href={ORIGINAL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-prompt underline underline-offset-4"
            >
              {t("about.support")}{" "}
              <ExternalLink className="size-3.5" aria-hidden="true" />
              <span className="sr-only">{t("a11y.newTab")}</span>
            </a>
          </section>
          <PartnerLogos />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t("about.close")}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
