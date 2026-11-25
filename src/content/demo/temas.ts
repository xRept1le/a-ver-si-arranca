import type { Nivel, Pregunta, Tema, TemaPrevisto, TramoCamino } from '../types';
import { capitulos } from './capitulos';
import prioridad1 from './preguntas/prioridad-1.json';
import prioridad2 from './preguntas/prioridad-2.json';
import senales1 from './preguntas/senales-1.json';
import senales2 from './preguntas/senales-2.json';
import velocidad1 from './preguntas/velocidad-1.json';
import velocidad2 from './preguntas/velocidad-2.json';

/** Preguntas por nivel del camino de Inicio. */
export const PREGUNTAS_POR_NIVEL = 15;

/**
 * Convierte bloques temáticos de preguntas en niveles consecutivos de
 * PREGUNTAS_POR_NIVEL preguntas. Un bloque de 30 da dos niveles («parte 1» y «parte 2»).
 */
function niveles(temaId: string, bloques: { titulo: string; preguntas: unknown }[]): Nivel[] {
  const resultado: Nivel[] = [];
  for (const bloque of bloques) {
    const preguntas = bloque.preguntas as Pregunta[];
    const partes = Math.ceil(preguntas.length / PREGUNTAS_POR_NIVEL);
    for (let i = 0; i < partes; i++) {
      const numero = resultado.length + 1;
      resultado.push({
        id: `${temaId}-${numero}`,
        temaId,
        numero,
        titulo: partes > 1 ? `${bloque.titulo} · parte ${i + 1}` : bloque.titulo,
        preguntas: preguntas.slice(i * PREGUNTAS_POR_NIVEL, (i + 1) * PREGUNTAS_POR_NIVEL),
      });
    }
  }
  return resultado;
}

/** Temas de demostración, en el orden del camino de Inicio. */
export const temas: Tema[] = [
  {
    id: 'senales',
    titulo: 'Señales',
    capituloId: 'senales',
    niveles: niveles('senales', [
      { titulo: 'Peligro y prohibición', preguntas: senales1 },
      { titulo: 'Obligación, indicación y marcas', preguntas: senales2 },
    ]),
  },
  {
    id: 'prioridad',
    titulo: 'Prioridad de paso',
    capituloId: 'prioridad',
    niveles: niveles('prioridad', [
      { titulo: 'Intersecciones', preguntas: prioridad1 },
      { titulo: 'Glorietas y casos especiales', preguntas: prioridad2 },
    ]),
  },
  {
    id: 'velocidad',
    titulo: 'Velocidad',
    capituloId: 'velocidad',
    niveles: niveles('velocidad', [
      { titulo: 'Límites de velocidad', preguntas: velocidad1 },
      { titulo: 'Adaptar la velocidad', preguntas: velocidad2 },
    ]),
  },
];

/** Niveles previstos por tema sin preguntas, como los temas actuales (2 bloques × 2 partes). */
const NIVELES_PREVISTOS = 4;

function previsto(id: string, titulo: string, capituloId: string): TemaPrevisto {
  return {
    previsto: true,
    id,
    titulo,
    capituloId,
    niveles: Array.from({ length: NIVELES_PREVISTOS }, (_, i) => ({ id: `${id}-${i + 1}`, numero: i + 1 })),
  };
}

/**
 * Tramos del camino de Inicio: un tramo por capítulo del temario, en su orden.
 * Los capítulos sin preguntas figuran como temas previstos («Próximamente»).
 */
export const camino: TramoCamino[] = capitulos.map(
  (c) => temas.find((t) => t.capituloId === c.id) ?? previsto(c.id, c.titulo, c.id),
);
