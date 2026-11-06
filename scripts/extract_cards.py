"""Extrai um rascunho de pacote de cartas dos PDFs Print & Play (texto em curvas).

Requisitos: PyMuPDF (fitz), Pillow, numpy e tesseract com o idioma desejado.

Exemplo:
    python3 scripts/extract_cards.py material/CAH_PrintPlay2022-RegularInk-FINAL-outlined.pdf \
        --ocr-lang eng --lang en --pack base --black 2-6 --white 7-31 -o /tmp/en-base.json

O resultado é um rascunho: revise pontuação ao redor das lacunas e erros de OCR.
"""

import argparse
import json
import re
import subprocess
import tempfile
from pathlib import Path

import fitz
import numpy as np
from PIL import Image, ImageOps

GRID_X = [19, 162, 305.5, 448.5, 592]
GRID_Y = [18, 161, 304, 447, 590, 733]
DPI = 300
SCALE = DPI / 72
MIN_BLANK_PX = 120


def page_range(spec: str) -> range:
    start, end = spec.split("-")
    return range(int(start), int(end) + 1)


def cells(doc, page_index):
    pm = doc[page_index].get_pixmap(dpi=DPI, colorspace=fitz.csGRAY)
    img = Image.frombytes("L", (pm.width, pm.height), pm.samples)
    dark_page = np.asarray(img)[int(5 * SCALE), int(5 * SCALE)] < 128
    for r in range(5):
        for c in range(4):
            box = (
                int((GRID_X[c] + 5) * SCALE),
                int((GRID_Y[r] + 5) * SCALE),
                int((GRID_X[c + 1] - 5) * SCALE),
                int((GRID_Y[r + 1] - 5) * SCALE),
            )
            cell = img.crop(box)
            yield ImageOps.invert(cell) if dark_page else cell


def blank_segments(pixels):
    dark = pixels < 128
    segments = []
    for y in range(dark.shape[0]):
        row = dark[y]
        x, n = 0, len(row)
        while x < n:
            if not row[x]:
                x += 1
                continue
            x0 = x
            while x < n and row[x]:
                x += 1
            if x - x0 < MIN_BLANK_PX:
                continue
            for seg in segments:
                if seg["y1"] >= y - 2 and abs(seg["x0"] - x0) < 15 and abs(seg["x1"] - x) < 15:
                    seg["y1"] = y
                    break
            else:
                segments.append({"x0": x0, "x1": x, "y0": y, "y1": y})
    return [s for s in segments if s["y1"] - s["y0"] <= 12]


def tesseract(img, lang, tmp, psm="6", tsv=False):
    path = Path(tmp) / "cell.png"
    ImageOps.expand(img, border=30, fill=255).save(path)
    args = ["tesseract", str(path), "-", "-l", lang, "--psm", psm]
    if tsv:
        args.append("tsv")
    return subprocess.run(args, capture_output=True, text=True, check=True).stdout


def cleanup(text):
    text = re.sub(r"(?<![A-Za-z])\|(?![A-Za-z])", "I", text)
    text = re.sub(r"____ ([.,!?:;”\"’)])", r"____\1", text)
    return re.sub(r"([“\"(]) ____", r"\1____", text)


def black_text(cell, lang, tmp):
    w, h = cell.size
    pixels = np.array(cell.crop((0, 0, w, int(h * 0.8))))
    segments = blank_segments(pixels)
    for s in segments:
        pixels[max(0, s["y0"] - 3) : s["y1"] + 4, max(0, s["x0"] - 3) : s["x1"] + 3] = 255
    lines = {}
    for row in tesseract(Image.fromarray(pixels), lang, tmp, tsv=True).splitlines()[1:]:
        f = row.split("\t")
        if len(f) < 12 or f[0] != "5" or not f[11].strip():
            continue
        left, top, height = int(f[6]) - 30, int(f[7]) - 30, int(f[9])
        lines.setdefault((f[2], f[3], f[4]), []).append((left, top, top + height, f[11]))
    rows = [
        {"top": min(t for _, t, _, _ in ws), "bottom": max(b for _, _, b, _ in ws), "tokens": [(x, word) for x, _, _, word in ws]}
        for ws in lines.values()
    ]
    for s in segments:
        for row in rows:
            if row["top"] - 5 <= s["y0"] <= row["bottom"] + 18:
                row["tokens"].append((s["x0"], "____"))
                break
        else:
            rows.append({"top": s["y0"] - 30, "bottom": s["y0"], "tokens": [(s["x0"], "____")]})
    rows.sort(key=lambda r: r["top"])
    text = cleanup(" ".join(" ".join(word for _, word in sorted(r["tokens"])) for r in rows))
    if text.endswith("____"):
        text += "."
    return text, max(1, len(segments))


def white_text(cell, lang, tmp):
    w, h = cell.size
    return cleanup(" ".join(tesseract(cell.crop((0, 0, w, int(h * 0.8))), lang, tmp).split()))


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("pdf")
    parser.add_argument("--ocr-lang", required=True, help="idioma do tesseract (por, eng, spa...)")
    parser.add_argument("--lang", required=True, help="código do pacote (pt-BR, en...)")
    parser.add_argument("--pack", default="base")
    parser.add_argument("--name", default=None)
    parser.add_argument("--black", required=True, help="páginas das cartas pretas, ex.: 2-6 (base 0)")
    parser.add_argument("--white", required=True, help="páginas das cartas brancas, ex.: 7-31 (base 0)")
    parser.add_argument("-o", "--output", required=True)
    args = parser.parse_args()

    doc = fitz.open(args.pdf)
    black, white = [], []
    with tempfile.TemporaryDirectory() as tmp:
        for page in page_range(args.black):
            for cell in cells(doc, page):
                text, pick = black_text(cell, args.ocr_lang, tmp)
                black.append({"id": f"{args.lang}.{args.pack}.b{len(black) + 1:03d}", "text": text, "pick": pick})
        for page in page_range(args.white):
            for cell in cells(doc, page):
                white.append({"id": f"{args.lang}.{args.pack}.w{len(white) + 1:03d}", "text": white_text(cell, args.ocr_lang, tmp)})

    pack = {
        "$schema": "../schema.json",
        "id": args.pack,
        "lang": args.lang,
        "name": args.name or f"{args.pack} ({args.lang})",
        "source": Path(args.pdf).name,
        "license": "CC BY-NC-SA 2.0",
        "black": black,
        "white": white,
    }
    Path(args.output).write_text(json.dumps(pack, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(black)} pretas, {len(white)} brancas -> {args.output}")


if __name__ == "__main__":
    main()
