import { capitulos } from './demo/capitulos';
import { camino, temas } from './demo/temas';
import type { Capitulo, Nivel, Pregunta, Tema } from './types';

export * from './types';
/** `temas` solo incluye los que tienen preguntas; `camino` añade los previstos, en orden. */
export { camino, capitulos, temas };

export const ETIQUETA_DEMO = 'Demo · pendiente de revisión';

/** Reglas de la demostración. No representan el formato oficial del examen. */
export const REGLAS = {
  maxFallosNivel: 3,
  segundosPorPregunta: 40,
  simulacro: { preguntas: 6, segundos: 180, maxFallos: 1 },
} as const;

/** Todos los niveles en el orden del camino. */
export const niveles: Nivel[] = temas.flatMap((t) => t.niveles);

const preguntasPorId = new Map<string, { pregunta: Pregunta; tema: Tema; nivel: Nivel }>();
for (const tema of temas) {
  for (const nivel of tema.niveles) {
    for (const pregunta of nivel.preguntas) {
      preguntasPorId.set(pregunta.id, { pregunta, tema, nivel });
    }
  }
}

export const getNivel = (id: string) => niveles.find((n) => n.id === id);
export const getTema = (id: string) => temas.find((t) => t.id === id);
export const getCapitulo = (id: string) => capitulos.find((c) => c.id === id);
export const getPregunta = (id: string) => preguntasPorId.get(id);
export const todasLasPreguntas = (): Pregunta[] => [...preguntasPorId.values()].map((v) => v.pregunta);

export const tituloNivel = (nivel: Nivel) => {
  const tema = getTema(nivel.temaId);
  return `${tema?.titulo ?? ''} · Nivel ${nivel.numero}`;
};

/** Duración estimada en minutos. */
export const duracionEstimada = (numPreguntas: number) =>
  Math.max(1, Math.round((numPreguntas * REGLAS.segundosPorPregunta) / 60));

export const capituloDeTema = (temaId: string): Capitulo | undefined =>
  capitulos.find((c) => c.temaId === temaId);
