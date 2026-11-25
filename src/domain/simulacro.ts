import type { RespuestaSimulacro } from './types';

interface PreguntaRef {
  id: string;
  correcta: number;
}

/** Elige `porTema` preguntas al azar de cada tema, en orden de temas. */
export function generarSimulacro<T extends PreguntaRef>(
  bancos: T[][],
  porTema: number,
  aleatorio: () => number = Math.random,
): T[] {
  return bancos.flatMap((banco) => {
    const copia = [...banco];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(aleatorio() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia.slice(0, porTema);
  });
}

/** Corrige el simulacro. Las preguntas sin responder cuentan como fallo. */
export function corregirSimulacro(
  preguntas: PreguntaRef[],
  elecciones: Record<string, number | undefined>,
  maxFallos: number,
) {
  const respuestas: RespuestaSimulacro[] = preguntas.map((p) => {
    const elegida = elecciones[p.id];
    return {
      preguntaId: p.id,
      elegida: elegida ?? null,
      acierto: elegida === p.correcta,
    };
  });
  const aciertos = respuestas.filter((r) => r.acierto).length;
  const fallos = respuestas.length - aciertos;
  return { respuestas, aciertos, total: respuestas.length, apto: fallos <= maxFallos };
}

export function formatoTiempo(segundos: number) {
  const s = Math.max(0, Math.ceil(segundos));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
