import type { Datos } from './types';

export type EstadoNivel = 'completado' | 'disponible' | 'bloqueado';

interface NivelRef {
  id: string;
}

/**
 * Un nivel está disponible si es el primero o si el anterior está completado.
 * Los completados siguen siéndolo aunque se repitan con peor resultado.
 */
export function estadosNiveles(niveles: NivelRef[], completados: Datos['completados']) {
  const estados: Record<string, EstadoNivel> = {};
  niveles.forEach((nivel, i) => {
    if (completados[nivel.id]) estados[nivel.id] = 'completado';
    else if (i === 0 || completados[niveles[i - 1].id]) estados[nivel.id] = 'disponible';
    else estados[nivel.id] = 'bloqueado';
  });
  return estados;
}

/** Primer nivel sin completar, o `undefined` si están todos completados. */
export function nivelActual<T extends NivelRef>(niveles: T[], completados: Datos['completados']) {
  return niveles.find((n) => !completados[n.id]);
}

/** Para un nivel bloqueado, el nivel que hay que completar antes. */
export function nivelQueFalta<T extends NivelRef>(
  niveles: T[],
  completados: Datos['completados'],
  nivelId: string,
): T | undefined {
  const estados = estadosNiveles(niveles, completados);
  if (estados[nivelId] !== 'bloqueado') return undefined;
  return nivelActual(niveles, completados);
}

export function nivelSuperado(fallos: number, maxFallos: number) {
  return fallos <= maxFallos;
}
