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

function displayName(lang: string, inLocale: string) {
  try {
    const name = new Intl.DisplayNames([inLocale], { type: "language" }).of(
      lang,
    );
    if (!name || name === lang) return lang;
    return name.charAt(0).toLocaleUpperCase(inLocale) + name.slice(1);
  } catch {
    return lang;
  }
}

export function languageName(lang: string, uiLocale: string) {
  return displayName(lang, uiLocale);
}

export function nativeLanguageName(lang: string) {
  return displayName(lang, lang);
}
