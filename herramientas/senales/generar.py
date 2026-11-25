"""Genera el contenido TypeScript del catálogo a partir de catalogo.json (salida de recortar.py).

Escribe src/content/senales/datos.ts (señales) e imagenes.ts (require estático por imagen).
No editar a mano esos archivos: corregir trans.py y volver a ejecutar recortar.py y generar.py.
"""
import json
from pathlib import Path

AQUI = Path(__file__).resolve().parent
REPO = AQUI.parents[1]
DESTINO = REPO / 'src' / 'content' / 'senales'
cat = json.load(open(AQUI / 'catalogo.json'))

AVISO = '// Generado por herramientas/senales/generar.py. No editar a mano.\n'

lineas = [AVISO, "import type { SenalCatalogo } from './tipos';\n\n",
          '/** Transcripción del catálogo, en el orden del dosier. */\n',
          'export const SENALES: SenalCatalogo[] = [\n']
for s in cat:
    campos = {
        'codigo': s['codigo'], 'nombre': s['nombre'], 'descripcion': s['descripcion'],
        'tipo': s['seccion'], 'imagen': s['archivo'], 'pagina': s['pag'],
    }
    lineas.append('  ' + json.dumps(campos, ensure_ascii=False) + ',\n')
lineas.append('];\n')
(DESTINO / 'datos.ts').write_text(''.join(lineas), encoding='utf-8')

img = [AVISO, '/* eslint-disable @typescript-eslint/no-require-imports */\n',
       '/** Recortes del PDF, en assets/senales. Metro necesita un require estático por archivo. */\n',
       'export const IMAGENES: Record<string, number> = {\n']
for s in cat:
    img.append(f"  '{s['archivo']}': require('../../../assets/senales/{s['archivo']}.webp'),\n")
img.append('};\n')
(DESTINO / 'imagenes.ts').write_text(''.join(img), encoding='utf-8')
print(len(cat), 'señales escritas en', DESTINO)
