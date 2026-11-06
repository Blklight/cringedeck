import ptBRBase from "../../data/cards/pt-BR/base.json";
import type { BlackCard, CardPack, PackInfo, WhiteCard } from "./types";

export const PACKS: CardPack[] = [ptBRBase];

export const packKey = (pack: Pick<CardPack, "id" | "lang">) =>
  `${pack.lang}.${pack.id}`;

export const DEFAULT_PACKS = [packKey(ptBRBase)];

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
