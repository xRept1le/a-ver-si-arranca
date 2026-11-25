import type { Origen, RegistroError } from './types';

interface Evento {
  preguntaId: string;
  acierto: boolean;
  origen: Origen;
  sesionId: string;
  fecha: number;
}

/**
 * Transiciones de Mis errores:
 * - Un fallo deja la pregunta en pendientes (y suma un fallo).
 * - Un acierto en el repaso pasa una pendiente a corregidas.
 * - Un fallo posterior sobre una corregida la devuelve a pendientes.
 * - Los aciertos fuera del repaso no cambian nada.
 */
export function aplicarAErrores(
  errores: Record<string, RegistroError>,
  evento: Evento,
): Record<string, RegistroError> {
  const actual = errores[evento.preguntaId];

  if (!evento.acierto) {
    return {
      ...errores,
      [evento.preguntaId]: {
        preguntaId: evento.preguntaId,
        estado: 'pendiente',
        fallos: (actual?.fallos ?? 0) + 1,
        ultimaSesionFallo: evento.sesionId,
        actualizado: evento.fecha,
      },
    };
  }

  if (evento.origen === 'repaso' && actual?.estado === 'pendiente') {
    return {
      ...errores,
      [evento.preguntaId]: { ...actual, estado: 'corregida', actualizado: evento.fecha },
    };
  }

  return errores;
}

export function listarErrores(errores: Record<string, RegistroError>) {
  const todos = Object.values(errores).sort((a, b) => b.actualizado - a.actualizado);
  return {
    pendientes: todos.filter((e) => e.estado === 'pendiente'),
    corregidas: todos.filter((e) => e.estado === 'corregida'),
  };
}
