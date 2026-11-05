import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useLanguageStore = create(
  persist(
    (set, get) => ({
      language: "pt-br",
      setLanguage: (language: string) => set({ language }),
    }),
    {
      name: "lang-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
