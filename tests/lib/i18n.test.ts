import { describe, expect, it } from "vitest";
import { detectLocale, translate } from "@/i18n";
import { en } from "@/i18n/messages/en";
import { ptBR } from "@/i18n/messages/pt-BR";

describe("i18n", () => {
  it("tem as mesmas chaves em todos os idiomas", () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(ptBR).sort());
  });

  it("interpola parâmetros", () => {
    expect(translate("en", "home.resume", { code: "ABCDE" })).toBe(
      "Back to room ABCDE",
    );
  });

  it("escolhe singular e plural pelo count", () => {
    expect(translate("pt-BR", "table.waitingAnswers", { count: 1 })).toBe(
      "Aguardando 1 resposta…",
    );
    expect(translate("en", "table.waitingAnswers", { count: 3 })).toBe(
      "Waiting for 3 answers…",
    );
  });

  it("detecta o idioma do navegador", () => {
    expect(detectLocale(["pt-PT"])).toBe("pt-BR");
    expect(detectLocale(["en-US", "pt-BR"])).toBe("en");
    expect(detectLocale(["de-DE"])).toBe("pt-BR");
  });
});
