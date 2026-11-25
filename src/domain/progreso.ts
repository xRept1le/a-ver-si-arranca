import type { Datos } from './types';

export interface ResumenTema {
  temaId: string;
  aciertos: number;
  fallos: number;
  nivelesCompletados: number;
  nivelesTotales: number;
}

interface TemaRef {
  id: string;
  niveles: { id: string }[];
}

/** Cifras de Progreso calculadas solo a partir de la actividad registrada. */
export function resumenProgreso(temas: TemaRef[], datos: Pick<Datos, 'respuestas' | 'completados' | 'simulacros'>) {
  const porTema: ResumenTema[] = temas.map((tema) => {
    const respuestas = datos.respuestas.filter((r) => r.temaId === tema.id);
    const aciertos = respuestas.filter((r) => r.acierto).length;
    return {
      temaId: tema.id,
      aciertos,
      fallos: respuestas.length - aciertos,
      nivelesCompletados: tema.niveles.filter((n) => datos.completados[n.id]).length,
      nivelesTotales: tema.niveles.length,
    };
  });

  const leccionesCompletadas = porTema.reduce((s, t) => s + t.nivelesCompletados, 0);
  const leccionesTotales = porTema.reduce((s, t) => s + t.nivelesTotales, 0);
  const hayActividad = datos.respuestas.length > 0 || datos.simulacros.length > 0;

  return { porTema, leccionesCompletadas, leccionesTotales, hayActividad };
}

/** Porcentaje entero o `null` si no hay respuestas (no se inventan cifras). */
export function porcentaje(aciertos: number, total: number): number | null {
  if (total === 0) return null;
  return Math.round((aciertos / total) * 100);
}
