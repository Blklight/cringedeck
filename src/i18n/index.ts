import { useCallback } from "react";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { Locale } from "./locales";
import { en } from "./messages/en";
import { type MessageKey, ptBR } from "./messages/pt-BR";

export type { MessageKey };
export * from "./locales";

const MESSAGES: Record<Locale, Record<string, string>> = { "pt-BR": ptBR, en };

type Params = Record<string, string | number>;
type BaseKey<K> = K extends `${infer B}_one` | `${infer B}_other` ? B : K;
export type TranslationKey = BaseKey<MessageKey>;

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: Params,
): string {
  const table = MESSAGES[locale];
  const plural =
    typeof params?.count === "number"
      ? `${key}_${params.count === 1 ? "one" : "other"}`
      : null;
  const template =
    (plural && (table[plural] ?? ptBR[plural as MessageKey])) ??
    table[key] ??
    ptBR[key as MessageKey] ??
    key;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    params && name in params ? String(params[name]) : match,
  );
}

export function useLocale(): Locale {
  return useLanguageStore((s) => s.language);
}

export function useT() {
  const locale = useLocale();
  return useCallback(
    (key: TranslationKey, params?: Params) => translate(locale, key, params),
    [locale],
  );
}
