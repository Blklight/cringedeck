# Cartas

Cada pacote é um JSON em `data/cards/<lang>/<id>.json`, validado por [`schema.json`](./schema.json). Use [`template.json`](./template.json) como ponto de partida.

| Pacote     | Idioma | Pretas | Brancas | Origem                                  |
| ---------- | ------ | -----: | ------: | --------------------------------------- |
| `pt-BR.base` | pt-BR  |    100 |     500 | Print & Play Brasil (OCR + revisão)     |
| `en.base`    | en     |    100 |     500 | Print & Play US 2022 (OCR + revisão)    |

## Regras

- **IDs** são únicos entre todos os pacotes e nunca reaproveitados: `<lang>.<pacote>.<b|w><número>`.
- **Lacunas** nas cartas pretas: `____` (3+ underscores). `pick` deve ser maior ou igual ao número de lacunas; cartas sem lacuna (perguntas) mostram a resposta após o texto.
- **Traduções** ficam em um pacote próprio do idioma de destino, com `translatedFrom` no pacote (`"en.base"`) e, opcionalmente, em cada carta (`"en.base.w001"`).
- **Novo pacote:** crie o JSON e adicione-o à lista `PACKS` em `src/game/cards.ts`. Os testes (`tests/game/engine.test.ts`) validam IDs, lacunas e `pick`.

## Extração dos PDFs

`scripts/extract_cards.py` gera um rascunho a partir dos PDFs Print & Play (texto em curvas, via OCR com tesseract). O resultado sempre precisa de revisão manual — principalmente pontuação ao redor das lacunas.
