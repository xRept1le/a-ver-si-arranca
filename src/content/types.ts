export type EstadoContenido = 'demo-pendiente-revision';

export type EscenaId = 'cruce-sin-senalizar';

export interface Pregunta {
  id: string;
  enunciado: string;
  opciones: [string, string, string];
  correcta: 0 | 1 | 2;
  explicacion: string;
  /** Apartado del capítulo del tema al que pertenece la pregunta. */
  apartado: string;
  escena?: EscenaId;
}

export interface Nivel {
  id: string;
  temaId: string;
  numero: number;
  titulo: string;
  preguntas: Pregunta[];
}

export interface Tema {
  id: string;
  titulo: string;
  capituloId: string;
  niveles: Nivel[];
}

/** Nivel del camino que todavía no tiene preguntas. */
export interface NivelPrevisto {
  id: string;
  numero: number;
}

/** Tema que ya figura en el camino pero aún no tiene preguntas ni forma parte del desbloqueo. */
export interface TemaPrevisto {
  previsto: true;
  id: string;
  titulo: string;
  capituloId: string;
  niveles: NivelPrevisto[];
}

/** Tramo del camino de Inicio: un tema con preguntas o uno previsto. */
export type TramoCamino = Tema | TemaPrevisto;

export const esPrevisto = (t: TramoCamino): t is TemaPrevisto => 'previsto' in t;

export interface Apartado {
  id: string;
  titulo: string;
  /** Párrafos. Vacío si el capítulo todavía no tiene texto. */
  parrafos: string[];
}

export interface Capitulo {
  id: string;
  numero: number;
  titulo: string;
  legible: boolean;
  temaId?: string;
  /** Muestra el acceso al catálogo de señales del dosier. */
  catalogoSenales?: boolean;
  apartados: Apartado[];
}
