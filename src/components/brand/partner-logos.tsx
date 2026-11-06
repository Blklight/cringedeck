import { Plus } from "lucide-react";
import { CornerFrame } from "@/components/ui/corner-frame";
import { useT } from "@/i18n";
import { withBasePath } from "@/lib/env";

const PARTNERS = [
  {
    name: "Blklight",
    href: "https://blklight.dev",
    label: "blklight.dev",
    logo: (
      <span
        aria-hidden="true"
        className="block size-14 bg-foreground"
        style={{
          mask: `url(${withBasePath("/icons/blklight-light.svg")}) center / contain no-repeat`,
          WebkitMask: `url(${withBasePath("/icons/blklight-light.svg")}) center / contain no-repeat`,
        }}
      />
    ),
  },
  {
    name: "Ultimate Mercer",
    href: "https://ultimatemercer.com",
    label: "ultimatemercer.com",
    logo: (
      // biome-ignore lint/performance/noImgElement: export estático sem otimização de imagens
      <img
        src={withBasePath("/icons/ultimate-logo-red.svg")}
        alt=""
        className="block h-14 w-auto"
      />
    ),
  },
];

export function PartnerLogos() {
  const t = useT();
  return (
    <CornerFrame
      withTexture
      cornerSize="sm"
      className="p-4"
      cornerOpacity={0.7}
    >
      <h3 className="text-center text-muted-foreground text-xs uppercase tracking-widest">
        {t("about.madeBy")}
      </h3>
      <ul className="mx-auto grid w-fit grid-cols-[1fr_auto_1fr] items-start gap-3 sm:gap-5">
        {PARTNERS.flatMap((p, i) => [
          i > 0 ? (
            <li key={`plus-${p.name}`} aria-hidden="true" className="pt-4">
              <Plus className="size-5 text-muted-foreground" />
            </li>
          ) : null,
          <li key={p.name}>
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className="flex w-full flex-col items-center gap-2 rounded-md p-1 font-mono text-xs underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring"
            >
              {p.logo}
              <span>
                <span className="sr-only">{p.name}: </span>
                {p.label}
                <span className="sr-only"> {t("a11y.newTab")}</span>
              </span>
            </a>
          </li>,
        ])}
      </ul>
    </CornerFrame>
  );
}
