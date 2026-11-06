export const LOCALES = ["pt-BR", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_NAMES: Record<Locale, string> = {
  "pt-BR": "Português",
  en: "English",
};

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.includes(value as Locale);

export function detectLocale(languages: readonly string[]): Locale {
  for (const lang of languages) {
    const lower = lang.toLowerCase();
    const exact = LOCALES.find((l) => l.toLowerCase() === lower);
    if (exact) return exact;
    const base = LOCALES.find((l) => l.split("-")[0] === lower.split("-")[0]);
    if (base) return base;
  }
  return "pt-BR";
}
