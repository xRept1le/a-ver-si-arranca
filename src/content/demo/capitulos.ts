import type { Capitulo } from '../types';

/**
 * Índice provisional del temario del permiso B.
 * Contenido de demostración pendiente de revisión: solo «Prioridad de paso» tiene texto.
 * Los apartados vacíos ya sirven de destino para «Ver en el temario».
 */
export const capitulos: Capitulo[] = [
  {
    id: 'conductor',
    numero: 1,
    titulo: 'El conductor y el permiso B',
    legible: false,
    temaId: 'conductor',
    apartados: [
      { id: 'permisos', titulo: 'Clases de permiso y qué autoriza el permiso B', parrafos: [] },
      { id: 'requisitos', titulo: 'Requisitos para obtener el permiso', parrafos: [] },
      { id: 'vigencia', titulo: 'Vigencia y renovación', parrafos: [] },
      { id: 'puntos', titulo: 'El permiso por puntos', parrafos: [] },
      { id: 'novel', titulo: 'El conductor novel', parrafos: [] },
    ],
  },
  { id: 'via', numero: 2, titulo: 'La vía y sus usuarios', legible: false, apartados: [] },
  {
    id: 'senales',
    numero: 3,
    titulo: 'Señales y marcas viales',
    legible: false,
    temaId: 'senales',
    catalogoSenales: true,
    apartados: [
      { id: 'formas', titulo: 'Formas y colores de las señales', parrafos: [] },
      { id: 'orden-prioridad', titulo: 'Orden de prioridad entre señales', parrafos: [] },
      { id: 'peligro', titulo: 'Señales de advertencia de peligro', parrafos: [] },
      { id: 'prohibicion', titulo: 'Señales de prohibición y restricción', parrafos: [] },
      { id: 'obligacion', titulo: 'Señales de obligación', parrafos: [] },
      { id: 'indicacion', titulo: 'Señales de indicación', parrafos: [] },
      { id: 'marcas', titulo: 'Marcas viales', parrafos: [] },
      { id: 'agentes-semaforos', titulo: 'Agentes y semáforos', parrafos: [] },
    ],
  },
  {
    id: 'prioridad',
    numero: 4,
    titulo: 'Prioridad de paso',
    legible: true,
    temaId: 'prioridad',
    apartados: [
      {
        id: 'norma-general',
        titulo: 'La norma general: prioridad de la derecha',
        parrafos: [
          'En una intersección sin señales ni agentes, el conductor debe ceder el paso a los vehículos que se aproximan por su derecha. La regla se aplica también en las intersecciones en T: que su vía continúe no le da prioridad.',
          'Hay excepciones. Los vehículos que circulan por una vía pavimentada tienen prioridad sobre los que salen de una vía sin pavimentar. Los vehículos que circulan sobre raíles, como el tranvía, tienen prioridad sobre el resto. En las glorietas, tienen prioridad los que ya están dentro.',
          'Quien debe ceder el paso lo muestra a tiempo reduciendo la velocidad, sin obligar al otro a frenar o desviarse. Quien tiene prioridad tampoco debe confiarse: tiene que actuar con prudencia. Aunque tenga prioridad o el semáforo en verde, no entre en una intersección si va a quedar detenido dentro y bloquear el paso.',
        ],
      },
      {
        id: 'senales-prioridad',
        titulo: 'Señales que regulan la prioridad',
        parrafos: [
          'El orden de obediencia es: agentes, señalización circunstancial (por ejemplo, obras), semáforos, señales verticales y marcas viales. Si un semáforo no funciona, se obedecen las señales verticales.',
          'El STOP obliga a detenerse siempre en la línea de detención o, si no la hay, antes de la intersección, y después ceder el paso. El «Ceda el paso» obliga a ceder, pero solo exige detenerse cuando es necesario.',
          'El rombo amarillo con borde blanco indica que se circula por una calzada con prioridad en las intersecciones. Personal de obras y patrullas escolares pueden regular el paso con paletas de STOP o de paso permitido.',
        ],
      },
      {
        id: 'glorietas',
        titulo: 'Glorietas',
        parrafos: [
          'Los vehículos que circulan dentro de la glorieta tienen prioridad sobre los que quieren entrar. Para entrar, modere la velocidad, observe y entre cuando no obligue a frenar a quien ya circula.',
          'Para salir, colóquese con antelación en el carril exterior y señalice con el intermitente derecho. No se detenga dentro de la glorieta salvo por necesidades de la circulación, ni corte la trayectoria de ciclistas que circulen por ella.',
        ],
      },
      {
        id: 'estrechamientos',
        titulo: 'Estrechamientos, pendientes y pasos a nivel',
        parrafos: [
          'En un estrechamiento sin señalizar en el que no caben dos vehículos, tiene preferencia el que haya entrado primero. El que cede espera fuera, sin estorbar.',
          'Si el estrechamiento está señalizado, la señal cuadrada azul con flecha blanca grande le da prioridad respecto al sentido contrario. La señal circular con borde rojo le obliga a ceder el paso a quienes vienen de frente.',
          'En tramos de gran pendiente, estrechos y sin señalizar, tiene preferencia el vehículo que sube, salvo que tenga más cerca un apartadero. En los pasos a nivel, el tren siempre tiene prioridad y está prohibido adelantar.',
        ],
      },
      {
        id: 'peatones-ciclistas-animales',
        titulo: 'Peatones, ciclistas y animales',
        parrafos: [
          'Los conductores tienen prioridad sobre los peatones, salvo en los pasos para peatones señalizados, al girar para entrar en otra vía si hay peatones cruzándola y al cruzar un arcén por el que circulan peatones. En las calles residenciales, los peatones tienen prioridad.',
          'Las bicicletas tienen prioridad cuando circulan por un carril bici, un paso para ciclistas o un arcén señalizado, cuando el vehículo de motor gira y hay un ciclista cerca, y cuando, circulando en grupo, el primero ya ha iniciado el cruce.',
          'Con los animales ocurre algo parecido: tienen prioridad en las cañadas señalizadas, cuando el vehículo gira y hay animales cruzando y cuando el vehículo cruza un arcén por el que circulan.',
        ],
      },
      {
        id: 'vehiculos-prioritarios',
        titulo: 'Vehículos prioritarios',
        parrafos: [
          'Policía, bomberos, ambulancias, protección civil y otros servicios de urgencia tienen prioridad cuando circulan en servicio urgente y lo señalizan. Si se acercan, facilíteles el paso apartándose a la derecha de forma ordenada o deteniéndose si es necesario.',
          'Sin las señales de urgencia encendidas, estos vehículos circulan como cualquier otro. Tampoco se deben cortar ni interrumpir las columnas organizadas, como las comitivas.',
        ],
      },
      {
        id: 'incorporaciones',
        titulo: 'Incorporaciones y maniobras',
        parrafos: [
          'Quien se incorpora a la circulación desde un estacionamiento, un garaje, una gasolinera o un camino privado cede el paso a quienes ya circulan. En autopistas y autovías, los que circulan por ellas tienen prioridad sobre los que acceden. El carril de aceleración sirve para alcanzar una velocidad adecuada y entrar sin estorbar.',
          'Los cambios de sentido y la marcha atrás no dan prioridad: hay que asegurarse de no poner en peligro a otros usuarios.',
        ],
      },
    ],
  },
  {
    id: 'velocidad',
    numero: 5,
    titulo: 'Velocidad y distancias',
    legible: false,
    temaId: 'velocidad',
    apartados: [
      { id: 'limites', titulo: 'Límites de velocidad', parrafos: [] },
      { id: 'minimas', titulo: 'Velocidades mínimas', parrafos: [] },
      { id: 'adaptacion', titulo: 'Adaptar la velocidad', parrafos: [] },
      { id: 'distancias', titulo: 'Distancia de detención y de seguridad', parrafos: [] },
      { id: 'condiciones', titulo: 'Condiciones adversas', parrafos: [] },
    ],
  },
  { id: 'maniobras', numero: 6, titulo: 'Maniobras: incorporación, desplazamientos y adelantamiento', legible: false, apartados: [] },
  { id: 'parada', numero: 7, titulo: 'Parada y estacionamiento', legible: false, apartados: [] },
  { id: 'alumbrado', numero: 8, titulo: 'Alumbrado y señales de los vehículos', legible: false, apartados: [] },
  { id: 'autopistas', numero: 9, titulo: 'Autopistas, autovías y túneles', legible: false, apartados: [] },
  { id: 'riesgos', numero: 10, titulo: 'Alcohol, drogas, fatiga y distracciones', legible: false, apartados: [] },
  { id: 'seguridad', numero: 11, titulo: 'Seguridad activa y pasiva', legible: false, apartados: [] },
  { id: 'mecanica', numero: 12, titulo: 'Mecánica y mantenimiento', legible: false, apartados: [] },
  { id: 'documentacion', numero: 13, titulo: 'Documentación, infracciones y sanciones', legible: false, apartados: [] },
  { id: 'accidentes', numero: 14, titulo: 'Accidentes y primeros auxilios', legible: false, apartados: [] },
  { id: 'eficiente', numero: 15, titulo: 'Conducción eficiente y medio ambiente', legible: false, apartados: [] },
];
