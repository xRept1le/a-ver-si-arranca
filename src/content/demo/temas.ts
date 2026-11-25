import type { Nivel, Pregunta, Tema } from '../types';
import prioridad1 from './preguntas/prioridad-1.json';
import prioridad2 from './preguntas/prioridad-2.json';
import senales1 from './preguntas/senales-1.json';
import senales2 from './preguntas/senales-2.json';
import velocidad1 from './preguntas/velocidad-1.json';
import velocidad2 from './preguntas/velocidad-2.json';

const p = (json: unknown) => json as Pregunta[];

const nivel = (temaId: string, numero: number, titulo: string, preguntas: Pregunta[]): Nivel => ({
  id: `${temaId}-${numero}`,
  temaId,
  numero,
  titulo,
  preguntas,
});

/** Temas de demostración, en el orden del camino de Inicio. */
export const temas: Tema[] = [
  {
    id: 'senales',
    titulo: 'Señales',
    capituloId: 'senales',
    niveles: [
      nivel('senales', 1, 'Peligro y prohibición', p(senales1)),
      nivel('senales', 2, 'Obligación, indicación y marcas', p(senales2)),
    ],
  },
  {
    id: 'prioridad',
    titulo: 'Prioridad de paso',
    capituloId: 'prioridad',
    niveles: [
      nivel('prioridad', 1, 'Intersecciones', p(prioridad1)),
      nivel('prioridad', 2, 'Glorietas y casos especiales', p(prioridad2)),
    ],
  },
  {
    id: 'velocidad',
    titulo: 'Velocidad',
    capituloId: 'velocidad',
    niveles: [
      nivel('velocidad', 1, 'Límites de velocidad', p(velocidad1)),
      nivel('velocidad', 2, 'Adaptar la velocidad', p(velocidad2)),
    ],
  },
];
