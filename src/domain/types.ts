export type Origen = 'leccion' | 'repaso' | 'simulacro';

export interface Respuesta {
  preguntaId: string;
  temaId: string;
  acierto: boolean;
  origen: Origen;
  sesionId: string;
  fecha: number;
}

export type EstadoError = 'pendiente' | 'corregida';

export interface RegistroError {
  preguntaId: string;
  estado: EstadoError;
  fallos: number;
  ultimaSesionFallo: string;
  actualizado: number;
}

export interface RespuestaSimulacro {
  preguntaId: string;
  elegida: number | null;
  acierto: boolean;
}

export interface ResultadoSimulacro {
  id: string;
  fecha: number;
  aciertos: number;
  total: number;
  apto: boolean;
  porTiempo: boolean;
  respuestas: RespuestaSimulacro[];
}

export interface Ajustes {
  recordatorios: boolean;
  /** Formato HH:MM */
  hora: string;
}

export interface Datos {
  completados: Record<string, { veces: number; ultimaVez: number }>;
  respuestas: Respuesta[];
  errores: Record<string, RegistroError>;
  simulacros: ResultadoSimulacro[];
  ajustes: Ajustes;
}

export const datosIniciales = (): Datos => ({
  completados: {},
  respuestas: [],
  errores: {},
  simulacros: [],
  ajustes: { recordatorios: false, hora: '19:00' },
});
