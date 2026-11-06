import enBase from "../../data/cards/en/base.json";
import ptBRBase from "../../data/cards/pt-BR/base.json";
import type { BlackCard, CardPack, PackInfo, WhiteCard } from "./types";

export const PACKS: CardPack[] = [ptBRBase, enBase];

export const packKey = (pack: Pick<CardPack, "id" | "lang">) =>
  `${pack.lang}.${pack.id}`;

const packsByKey = new Map(PACKS.map((p) => [packKey(p), p]));
const whiteById = new Map<string, WhiteCard>();
const blackById = new Map<string, BlackCard>();
for (const pack of PACKS) {
  for (const card of pack.white) whiteById.set(card.id, card);
  for (const card of pack.black) blackById.set(card.id, card);
}

export const PACK_INFO: PackInfo[] = PACKS.map((p) => ({
  key: packKey(p),
  name: p.name,
  lang: p.lang,
  black: p.black.length,
  white: p.white.length,
}));

export const getPack = (key: string) => packsByKey.get(key);

export const whiteText = (id: string) => whiteById.get(id)?.text ?? "???";

export const getBlack = (id: string) => blackById.get(id);

export function deckFor(keys: string[]) {
  const packs = keys.flatMap((k) => packsByKey.get(k) ?? []);
  return {
    white: packs.flatMap((p) => p.white.map((c) => c.id)),
    black: packs.flatMap((p) => p.black.map((c) => c.id)),
  };
}

export const PACK_LANGS = [...new Set(PACKS.map((p) => p.lang))];

export const hasPacks = (lang: string) => PACK_LANGS.includes(lang);

export const packsFor = (lang: string) =>
  PACK_INFO.filter((p) => p.lang === lang);

export function defaultPacksFor(lang: string): string[] {
  const packs = PACKS.filter((p) => p.lang === lang);
  const preferred = packs.find((p) => p.id === "base") ?? packs[0];
  return preferred ? [packKey(preferred)] : [];
}
