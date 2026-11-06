# Cartas

Cada pacote é um JSON em `data/cards/<lang>/<id>.json`, validado por [`schema.json`](./schema.json). Use [`template.json`](./template.json) como ponto de partida.

| Pacote     | Idioma | Pretas | Brancas | Origem                                  |
| ---------- | ------ | -----: | ------: | --------------------------------------- |
| `pt-BR.base` | pt-BR  |    100 |     500 | Print & Play Brasil (OCR + revisão)     |
| `en.base`    | en     |    100 |     500 | Print & Play US 2022 (OCR + revisão)    |

## Licença e marca

O conteúdo das cartas vem de Cards Against Humanity, distribuído sob Creative Commons BY-NC-SA. Os PDFs Print & Play declaram a **2.0**; o site atual declara a **4.0** — por isso os pacotes listam as duas em `license`. Os textos completos ficam em `LICENSE` (4.0) e `LICENSE-2.0` (2.0), e o aviso de atribuição em `NOTICE.md`.

- **BY (atribuição):** a origem fica registrada em `source` de cada pacote e no `NOTICE.md`.
- **NC (não comercial):** o projeto não pode ser vendido nem monetizado.
- **SA (compartilha igual):** derivados (inclusive traduções) saem sob a mesma licença.
- A licença cobre o conteúdo, **não a marca**: o nome "Cards Against Humanity" não é usado como nome nem identidade visual do app.

## Regras

- **IDs** são únicos entre todos os pacotes e nunca reaproveitados: `<lang>.<pacote>.<b|w><número>`.
- **Lacunas** nas cartas pretas: `____` (3+ underscores). `pick` deve ser maior ou igual ao número de lacunas; cartas sem lacuna (perguntas) mostram a resposta após o texto.
- **Traduções** ficam em um pacote próprio do idioma de destino, com `translatedFrom` no pacote (`"en.base"`) e, opcionalmente, em cada carta (`"en.base.w001"`).
- **Novo pacote:** crie o JSON e adicione-o à lista `PACKS` em `src/game/cards.ts`. Os testes (`tests/game/engine.test.ts`) validam IDs, lacunas e `pick`.

## Extração dos PDFs

`scripts/extract_cards.py` gera um rascunho a partir dos PDFs Print & Play (texto em curvas, via OCR com tesseract). O resultado sempre precisa de revisão manual — principalmente pontuação ao redor das lacunas.
