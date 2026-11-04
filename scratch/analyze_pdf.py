import pymupdf
from collections import Counter
from PIL import Image

doc = pymupdf.open("info/Katalog Rewang Desa Agustus '26 (1).pdf")

font_counter = Counter()
color_counter = Counter()

print(f"Total pages: {len(doc)}")

for pno in range(len(doc)):
    page = doc[pno]
    blocks = page.get_text("dict")["blocks"]
    for b in blocks:
        if "lines" in b:
            for l in b["lines"]:
                for s in l["spans"]:
                    font_counter[s["font"]] += 1
                    c = s["color"]
                    r = (c >> 16) & 255
                    g = (c >> 8) & 255
                    b_val = c & 255
                    hex_val = f"#{r:02x}{g:02x}{b_val:02x}"
                    color_counter[hex_val] += 1
                    if pno in [0, 1, 2, 3, 23] and s["text"].strip():
                        print(f"P{pno+1}: [{s['font']}] {s['size']:.1f}pt {hex_val} -> {s['text']}")

print("\n--- Font Counts ---")
for f, cnt in font_counter.most_common(10):
    print(f"  {f}: {cnt}")

print("\n--- Color Counts ---")
for c, cnt in color_counter.most_common(10):
    print(f"  {c}: {cnt}")

