"""Detecta, en cada página del catálogo, las imágenes de las señales.

Salida: detect.json con, por página, la lista de cajas [x0, y0, x1, y1] en puntos PDF,
ordenadas por fila y de izquierda a derecha; y hojas de contacto numeradas para revisar.
"""
import json
import os
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image, ImageDraw
from scipy import ndimage

AQUI = Path(__file__).resolve().parent
REPO = str(AQUI.parents[1]) + '/'
TMP = Path(os.environ.get('SENALES_TMP', '/tmp/senales'))
DPI = 100
ESC = DPI / 72


def paginas():
    for f, tag, start in [('1110950_1-1-45.pdf', 'A', 8), ('1110950_1-46-99.pdf', 'B', 0)]:
        d = pymupdf.open(REPO + f)
        for i in range(start, d.page_count):
            yield f'{tag}{i + 1}', d[i]


def fin_cabecera(a):
    """Última fila de la cabecera verde azulada (MOPT + título)."""
    h, w, _ = a.shape
    zona = a[: int(h * 0.2), int(w * 0.4): int(w * 0.95)].astype(int)
    r, g, b = zona[..., 0], zona[..., 1], zona[..., 2]
    teal = ((b > r + 15) & (g > r + 10) & (r < 110)).mean(axis=1) > 0.4
    filas = np.where(teal)[0]
    return int(filas.max()) + 4 if len(filas) else 0


def bandas(a, y_inicio):
    h, w, _ = a.shape
    x0, x1 = int(w * 0.08), int(w * 0.92)
    blanco = (a[:, x0:x1].min(axis=2) > 215).mean(axis=1) > 0.8
    cortes = [y_inicio] + [y for y in range(y_inicio, h) if blanco[y]] + [h]
    resultado = []
    for p, q in zip(cortes, cortes[1:]):
        if q - p > 40:
            resultado.append((p + 1, q - 1))
    return resultado


def panel(a, y0, y1):
    fila = a[y0:y1].astype(int)
    gris = (fila.min(axis=2) < 215).mean(axis=0) > 0.6
    xs = np.where(gris)[0]
    return (int(xs.min()), int(xs.max())) if len(xs) else (0, a.shape[1])


def senales(a, y0, y1):
    px0, px1 = panel(a, y0, y1)
    fila = a[y0:y1, px0 + 3:px1 - 3].astype(int)
    h, w, _ = fila.shape
    fondo = np.median(fila.reshape(-1, 3), axis=0)
    dist = np.abs(fila - fondo).sum(axis=2)
    sat = fila.max(axis=2) - fila.min(axis=2)
    color = (sat > 60) | (fila.min(axis=2) > 228)
    mascara = (dist > 90) | (sat > 70)
    mascara = ndimage.binary_closing(mascara, iterations=3)
    mascara = ndimage.binary_fill_holes(mascara)
    etiquetas, _ = ndimage.label(mascara)
    cajas = []
    for i, sl in enumerate(ndimage.find_objects(etiquetas), start=1):
        ys, xs = sl
        bh, bw = ys.stop - ys.start, xs.stop - xs.start
        comp = etiquetas[sl] == i
        area = comp.sum()
        if bh < 28 or bw < 12 or area < 900:
            continue
        if area / (bh * bw) < 0.3:
            continue
        sub = fila[sl][comp]
        satur = ((sub.max(axis=1) - sub.min(axis=1)) > 60).mean()
        brillo = (sub.min(axis=1) > 228).mean()
        oscuro = (sub.max(axis=1) < 90).mean()
        if satur < 0.15 and not (brillo > 0.35 and oscuro > 0.03):
            continue  # texto (blanco sobre gris u oscuro sobre gris)
        cajas.append((xs.start + px0 + 3, ys.start + y0, xs.stop + px0 + 3, ys.stop + y0))
    return cajas


def main():
    salida = {}
    miniaturas = []
    for tag, p in paginas():
        pix = p.get_pixmap(dpi=DPI)
        a = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.h, pix.w, pix.n)[:, :, :3]
        im = Image.fromarray(a.copy())
        dr = ImageDraw.Draw(im)
        y_ini = fin_cabecera(a)
        todas = []
        for y0, y1 in bandas(a, y_ini):
            cs = senales(a, y0, y1)
            cs.sort(key=lambda c: (c[1] // 25, c[0]))
            todas.extend(cs)
        for n, (x0, y0, x1, y1) in enumerate(todas):
            dr.rectangle([x0, y0, x1, y1], outline=(255, 0, 255), width=3)
            dr.rectangle([x0, y0, x0 + 26, y0 + 22], fill=(255, 0, 255))
            dr.text((x0 + 4, y0 + 4), str(n), fill='white')
        salida[tag] = [[round(v / ESC, 1) for v in c] for c in todas]
        miniaturas.append((tag, im.resize((im.width // 2, im.height // 2))))
    json.dump(salida, open(AQUI / 'detect.json', 'w'), indent=0)
    per = 8
    for s in range(0, len(miniaturas), per):
        chunk = miniaturas[s:s + per]
        w, h = chunk[0][1].size
        hoja = Image.new('RGB', ((w + 10) * 4, (h + 20) * 2), 'white')
        for k, (tag, im) in enumerate(chunk):
            x, y = (k % 4) * (w + 10), (k // 4) * (h + 20)
            hoja.paste(im, (x, y + 18))
            ImageDraw.Draw(hoja).text((x + 4, y + 2), tag, fill='black')
        TMP.mkdir(parents=True, exist_ok=True)
        hoja.save(TMP / f'det{s // per:02d}.png')
    print(sum(len(v) for v in salida.values()), 'cajas en', len(salida), 'páginas')


main()
