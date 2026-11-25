export type FamiliaSenalId = 'peligro' | 'reglamentacion' | 'indicacion' | 'pictogramas';

export type TipoSenalId =
  | 'peligro'
  | 'prioridad'
  | 'prohibicion-entrada'
  | 'restriccion-paso'
  | 'otras-prohibicion'
  | 'obligacion'
  | 'fin-prohibicion'
  | 'indicaciones-generales'
  | 'carriles'
  | 'servicio'
  | 'presenalizacion'
  | 'direccion'
  | 'identificacion-carreteras'
  | 'localizacion'
  | 'confirmacion'
  | 'uso-poblado'
  | 'paneles'
  | 'otras'
  | 'pictogramas';

export interface SenalCatalogo {
  /** Código del catálogo, por ejemplo «P-1» o «Pict. 2a». */
  codigo: string;
  nombre: string;
  descripcion: string;
  tipo: TipoSenalId;
  /** Nombre del archivo en assets/senales, sin extensión. */
  imagen: string;
  /** Página del PDF de origen: «A9» es la página 9 de la parte 1-45, «B5» la página 5 de la parte 46-99. */
  pagina: string;
}

export interface TipoSenal {
  id: TipoSenalId;
  familia: FamiliaSenalId;
  titulo: string;
  /** Subgrupo dentro de la familia, si el dosier lo usa (por ejemplo, «Orientación»). */
  grupo?: string;
}

export interface FamiliaSenal {
  id: FamiliaSenalId;
  titulo: string;
}
