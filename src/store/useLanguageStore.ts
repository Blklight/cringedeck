import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { isLocale, type Locale } from "@/i18n/locales";
import { APP_SLUG } from "@/lib/brand";

export interface LanguageStore {
  language: Locale;
  chosen: boolean;
  setLanguage: (language: Locale, chosen?: boolean) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "pt-BR",
      chosen: false,
      setLanguage: (language, chosen = true) => set({ language, chosen }),
    }),
    {
      name: `${APP_SLUG}:lang`,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      migrate: (persisted) => {
        const old = (persisted as { language?: string } | null)?.language;
        const language: Locale = isLocale(old)
          ? old
          : old === "en-us"
            ? "en"
            : "pt-BR";
        return { language, chosen: Boolean(old) } as LanguageStore;
      },
    },
  ),
);
