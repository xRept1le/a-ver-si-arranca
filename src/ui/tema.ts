/**
 * Identidad visual: base negra y gris, azul como único acento
 * (acciones, selección y nivel actual). Aciertos, fallos y bloqueos
 * se distinguen con iconos y texto, no solo con tonos.
 */
export const colores = {
  fondo: '#0B0B0C',
  superficie: '#16171A',
  superficieAlta: '#202227',
  borde: '#2E3036',
  bordeFuerte: '#4A4D55',
  texto: '#F2F2F3',
  textoSuave: '#A0A3AB',
  textoTenue: '#757984',
  /** Acento para texto, bordes e iconos sobre fondo oscuro. */
  acento: '#3B82F6',
  /** Acento para rellenos con texto blanco encima (contraste AA). */
  acentoRelleno: '#2563EB',
  acentoSuave: 'rgba(59,130,246,0.14)',
  /** Acierto y fallo: grises claros/oscuros diferenciados por icono y texto. */
  acierto: '#E6E7EA',
  fallo: '#8B8F99',
  sobreAcento: '#FFFFFF',
} as const;

export const espacio = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;

export const radio = { s: 8, m: 14, l: 20, total: 999 } as const;

/** Tamaño mínimo de los objetivos táctiles (Material: 48 dp). */
export const TOQUE_MIN = 48;

export const texto = {
  titulo: { fontSize: 26, fontWeight: '800' as const, color: colores.texto, letterSpacing: -0.3 },
  subtitulo: { fontSize: 19, fontWeight: '700' as const, color: colores.texto },
  cuerpo: { fontSize: 16, lineHeight: 24, color: colores.texto },
  suave: { fontSize: 14, lineHeight: 20, color: colores.textoSuave },
  etiqueta: {
    fontSize: 12,
    fontWeight: '700' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
    color: colores.textoSuave,
  },
};
