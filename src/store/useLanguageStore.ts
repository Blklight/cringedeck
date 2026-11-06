import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface LanguageStore {
  language: string;
  setLanguage: (language: string) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "pt-br",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "lang-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
