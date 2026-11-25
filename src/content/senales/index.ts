import { SENALES } from './datos';
import { DISTANCIAS } from './distancias';
import { IMAGENES } from './imagenes';
import type { FamiliaSenal, FamiliaSenalId, SenalCatalogo, TipoSenal, TipoSenalId } from './tipos';

export * from './tipos';
export { SENALES };

/** Origen del contenido. El enlace es el que facilitó el usuario; el PDF se subió al repositorio. */
export const FUENTE_CATALOGO = {
  titulo: 'Catálogo de señales de circulación (MOPT)',
  editor: 'Ministerio de Obras Públicas y Transportes',
  url: 'https://www.transportes.gob.es/recursos_mfom/comodin/recursos/1110950_1.pdf',
  nota:
    'Edición antigua del catálogo. Algunas señales pueden haber cambiado o no figurar en la normativa vigente. Transcripción y recortes pendientes de revisión.',
} as const;

/** Familias en el orden del dosier (portadas de cada parte). */
export const FAMILIAS: FamiliaSenal[] = [
  { id: 'peligro', titulo: 'Señales de advertencia de peligro' },
  { id: 'reglamentacion', titulo: 'Señales de reglamentación' },
  { id: 'indicacion', titulo: 'Señales de indicación' },
  { id: 'pictogramas', titulo: 'Pictogramas' },
];

/** Tipos con los títulos de las cabeceras del dosier, en su orden. */
export const TIPOS: TipoSenal[] = [
  { id: 'peligro', familia: 'peligro', titulo: 'Advertencia de peligro' },
  { id: 'prioridad', familia: 'reglamentacion', titulo: 'Prioridad' },
  { id: 'prohibicion-entrada', familia: 'reglamentacion', titulo: 'Prohibición de entrada' },
  { id: 'restriccion-paso', familia: 'reglamentacion', titulo: 'Restricción de paso' },
  { id: 'otras-prohibicion', familia: 'reglamentacion', titulo: 'Otras de prohibición o restricción' },
  { id: 'obligacion', familia: 'reglamentacion', titulo: 'Obligación' },
  { id: 'fin-prohibicion', familia: 'reglamentacion', titulo: 'Fin de prohibición o restricción' },
  { id: 'indicaciones-generales', familia: 'indicacion', titulo: 'Indicaciones generales' },
  { id: 'carriles', familia: 'indicacion', titulo: 'Carriles' },
  { id: 'servicio', familia: 'indicacion', titulo: 'Servicio' },
  { id: 'presenalizacion', familia: 'indicacion', grupo: 'Orientación', titulo: 'Preseñalización' },
  { id: 'direccion', familia: 'indicacion', grupo: 'Orientación', titulo: 'Dirección' },
  { id: 'identificacion-carreteras', familia: 'indicacion', grupo: 'Orientación', titulo: 'Identificación de carreteras' },
  { id: 'localizacion', familia: 'indicacion', grupo: 'Orientación', titulo: 'Localización' },
  { id: 'confirmacion', familia: 'indicacion', grupo: 'Orientación', titulo: 'Confirmación' },
  { id: 'uso-poblado', familia: 'indicacion', grupo: 'Orientación', titulo: 'Uso específico en poblado' },
  { id: 'paneles', familia: 'indicacion', titulo: 'Paneles complementarios' },
  { id: 'otras', familia: 'indicacion', titulo: 'Otras señales' },
  { id: 'pictogramas', familia: 'pictogramas', titulo: 'Pictogramas' },
];

const porTipo = new Map<TipoSenalId, SenalCatalogo[]>();
for (const s of SENALES) {
  const lista = porTipo.get(s.tipo) ?? [];
  lista.push(s);
  porTipo.set(s.tipo, lista);
}

export const getTipoSenal = (id: string) => TIPOS.find((t) => t.id === id);
export const senalesDeTipo = (id: TipoSenalId): SenalCatalogo[] => porTipo.get(id) ?? [];
export const tiposDeFamilia = (id: FamiliaSenalId) => TIPOS.filter((t) => t.familia === id);
/** A qué distancia corresponde una señal de aproximación (paneles de salida y balizas de paso a nivel). */
export const distanciaSenal = (s: SenalCatalogo): string | undefined => DISTANCIAS[s.codigo];
export const imagenSenal = (s: SenalCatalogo): number | undefined => IMAGENES[s.imagen];

/** Título completo de un tipo, con su subgrupo si lo tiene. */
export const tituloTipo = (t: TipoSenal) => (t.grupo ? `${t.grupo} · ${t.titulo}` : t.titulo);

/** «A9» → «PDF 1-45, pág. 9». */
export const paginaFuente = (pagina: string) =>
  `PDF ${pagina[0] === 'A' ? '1-45' : '46-99'}, pág. ${pagina.slice(1)}`;
