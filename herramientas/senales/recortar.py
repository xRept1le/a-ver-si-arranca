"""Valida trans.py y recorta cada señal del PDF a assets/senales/{archivo}.png."""
import json, re, sys, collections
from pathlib import Path
import fitz
from PIL import Image
AQUI = Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import trans

REPO = str(AQUI.parents[1])
PDF = {'A': fitz.open(f'{REPO}/1110950_1-1-45.pdf'), 'B': fitz.open(f'{REPO}/1110950_1-46-99.pdf')}
det = json.load(open(AQUI / 'detect.json'))
MAX = 320  # lado máximo en px
PAD = 1.5  # pt


def archivo(codigo):
    return re.sub(r'[^a-z0-9]+', '-', codigo.lower()).strip('-')


def caja(tag, c):
    if isinstance(c, int):
        return det[tag][c]
    if c[0] == 'pt':
        return list(c[1:])
    bs = [det[tag][i] for i in c]
    return [min(b[0] for b in bs), min(b[1] for b in bs), max(b[2] for b in bs), max(b[3] for b in bs)]


errores = []
cods = collections.Counter(s[2] for s in trans.S)
for c, n in cods.items():
    if n > 1:
        errores.append(f'código duplicado {c}')
arch = collections.Counter(archivo(s[2]) for s in trans.S)
for a, n in arch.items():
    if n > 1:
        errores.append(f'archivo duplicado {a}')
for tag, c, *_ in trans.S:
    idx = [c] if isinstance(c, int) else ([] if c[0] == 'pt' else list(c))
    for i in idx:
        if i >= len(det.get(tag, [])):
            errores.append(f'{tag}: índice {i} no existe')
if errores:
    print('\n'.join(errores)); sys.exit(1)

solo_validar = '--validar' in sys.argv
salida = []
for tag, c, codigo, nombre, desc in trans.S:
    x0, y0, x1, y1 = caja(tag, c)
    doc = PDF[tag[0]]
    page = doc[int(tag[1:]) - 1]
    if not solo_validar:
        r = fitz.Rect(x0 - PAD, y0 - PAD, x1 + PAD, y1 + PAD)
        escala = MAX / max(r.width, r.height)
        pix = page.get_pixmap(matrix=fitz.Matrix(escala, escala), clip=r)
        img = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        img.save(f'{REPO}/assets/senales/{archivo(codigo)}.webp', 'WEBP', quality=72, method=6)
    salida.append(dict(pag=tag, seccion=trans.SECCION[tag], codigo=codigo, nombre=nombre,
                       descripcion=desc, archivo=archivo(codigo)))
json.dump(salida, open(AQUI / 'catalogo.json', 'w'), ensure_ascii=False, indent=1)
print(len(salida), 'señales')
print(collections.Counter(s['seccion'] for s in salida))
