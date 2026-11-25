// Genera el script ejecutable del recorrido: añade el mapa de respuestas
// (desde src/content/demo) y un envoltorio que devuelve los pasos superados
// aunque alguno falle.
// Uso: node e2e/generar.js <salida.js>
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/content/demo/preguntas');
const mapa = {};
for (const f of fs.readdirSync(dir)) {
  for (const p of JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))) mapa[p.id] = p.correcta;
}
const plantilla = fs
  .readFileSync(path.join(__dirname, 'recorrido.template.js'), 'utf8')
  .split('\n')
  .filter((l) => !/^\/\/ /.test(l))
  .join('\n')
  .replace('__RESPUESTAS__', JSON.stringify(mapa));

const salida = `async (pagina) => {
  const log = [];
  try {
    return await (${plantilla.trim()})(pagina, log);
  } catch (e) {
    return 'ERROR: ' + String(e.message).split('\\n')[0] + '\\n' + log.join('\\n');
  }
}
`;
fs.writeFileSync(process.argv[2], salida);
