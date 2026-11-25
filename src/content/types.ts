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
  apartados: Apartado[];
}
