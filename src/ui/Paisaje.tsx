/**
 * Elementos decorativos del camino de niveles, dibujados en SVG.
 * Cada pieza se dibuja con su base (el suelo) en (0, 0) y crece hacia arriba (y negativa).
 * Los tonos son apagados para no competir con los niveles ni con el acento azul.
 */
import type { ReactNode } from 'react';
import { Circle, Ellipse, G, Line, Path, Polygon, Rect, Text as SvgText } from 'react-native-svg';

export const PAISAJE = {
  campo: '#0E1511',
  hierba: '#1D3326',
  ciudad: '#101216',
  arcen: '#1A1C20',
  lineaBorde: '#7D818A',
  asfalto: '#24262B',
  acera: '#30333A',
  bordillo: '#474B53',
  asfaltoCiudad: '#2A2C31',
  lineaCentral: '#8E929B',
  pino: '#2C5A42',
  pinoOscuro: '#234A36',
  copa: '#33654B',
  copaClara: '#3E7558',
  tronco: '#5B4636',
  lana: '#E2E3E6',
  oscuro: '#2A2C31',
  vaca: '#E6E7EA',
  hocico: '#B7AFAF',
  conejo: '#9A9DA5',
  ciervo: '#7A6248',
  cuerna: '#A3906F',
  molino: '#D9DBDF',
  tejado: '#8A4636',
  paja: '#B89A5A',
  pajaOscura: '#8F7642',
  valla: '#6E6255',
  pajaro: '#8B8F99',
  edificios: ['#1F2228', '#262A31', '#2C3038', '#1B1E23'],
  ventana: '#E5C36A',
  ventanaApagada: '#383C44',
  farola: '#6B7079',
  luz: '#F4D27A',
  rojo: '#B84A3A',
  ambar: '#C9A64A',
  verde: '#2E9E5B',
  blanco: '#F2F2F3',
  /** Azul de las señales de orientación. */
  azulSenal: '#1F55D6',
  pueblo: '#13120E',
  cal: '#8E8980',
  calSombra: '#77726A',
  zocalo: '#5E5A55',
  madera: '#4A3628',
  tierra: '#2B251B',
  tejados: ['#7A3E2E', '#6E4635', '#5F4A3F'],
  roca: '#1A1C1F',
  rocaClara: '#24272B',
  hormigon: '#4A4D55',
  interiorTunel: '#050506',
  toalla: '#3B82F6',
  sombrilla: '#C9A64A',
  olivo: '#4E5E45',
  olivoClaro: '#5D6E52',
  naranja: '#D08A3A',
  vid: '#3E5A36',
  uva: '#5B3A5E',
  piedra: '#3A3D42',
  piedraClara: '#4A4E54',
  monte: '#2A2D33',
  nieve: '#C9D2DB',
  cabra: '#8A7A66',
  cactus: '#3F6B4C',
  puertaAzul: '#3B6FB6',
  contenedor1: '#6E3B33',
  contenedor2: '#2F5170',
  contenedor3: '#5D6B3A',
  humo: '#8B8F99',
  placa: '#1E3A66',
  placaLinea: '#5B7BB0',
  arena: '#3A3426',
  agua: '#17324A',
  espuma: '#9FB7CC',
  pato: '#2E6B4F',
} as const;

type Pieza = { x: number; y: number; s?: number; v?: number };

function En({ x, y, s = 1, children }: { x: number; y: number; s?: number; children: ReactNode }) {
  return <G transform={`translate(${x} ${y}) scale(${s})`}>{children}</G>;
}

/** Número pseudoaleatorio estable a partir de una semilla. */
export function azar(semilla: number) {
  const v = Math.sin(semilla * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
}

// ── Campo ─────────────────────────────────────────────────────────────

export function Pino({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-3} y={-10} width={6} height={10} fill={PAISAJE.tronco} />
      <Polygon points="-18,-10 18,-10 0,-36" fill={PAISAJE.pinoOscuro} />
      <Polygon points="-15,-24 15,-24 0,-48" fill={PAISAJE.pino} />
      <Polygon points="-11,-37 11,-37 0,-58" fill={PAISAJE.pino} />
    </En>
  );
}

export function Arbol({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-3} y={-20} width={6} height={20} rx={2} fill={PAISAJE.tronco} />
      <Circle cx={-10} cy={-28} r={11} fill={PAISAJE.copa} />
      <Circle cx={10} cy={-28} r={11} fill={PAISAJE.copa} />
      <Circle cx={0} cy={-38} r={15} fill={PAISAJE.copaClara} />
    </En>
  );
}

export function Arbusto({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Circle cx={-7} cy={-6} r={7} fill={PAISAJE.copa} />
      <Circle cx={6} cy={-6} r={8} fill={PAISAJE.copaClara} />
      <Circle cx={0} cy={-11} r={7} fill={PAISAJE.copa} />
    </En>
  );
}

export function Oveja({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Rect x={-9} y={-7} width={3} height={7} fill={PAISAJE.oscuro} />
        <Rect x={5} y={-7} width={3} height={7} fill={PAISAJE.oscuro} />
        <Circle cx={-9} cy={-14} r={7} fill={PAISAJE.lana} />
        <Circle cx={0} cy={-17} r={8} fill={PAISAJE.lana} />
        <Circle cx={9} cy={-14} r={7} fill={PAISAJE.lana} />
        <Circle cx={-4} cy={-10} r={7} fill={PAISAJE.lana} />
        <Circle cx={5} cy={-10} r={7} fill={PAISAJE.lana} />
        <Ellipse cx={16} cy={-17} rx={5} ry={6} fill={PAISAJE.oscuro} />
        <Ellipse cx={13} cy={-21} rx={3} ry={1.6} fill={PAISAJE.oscuro} />
      </G>
    </En>
  );
}

export function Vaca({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Rect x={-16} y={-10} width={4} height={10} fill={PAISAJE.oscuro} />
        <Rect x={-9} y={-10} width={4} height={10} fill={PAISAJE.oscuro} />
        <Rect x={4} y={-10} width={4} height={10} fill={PAISAJE.oscuro} />
        <Rect x={10} y={-10} width={4} height={10} fill={PAISAJE.oscuro} />
        <Rect x={-19} y={-27} width={36} height={19} rx={7} fill={PAISAJE.vaca} />
        <Ellipse cx={-9} cy={-20} rx={6} ry={4} fill={PAISAJE.oscuro} />
        <Ellipse cx={5} cy={-23} rx={5} ry={3.5} fill={PAISAJE.oscuro} />
        <Path d="M-19,-24 q-6,4 -4,12" stroke={PAISAJE.vaca} strokeWidth={2} fill="none" />
        <Rect x={13} y={-33} width={12} height={14} rx={4} fill={PAISAJE.vaca} />
        <Rect x={16} y={-24} width={10} height={7} rx={3} fill={PAISAJE.hocico} />
        <Line x1={15} y1={-33} x2={13} y2={-37} stroke={PAISAJE.hocico} strokeWidth={2} />
        <Line x1={23} y1={-33} x2={25} y2={-37} stroke={PAISAJE.hocico} strokeWidth={2} />
      </G>
    </En>
  );
}

export function Conejo({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Ellipse cx={0} cy={-7} rx={9} ry={7} fill={PAISAJE.conejo} />
        <Circle cx={-9} cy={-8} r={3} fill={PAISAJE.lana} />
        <Circle cx={8} cy={-13} r={5} fill={PAISAJE.conejo} />
        <Ellipse cx={6} cy={-22} rx={2} ry={6} fill={PAISAJE.conejo} />
        <Ellipse cx={10} cy={-21} rx={2} ry={6} fill={PAISAJE.conejo} />
        <Circle cx={10} cy={-14} r={1} fill={PAISAJE.oscuro} />
      </G>
    </En>
  );
}

export function Ciervo({ x, y, s, v = 1 }: Pieza) {
  const pata = { stroke: PAISAJE.ciervo, strokeWidth: 3, strokeLinecap: 'round' as const };
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Line x1={-11} y1={-18} x2={-12} y2={0} {...pata} />
        <Line x1={-5} y1={-18} x2={-5} y2={0} {...pata} />
        <Line x1={7} y1={-18} x2={8} y2={0} {...pata} />
        <Line x1={12} y1={-18} x2={13} y2={0} {...pata} />
        <Ellipse cx={0} cy={-23} rx={16} ry={8} fill={PAISAJE.ciervo} />
        <Polygon points="9,-27 15,-28 21,-42 16,-44" fill={PAISAJE.ciervo} />
        <Ellipse cx={22} cy={-44} rx={6} ry={4} fill={PAISAJE.ciervo} />
        <Path
          d="M18,-47 l-3,-9 M16.5,-52 l-5,-2 M21,-47 l2,-10 M22.5,-53 l5,-3"
          stroke={PAISAJE.cuerna}
          strokeWidth={1.8}
          strokeLinecap="round"
          fill="none"
        />
        <Circle cx={-15} cy={-25} r={2.5} fill={PAISAJE.lana} />
      </G>
    </En>
  );
}

export function Molino({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Polygon points="-11,0 11,0 8,-40 -8,-40" fill={PAISAJE.molino} />
      <Rect x={-3} y={-12} width={6} height={12} rx={3} fill={PAISAJE.oscuro} />
      <Rect x={-2} y={-28} width={4} height={5} fill={PAISAJE.oscuro} />
      <Polygon points="-10,-40 10,-40 0,-53" fill={PAISAJE.tejado} />
      <G transform="translate(0 -43)">
        {[20, 110, 200, 290].map((a) => (
          <G key={a} transform={`rotate(${a})`}>
            <Line x1={0} y1={0} x2={0} y2={-30} stroke={PAISAJE.valla} strokeWidth={1.5} />
            <Rect x={0.5} y={-30} width={6} height={22} fill={PAISAJE.molino} opacity={0.85} />
          </G>
        ))}
        <Circle cx={0} cy={0} r={2.5} fill={PAISAJE.oscuro} />
      </G>
    </En>
  );
}

export function Fardo({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Circle cx={0} cy={-11} r={11} fill={PAISAJE.paja} />
      <Circle cx={0} cy={-11} r={7} fill="none" stroke={PAISAJE.pajaOscura} strokeWidth={1.5} />
      <Circle cx={0} cy={-11} r={3} fill="none" stroke={PAISAJE.pajaOscura} strokeWidth={1.5} />
    </En>
  );
}

export function Hierba({ x, y }: Pieza) {
  return <Path d={`M${x},${y} l-3,-7 M${x},${y} l0,-9 M${x},${y} l3,-7`} stroke={PAISAJE.hierba} strokeWidth={1.5} strokeLinecap="round" />;
}

// ── Ciudad ────────────────────────────────────────────────────────────

/** Edificio de ancho `w` y alto `h` con ventanas, algunas encendidas. */
export function Edificio({ x, y, w, h, semilla }: { x: number; y: number; w: number; h: number; semilla: number }) {
  const cols = Math.max(1, Math.floor((w - 6) / 9));
  const filas = Math.max(1, Math.floor((h - 14) / 12));
  const margen = (w - cols * 9 + 4) / 2;
  const ventanas: ReactNode[] = [];
  for (let f = 0; f < filas; f++) {
    for (let c = 0; c < cols; c++) {
      const encendida = azar(semilla * 31 + f * 7 + c) > 0.8;
      ventanas.push(
        <Rect
          key={`${f}-${c}`}
          x={-w / 2 + margen + c * 9}
          y={-h + 8 + f * 12}
          width={5}
          height={6}
          fill={encendida ? PAISAJE.ventana : PAISAJE.ventanaApagada}
          opacity={encendida ? 0.7 : 1}
        />,
      );
    }
  }
  return (
    <G transform={`translate(${x} ${y})`}>
      <Rect x={-w / 2} y={-h} width={w} height={h} fill={PAISAJE.edificios[semilla % PAISAJE.edificios.length]} />
      <Rect x={-w / 2} y={-h} width={w} height={3} fill={PAISAJE.bordillo} />
      {ventanas}
    </G>
  );
}

export function Casa({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-14} y={-20} width={28} height={20} fill={PAISAJE.edificios[2]} />
      <Polygon points="-17,-20 17,-20 0,-34" fill={PAISAJE.tejado} />
      <Rect x={-4} y={-11} width={8} height={11} fill={PAISAJE.oscuro} />
      <Rect x={-11} y={-16} width={5} height={5} fill={PAISAJE.ventana} opacity={0.85} />
      <Rect x={6} y={-16} width={5} height={5} fill={PAISAJE.ventanaApagada} />
    </En>
  );
}

/** Farola; `v` = 1 si el brazo apunta a la derecha, -1 a la izquierda. */
export function Farola({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Line x1={0} y1={0} x2={0} y2={-46} stroke={PAISAJE.farola} strokeWidth={2.5} />
        <Line x1={0} y1={-46} x2={9} y2={-46} stroke={PAISAJE.farola} strokeWidth={2.5} />
        <Circle cx={10} cy={-43} r={11} fill={PAISAJE.luz} opacity={0.12} />
        <Rect x={6} y={-46} width={8} height={4} rx={1.5} fill={PAISAJE.luz} />
      </G>
    </En>
  );
}

export function EntradaPoblado({ x, y, nombre }: { x: number; y: number; nombre: string }) {
  const w = Math.max(68, nombre.length * 7.4 + 16);
  return (
    <G transform={`translate(${x} ${y})`}>
      <Line x1={0} y1={0} x2={0} y2={-30} stroke={PAISAJE.farola} strokeWidth={3} />
      <Rect x={-w / 2} y={-58} width={w} height={30} rx={3} fill={PAISAJE.blanco} stroke={PAISAJE.oscuro} strokeWidth={2} />
      <SvgText x={0} y={-39} fontSize={11} fontWeight="bold" fill="#111" textAnchor="middle">
        {nombre}
      </SvgText>
    </G>
  );
}

/**
 * Cartel de orientación sobre la calzada (fondo azul, orla blanca, identificador de vía,
 * destino y flechas de carril), sostenido por dos postes que llegan al suelo en `ySuelo`.
 */
export function CartelOrientacion({
  x,
  y,
  ySuelo,
  ruta,
  nombre,
  separacion,
}: {
  x: number;
  y: number;
  ySuelo: number;
  ruta: string;
  nombre: string;
  separacion: number;
}) {
  const w = 136;
  const h = 64;
  const chip = ruta.length * 8 + 10;
  const flecha = (fx: number) => (
    <Path
      d={`M${fx},${y + h - 22} V${y + h - 9} M${fx - 6},${y + h - 15} L${fx},${y + h - 8} L${fx + 6},${y + h - 15}`}
      stroke={PAISAJE.blanco}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  );
  return (
    <G>
      <Rect x={x - separacion / 2 - 2} y={y + h - 4} width={4} height={ySuelo - y - h + 4} fill={PAISAJE.farola} />
      <Rect x={x + separacion / 2 - 2} y={y + h - 4} width={4} height={ySuelo - y - h + 4} fill={PAISAJE.farola} />
      <Rect x={x - w / 2} y={y} width={w} height={h} rx={8} fill={PAISAJE.azulSenal} />
      <Rect x={x - w / 2 + 3} y={y + 3} width={w - 6} height={h - 6} rx={6} fill="none" stroke={PAISAJE.blanco} strokeWidth={1.6} />
      <Rect x={x - chip / 2} y={y + 8} width={chip} height={16} fill="none" stroke={PAISAJE.blanco} strokeWidth={1.4} />
      <SvgText x={x} y={y + 20.5} fontSize={11.5} fontWeight="bold" fill={PAISAJE.blanco} textAnchor="middle">
        {ruta}
      </SvgText>
      <SvgText x={x} y={y + 41} fontSize={15} fontWeight="bold" fill={PAISAJE.blanco} textAnchor="middle">
        {nombre}
      </SvgText>
      {flecha(x - 46)}
      {flecha(x + 46)}
    </G>
  );
}

/**
 * Ladera con la boca de un túnel en (x, yBoca), de la que sale la carretera de ancho `ancho`.
 * Ocupa todo el ancho `W` desde y = 0.
 */
export function Tunel({ x, yBoca, ancho, W }: { x: number; yBoca: number; ancho: number; W: number }) {
  const w = ancho + 20;
  const h = 50;
  const arco = (m: number) =>
    `M${x - w / 2 + m},${yBoca} V${yBoca - h + w / 2} A${w / 2 - m},${w / 2 - m} 0 0 1 ${x + w / 2 - m},${yBoca - h + w / 2} V${yBoca} Z`;
  const ladera = `M0,0 H${W} V${yBoca - 40} C${W * 0.86},${yBoca - 58} ${W * 0.72},${yBoca - 6} ${x + w / 2 + 26},${yBoca + 2} H${x - w / 2 - 26} C${W * 0.28},${yBoca - 6} ${W * 0.14},${yBoca - 64} 0,${yBoca - 34} Z`;
  const pinos: [number, number, number][] = [
    [0.06, -40, 0.8],
    [0.13, -52, 0.6],
    [0.24, -30, 0.7],
    [0.71, -36, 0.65],
    [0.84, -50, 0.85],
    [0.93, -40, 0.6],
  ];
  return (
    <G>
      <Path d={ladera} fill={PAISAJE.roca} />
      <Path
        d={`M${W * 0.05},${yBoca - 48} q${W * 0.08},-10 ${W * 0.16},-2 M${W * 0.7},${yBoca - 44} q${W * 0.1},-12 ${W * 0.2},-4`}
        stroke={PAISAJE.rocaClara}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
      {pinos.map(([px, py, s]) => (
        <Pino key={px} x={W * px} y={yBoca + py} s={s} />
      ))}
      <Path d={arco(0)} fill={PAISAJE.hormigon} />
      <Path d={arco(5)} fill={PAISAJE.interiorTunel} />
      {[0.2, 0.45, 0.7, 1].map((o, i) => (
        <Rect key={o} x={x - ancho / 2 + 4} y={yBoca - 16 + i * 4} width={ancho - 8} height={4} fill={PAISAJE.asfalto} opacity={o} />
      ))}
      <Circle cx={x - 9} cy={yBoca - h + 16} r={1.8} fill={PAISAJE.luz} opacity={0.85} />
      <Circle cx={x + 9} cy={yBoca - h + 16} r={1.8} fill={PAISAJE.luz} opacity={0.85} />
    </G>
  );
}

// ── Pueblo ────────────────────────────────────────────────────────────

/** Casa encalada con tejado a cuatro aguas; ancho `w` y alto de fachada `h`. */
export function CasaPueblo({ x, y, w, h, semilla }: { x: number; y: number; w: number; h: number; semilla: number }) {
  const tejado = PAISAJE.tejados[semilla % PAISAJE.tejados.length];
  const cubierta = Math.round(w * 0.32);
  const puertaX = semilla % 2 === 0 ? -w / 4 : w / 4 - 6;
  const ventanaX = semilla % 2 === 0 ? w / 4 - 3 : -w / 4 - 1;
  const luz = azar(semilla * 13) > 0.6;
  return (
    <G transform={`translate(${x} ${y})`}>
      <Rect x={-w / 2} y={-h} width={w} height={h} fill={PAISAJE.cal} />
      <Rect x={-w / 2} y={-3} width={w} height={3} fill={PAISAJE.zocalo} />
      <Polygon points={`${-w / 2 - 3},${-h} ${w / 2 + 3},${-h} ${w / 2 - 5},${-h - cubierta} ${-w / 2 + 5},${-h - cubierta}`} fill={tejado} />
      {semilla % 3 === 0 ? <Rect x={w / 2 - 11} y={-h - cubierta - 4} width={4} height={8} fill={tejado} /> : null}
      <Rect x={puertaX} y={-10} width={6} height={10} fill={PAISAJE.madera} />
      <Rect x={ventanaX} y={-h + 4} width={5} height={5} fill={luz ? PAISAJE.ventana : PAISAJE.ventanaApagada} opacity={luz ? 0.75 : 1} />
    </G>
  );
}

/** Iglesia de pueblo con campanario. */
export function Iglesia({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Rect x={-18} y={-24} width={30} height={24} fill={PAISAJE.cal} />
        <Polygon points="-20,-24 14,-24 9,-33 -15,-33" fill={PAISAJE.tejados[0]} />
        <Path d="M-7,0 V-9 A4,4 0 0 1 1,-9 V0 Z" fill={PAISAJE.madera} />
        <Rect x={12} y={-50} width={13} height={50} fill={PAISAJE.calSombra} />
        <Polygon points="11,-50 26,-50 18.5,-61" fill={PAISAJE.tejados[0]} />
        <Path d="M16.5,-44 V-38 h4 V-44 A2,2 0 0 0 16.5,-44 Z" fill={PAISAJE.oscuro} />
        <Line x1={18.5} y1={-61} x2={18.5} y2={-68} stroke={PAISAJE.calSombra} strokeWidth={1.5} />
        <Line x1={16} y1={-65.5} x2={21} y2={-65.5} stroke={PAISAJE.calSombra} strokeWidth={1.5} />
      </G>
    </En>
  );
}

/** Huerto: bancales con hileras de plantas. */
export function Huerto({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-22} y={-16} width={44} height={16} rx={2} fill={PAISAJE.tierra} />
      {[0, 1, 2].map((f) =>
        [0, 1, 2, 3, 4].map((c) => <Circle key={`${f}-${c}`} cx={-16 + c * 8} cy={-12 + f * 5} r={2.2} fill={PAISAJE.copa} />),
      )}
    </En>
  );
}

/** Banda de cuadros de meta atravesando una calzada vertical de ancho `w`. */
export function Meta({ x, y, w }: { x: number; y: number; w: number }) {
  const lado = w / 8;
  const cuadros: ReactNode[] = [];
  for (let f = 0; f < 2; f++) {
    for (let c = 0; c < 8; c++) {
      if ((f + c) % 2 === 0) {
        cuadros.push(<Rect key={`${f}-${c}`} x={x - w / 2 + c * lado} y={y - lado + f * lado} width={lado} height={lado} fill={PAISAJE.blanco} />);
      }
    }
  }
  return <G>{cuadros}</G>;
}

/** Paso de peatones en (x, y), girado `grados` para cruzar la calzada. */
export function PasoPeatones({ x, y, grados, ancho }: { x: number; y: number; grados: number; ancho: number }) {
  const n = 6;
  const paso = ancho / n;
  return (
    <G transform={`translate(${x} ${y}) rotate(${grados})`}>
      {Array.from({ length: n }, (_, k) => (
        <Rect key={k} x={-9} y={-ancho / 2 + k * paso + paso * 0.2} width={18} height={paso * 0.6} fill={PAISAJE.blanco} opacity={0.75} />
      ))}
    </G>
  );
}

// ── Biomas adicionales ────────────────────────────────────────────────

export function Palmera({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Path d="M0,0 C1,-16 -2,-32 3,-46" stroke={PAISAJE.tronco} strokeWidth={4} fill="none" strokeLinecap="round" />
        {[-150, -110, -60, -20, 25].map((a) => (
          <Path
            key={a}
            d="M0,0 q10,-6 20,2"
            transform={`translate(3 -46) rotate(${a})`}
            stroke={PAISAJE.copa}
            strokeWidth={3.5}
            strokeLinecap="round"
            fill="none"
          />
        ))}
      </G>
    </En>
  );
}

export function Sombrilla({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Rect x={-2} y={-4} width={20} height={6} rx={1.5} fill={PAISAJE.toalla} />
        <Line x1={0} y1={0} x2={2} y2={-24} stroke={PAISAJE.farola} strokeWidth={1.5} />
        <Path d="M-12,-20 Q2,-34 16,-22 Z" fill={PAISAJE.sombrilla} />
      </G>
    </En>
  );
}

export function Olivo({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Path d="M-1,0 C-3,-6 2,-10 0,-16" stroke={PAISAJE.tronco} strokeWidth={3} fill="none" />
      <Circle cx={-6} cy={-19} r={7} fill={PAISAJE.olivo} />
      <Circle cx={6} cy={-20} r={7} fill={PAISAJE.olivo} />
      <Circle cx={0} cy={-25} r={8} fill={PAISAJE.olivoClaro} />
    </En>
  );
}

export function Naranjo({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-1.5} y={-10} width={3} height={10} fill={PAISAJE.tronco} />
      <Circle cx={0} cy={-19} r={11} fill={PAISAJE.copa} />
      {[
        [-5, -22],
        [4, -16],
        [5, -25],
        [-3, -14],
      ].map(([cx, cy]) => (
        <Circle key={`${cx}${cy}`} cx={cx} cy={cy} r={1.8} fill={PAISAJE.naranja} />
      ))}
    </En>
  );
}

/** Hilera corta de vides sobre su espaldera. */
export function Vid({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Line x1={-14} y1={-6} x2={14} y2={-6} stroke={PAISAJE.valla} strokeWidth={1} />
      {[-11, -4, 3, 10].map((cx) => (
        <G key={cx}>
          <Line x1={cx} y1={0} x2={cx} y2={-6} stroke={PAISAJE.tronco} strokeWidth={1.5} />
          <Circle cx={cx} cy={-8} r={3.6} fill={PAISAJE.vid} />
          <Circle cx={cx + 1.5} cy={-5.5} r={1.4} fill={PAISAJE.uva} />
        </G>
      ))}
    </En>
  );
}

export function Bodega({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-18} y={-22} width={36} height={22} fill={PAISAJE.cal} />
      <Polygon points="-21,-22 21,-22 0,-34" fill={PAISAJE.tejados[1]} />
      <Path d="M-6,0 V-10 A6,6 0 0 1 6,-10 V0 Z" fill={PAISAJE.madera} />
      {[-30, -23].map((bx) => (
        <G key={bx}>
          <Ellipse cx={bx} cy={-5} rx={4} ry={5} fill={PAISAJE.madera} />
          <Line x1={bx - 4} y1={-5} x2={bx + 4} y2={-5} stroke={PAISAJE.zocalo} strokeWidth={1} />
        </G>
      ))}
    </En>
  );
}

export function Roca({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Polygon points="-14,0 -10,-10 -2,-16 8,-12 14,0" fill={PAISAJE.piedra} />
        <Polygon points="-2,-16 8,-12 4,-6 -4,-8" fill={PAISAJE.piedraClara} />
      </G>
    </En>
  );
}

/** Pico de montaña con la cima nevada, para los márgenes. */
export function Pico({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Polygon points="-46,0 -8,-70 10,-46 22,-58 50,0" fill={PAISAJE.monte} />
        <Polygon points="-8,-70 -18,-52 -10,-55 -4,-48 2,-56 10,-46" fill={PAISAJE.nieve} opacity={0.85} />
        <Polygon points="22,-58 16,-50 22,-52 28,-47" fill={PAISAJE.nieve} opacity={0.85} />
      </G>
    </En>
  );
}

export function Cabra({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        {[-8, -4, 5, 9].map((px) => (
          <Line key={px} x1={px} y1={-9} x2={px} y2={0} stroke={PAISAJE.cabra} strokeWidth={2} />
        ))}
        <Ellipse cx={0} cy={-12} rx={11} ry={5} fill={PAISAJE.cabra} />
        <Polygon points="8,-14 12,-15 15,-23 11,-24" fill={PAISAJE.cabra} />
        <Ellipse cx={15} cy={-24} rx={4} ry={2.6} fill={PAISAJE.cabra} />
        <Path d="M13,-26 q-4,-6 -8,-4" stroke={PAISAJE.cuerna} strokeWidth={1.6} fill="none" />
      </G>
    </En>
  );
}

export function PinoNevado({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-3} y={-10} width={6} height={10} fill={PAISAJE.tronco} />
      <Polygon points="-18,-10 18,-10 0,-36" fill={PAISAJE.pinoOscuro} />
      <Polygon points="-15,-24 15,-24 0,-48" fill={PAISAJE.pino} />
      <Polygon points="-11,-37 11,-37 0,-58" fill={PAISAJE.pino} />
      <Polygon points="-6,-48 6,-48 0,-58" fill={PAISAJE.nieve} />
      <Polygon points="-9,-30 0,-34 9,-30 0,-40" fill={PAISAJE.nieve} opacity={0.8} />
    </En>
  );
}

export function Cabana({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-14} y={-18} width={28} height={18} fill={PAISAJE.madera} />
      <Polygon points="-18,-17 18,-17 0,-33" fill={PAISAJE.monte} />
      <Polygon points="-18,-17 -12,-17 0,-28 12,-17 18,-17 0,-33" fill={PAISAJE.nieve} />
      <Rect x={-3} y={-10} width={6} height={10} fill={PAISAJE.oscuro} />
      <Rect x={6} y={-13} width={5} height={5} fill={PAISAJE.ventana} opacity={0.8} />
    </En>
  );
}

export function Cactus({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Rect x={-3.5} y={-34} width={7} height={34} rx={3.5} fill={PAISAJE.cactus} />
        <Path d="M-3,-16 h-6 v-10" stroke={PAISAJE.cactus} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <Path d="M3,-22 h6 v-8" stroke={PAISAJE.cactus} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </G>
    </En>
  );
}

export function Matojo({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Circle cx={0} cy={-5} r={5} fill="none" stroke={PAISAJE.paja} strokeWidth={1.2} />
      <Circle cx={0} cy={-5} r={2.5} fill="none" stroke={PAISAJE.pajaOscura} strokeWidth={1} />
    </En>
  );
}

export function Sauce({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-2} y={-18} width={4} height={18} fill={PAISAJE.tronco} />
      <Ellipse cx={0} cy={-26} rx={15} ry={10} fill={PAISAJE.copa} />
      {[-12, -6, 0, 6, 12].map((dx) => (
        <Path key={dx} d={`M${dx},-26 q${dx / 4},12 ${dx / 2},20`} stroke={PAISAJE.copaClara} strokeWidth={2} fill="none" />
      ))}
    </En>
  );
}

export function Junco({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      {[-4, -1, 2, 5].map((dx, i) => (
        <G key={dx}>
          <Line x1={dx} y1={0} x2={dx + (i % 2 ? 1 : -1)} y2={-14 - i * 2} stroke={PAISAJE.copa} strokeWidth={1.3} />
          {i % 2 === 0 ? <Rect x={dx - 1.6} y={-17 - i * 2} width={3} height={6} rx={1.5} fill={PAISAJE.tronco} /> : null}
        </G>
      ))}
    </En>
  );
}

/** Barraca valenciana: casa encalada con tejado de dos aguas muy inclinado. */
export function Barraca({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-13} y={-14} width={26} height={14} fill={PAISAJE.cal} />
      <Polygon points="-16,-14 16,-14 0,-38" fill={PAISAJE.paja} />
      <Line x1={-6} y1={-27} x2={6} y2={-27} stroke={PAISAJE.blanco} strokeWidth={1.2} opacity={0.6} />
      <Rect x={-3} y={-9} width={6} height={9} fill={PAISAJE.puertaAzul} />
    </En>
  );
}

/** Nave industrial con cubierta en diente de sierra; ancho `w` y alto `h`. */
export function Nave({ x, y, w, h, semilla }: { x: number; y: number; w: number; h: number; semilla: number }) {
  const dientes = Math.max(2, Math.round(w / 14));
  const paso = w / dientes;
  let techo = `M${-w / 2},${-h}`;
  for (let i = 0; i < dientes; i++) techo += ` L${-w / 2 + i * paso},${-h - 8} L${-w / 2 + (i + 1) * paso},${-h}`;
  return (
    <G transform={`translate(${x} ${y})`}>
      <Rect x={-w / 2} y={-h} width={w} height={h} fill={PAISAJE.edificios[(semilla % 2) + 1]} />
      <Path d={`${techo} Z`} fill={PAISAJE.bordillo} />
      <Rect x={-w / 2 + 4} y={-12} width={Math.min(16, w / 3)} height={12} fill={PAISAJE.oscuro} />
      <Rect x={-w / 2} y={-h + 4} width={w} height={2} fill={PAISAJE.azulSenal} opacity={0.35} />
    </G>
  );
}

export function Grua({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <G transform={`scale(${v} 1)`}>
        <Rect x={-2.5} y={-80} width={5} height={80} fill={PAISAJE.ambar} opacity={0.75} />
        <Rect x={-14} y={-82} width={56} height={4} fill={PAISAJE.ambar} opacity={0.75} />
        <Rect x={-14} y={-80} width={8} height={7} fill={PAISAJE.farola} />
        <Line x1={34} y1={-78} x2={34} y2={-56} stroke={PAISAJE.farola} strokeWidth={1} />
        <Rect x={31} y={-56} width={6} height={4} fill={PAISAJE.farola} />
      </G>
    </En>
  );
}

export function Contenedores({ x, y, s }: Pieza) {
  const colores = [PAISAJE.contenedor1, PAISAJE.contenedor2, PAISAJE.contenedor3];
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-22} y={-10} width={22} height={10} fill={colores[0]} />
      <Rect x={0} y={-10} width={22} height={10} fill={colores[1]} />
      <Rect x={-12} y={-20} width={22} height={10} fill={colores[2]} />
    </En>
  );
}

export function Chimenea({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-14} y={-20} width={28} height={20} fill={PAISAJE.edificios[2]} />
      <Polygon points="4,-20 12,-20 10,-70 6,-70" fill={PAISAJE.edificios[1]} />
      <Rect x={5.5} y={-62} width={5} height={3} fill={PAISAJE.rojo} opacity={0.7} />
      <Circle cx={10} cy={-78} r={6} fill={PAISAJE.humo} opacity={0.35} />
      <Circle cx={17} cy={-86} r={8} fill={PAISAJE.humo} opacity={0.25} />
    </En>
  );
}

export function Aerogenerador({ x, y, s, v = 1 }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Polygon points="-2.5,0 2.5,0 1.2,-84 -1.2,-84" fill={PAISAJE.molino} />
      <G transform={`translate(0 -86) rotate(${v > 0 ? 12 : 47})`}>
        {[0, 120, 240].map((a) => (
          <Polygon key={a} points="-1.5,0 1.5,0 0.6,-36 -0.6,-36" fill={PAISAJE.molino} transform={`rotate(${a})`} />
        ))}
        <Circle cx={0} cy={0} r={2.6} fill={PAISAJE.molino} />
      </G>
    </En>
  );
}

export function PlacaSolar({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Line x1={0} y1={0} x2={0} y2={-6} stroke={PAISAJE.farola} strokeWidth={1.5} />
      <Polygon points="-14,-6 14,-6 10,-15 -10,-15" fill={PAISAJE.placa} />
      <Line x1={-12} y1={-10.5} x2={12} y2={-10.5} stroke={PAISAJE.placaLinea} strokeWidth={0.8} />
      <Line x1={0} y1={-6} x2={0} y2={-15} stroke={PAISAJE.placaLinea} strokeWidth={0.8} />
    </En>
  );
}

/** Señal de fin de poblado (S-510): como la de entrada, con una banda roja diagonal. */
export function FinPoblado({ x, y, nombre }: { x: number; y: number; nombre: string }) {
  const w = Math.max(68, nombre.length * 7.4 + 16);
  return (
    <G>
      <EntradaPoblado x={x} y={y} nombre={nombre} />
      <Line x1={x - w / 2 + 4} y1={y - 31} x2={x + w / 2 - 4} y2={y - 55} stroke={PAISAJE.rojo} strokeWidth={3.5} />
    </G>
  );
}

/** Franja de mar en un lateral, con orilla de arena, barcas y un faro. */
export function Mar({ y0, y1, x, W }: { y0: number; y1: number; x: number; W: number }) {
  const ondas: string[] = [];
  for (let y = y0; y <= y1; y += 30) ondas.push(`${x + Math.sin(y / 40) * 6},${y}`);
  const orilla = `M${W},${y0} L${ondas.join(' L')} L${W},${y1} Z`;
  const arena = `M${W},${y0} L${ondas.map((p) => {
    const [px, py] = p.split(',').map(Number);
    return `${px - 12},${py}`;
  }).join(' L')} L${W},${y1} Z`;
  const barcas = [0.25, 0.62].map((f) => y0 + (y1 - y0) * f);
  return (
    <G>
      <Path d={arena} fill={PAISAJE.arena} />
      <Path d={orilla} fill={PAISAJE.agua} />
      {Array.from({ length: Math.floor((y1 - y0) / 46) }, (_, i) => (
        <Path
          key={i}
          d={`M${x + 18 + (i % 2) * 14},${y0 + 24 + i * 46} q4,-3 8,0 q4,-3 8,0`}
          stroke={PAISAJE.espuma}
          strokeWidth={1.2}
          fill="none"
          opacity={0.6}
        />
      ))}
      {barcas.map((by, i) => (
        <G key={by} transform={`translate(${x + 30 + i * 8} ${by})`}>
          <Path d="M-9,0 L9,0 L6,4 L-6,4 Z" fill={PAISAJE.cal} />
          <Line x1={0} y1={0} x2={0} y2={-14} stroke={PAISAJE.farola} strokeWidth={1} />
          <Polygon points="1,-13 1,-2 9,-2" fill={PAISAJE.blanco} opacity={0.8} />
        </G>
      ))}
      <G transform={`translate(${x + 26} ${y0 + (y1 - y0) * 0.45})`}>
        <Polygon points="-6,0 6,0 4,-36 -4,-36" fill={PAISAJE.blanco} opacity={0.9} />
        <Rect x={-5} y={-24} width={10} height={5} fill={PAISAJE.rojo} opacity={0.8} />
        <Rect x={-5} y={-42} width={10} height={6} fill={PAISAJE.oscuro} />
        <Circle cx={0} cy={-39} r={8} fill={PAISAJE.luz} opacity={0.18} />
        <Circle cx={0} cy={-39} r={2.4} fill={PAISAJE.luz} />
      </G>
    </G>
  );
}

/**
 * Río que cruza la pantalla en horizontal a la altura `y`, con un puente donde lo cruza
 * la carretera (en `xPuente`, con dirección `grados`) y algún pato.
 */
export function Rio({ y, W, xPuente, grados, anchoCalzada }: { y: number; W: number; xPuente: number; grados: number; anchoCalzada: number }) {
  const puntos: string[] = [];
  for (let x = 0; x <= W; x += 20) puntos.push(`${x},${y - 16 + Math.sin(x / 50) * 5}`);
  const abajo: string[] = [];
  for (let x = W; x >= 0; x -= 20) abajo.push(`${x},${y + 16 + Math.sin(x / 50 + 1) * 5}`);
  const patos = [0.12, 0.82].map((f) => f * W).filter((px) => Math.abs(px - xPuente) > 70);
  const largo = 46;
  return (
    <G>
      <Path d={`M${puntos.join(' L')} L${abajo.join(' L')} Z`} fill={PAISAJE.agua} />
      {[0.3, 0.55, 0.92].map((f) => (
        <Path key={f} d={`M${f * W},${y + 2} q5,-3 10,0 q5,-3 10,0`} stroke={PAISAJE.espuma} strokeWidth={1.1} fill="none" opacity={0.5} />
      ))}
      {patos.map((px) => (
        <G key={px} transform={`translate(${px} ${y + 4})`}>
          <Ellipse cx={0} cy={0} rx={6} ry={3.5} fill={PAISAJE.lana} opacity={0.9} />
          <Circle cx={5} cy={-3} r={2.4} fill={PAISAJE.pato} />
          <Polygon points="7,-3 10,-2.4 7,-1.8" fill={PAISAJE.ambar} />
        </G>
      ))}
      {/* Pretiles del puente */}
      <G transform={`translate(${xPuente} ${y}) rotate(${grados})`}>
        <Rect x={-largo / 2} y={-anchoCalzada / 2 - 6} width={largo} height={4} fill={PAISAJE.hormigon} />
        <Rect x={-largo / 2} y={anchoCalzada / 2 + 2} width={largo} height={4} fill={PAISAJE.hormigon} />
      </G>
    </G>
  );
}

// ── Composición ───────────────────────────────────────────────────────


export type TipoPieza =
  | 'pino'
  | 'arbol'
  | 'arbusto'
  | 'hierba'
  | 'oveja'
  | 'vaca'
  | 'ciervo'
  | 'conejo'
  | 'molino'
  | 'fardo'
  | 'casa'
  | 'edificio'
  | 'farola'
  | 'casaPueblo'
  | 'iglesia'
  | 'huerto'
  | 'palmera'
  | 'sombrilla'
  | 'olivo'
  | 'naranjo'
  | 'vid'
  | 'bodega'
  | 'roca'
  | 'pico'
  | 'cabra'
  | 'pinoNevado'
  | 'cabana'
  | 'cactus'
  | 'matojo'
  | 'sauce'
  | 'junco'
  | 'barraca'
  | 'nave'
  | 'grua'
  | 'contenedores'
  | 'chimenea'
  | 'aerogenerador'
  | 'placaSolar';

/** Altura y medio ancho aproximados de cada pieza a escala 1, para no invadir la calzada. */
const TAMANO: Record<TipoPieza, [alto: number, medio: number]> = {
  pino: [58, 18],
  arbol: [53, 21],
  arbusto: [18, 14],
  hierba: [9, 3],
  oveja: [24, 18],
  vaca: [37, 22],
  ciervo: [58, 18],
  conejo: [28, 10],
  molino: [72, 32],
  fardo: [22, 11],
  casa: [34, 17],
  edificio: [0, 0],
  farola: [46, 10],
  casaPueblo: [0, 0],
  iglesia: [68, 26],
  huerto: [16, 22],
  palmera: [64, 24],
  sombrilla: [30, 16],
  olivo: [33, 13],
  naranjo: [30, 11],
  vid: [12, 14],
  bodega: [34, 34],
  roca: [16, 14],
  pico: [70, 48],
  cabra: [27, 12],
  pinoNevado: [58, 18],
  cabana: [33, 18],
  cactus: [34, 10],
  matojo: [10, 5],
  sauce: [36, 16],
  junco: [20, 6],
  barraca: [38, 16],
  nave: [0, 0],
  grua: [84, 44],
  contenedores: [20, 22],
  chimenea: [92, 18],
  aerogenerador: [122, 38],
  placaSolar: [15, 14],
};

export type BiomaId =
  | 'prado'
  | 'bosque'
  | 'cultivo'
  | 'pueblo'
  | 'ciudad'
  | 'industrial'
  | 'costa'
  | 'olivar'
  | 'montana'
  | 'vinedo'
  | 'rio'
  | 'desierto'
  | 'nieve'
  | 'naranjal'
  | 'renovables';

interface Singular {
  tipo: TipoPieza;
  peso: number;
  /** Número de piezas del grupo (rebaño, fardos…). */
  grupo?: number;
  escala?: number;
  /** Se coloca pegado a los márgenes de la pantalla. */
  borde?: boolean;
  /** Número máximo en todo el bioma. */
  maximo?: number;
}

export interface Bioma {
  fondo: string;
  /** Calzada urbana, con aceras. */
  urbano?: boolean;
  /** Vegetación o cultivo principal, repartido con un campo de densidad (tipo, peso). */
  relleno: [TipoPieza, number][];
  /** Ajuste de la densidad del relleno: positivo, más lleno. */
  densidad: number;
  /** El relleno forma parcelas de hileras alineadas. */
  hileras?: boolean;
  /** Piezas bajas y dispersas. */
  matorral?: TipoPieza[];
  /** Pequeños detalles de suelo. */
  suelo?: boolean;
  /** Elementos singulares: pocos y separados. */
  singulares: Singular[];
  /** Separación mínima en vertical entre singulares (px). */
  separacion?: number;
  /** Construcciones que se apiñan junto a la carretera. */
  junto?: 'casaPueblo' | 'edificio' | 'nave';
  /** Distancia entre farolas a lo largo de la carretera. */
  farolas?: number;
  /** Elemento de fondo propio del bioma. */
  especial?: 'mar' | 'rio';
}

/** Biomas del camino. Los tonos son apagados para que destaquen los niveles. */
export const BIOMAS: Record<BiomaId, Bioma> = {
  prado: {
    fondo: '#0E1511',
    relleno: [['arbol', 3], ['pino', 1]],
    densidad: -0.05,
    matorral: ['arbusto'],
    suelo: true,
    singulares: [{ tipo: 'oveja', peso: 3, grupo: 3, escala: 0.8 }, { tipo: 'vaca', peso: 2, escala: 0.9 }],
  },
  bosque: {
    fondo: '#0C130F',
    relleno: [['pino', 3], ['arbol', 2]],
    densidad: 0.14,
    matorral: ['arbusto'],
    suelo: true,
    singulares: [{ tipo: 'ciervo', peso: 3, escala: 0.85 }, { tipo: 'conejo', peso: 2, escala: 0.9 }],
  },
  cultivo: {
    fondo: '#11140E',
    relleno: [['arbol', 2], ['pino', 1]],
    densidad: -0.14,
    matorral: ['arbusto'],
    suelo: true,
    singulares: [{ tipo: 'molino', peso: 2, escala: 0.95 }, { tipo: 'fardo', peso: 2, grupo: 3, escala: 0.75 }],
  },
  pueblo: {
    fondo: '#13120E',
    relleno: [['arbol', 1]],
    densidad: -0.3,
    matorral: ['arbusto'],
    suelo: true,
    singulares: [{ tipo: 'iglesia', peso: 6, maximo: 1 }, { tipo: 'huerto', peso: 2, escala: 0.9 }],
    separacion: 200,
    junto: 'casaPueblo',
    farolas: 250,
  },
  ciudad: { fondo: '#101216', urbano: true, relleno: [], densidad: -1, singulares: [], junto: 'edificio', farolas: 150 },
  industrial: {
    fondo: '#111214',
    relleno: [['arbol', 2], ['pino', 1]],
    densidad: -0.25,
    matorral: ['arbusto'],
    suelo: true,
    singulares: [{ tipo: 'grua', peso: 2 }, { tipo: 'chimenea', peso: 2, escala: 0.9 }, { tipo: 'contenedores', peso: 3 }],
    separacion: 150,
    junto: 'nave',
    farolas: 210,
  },
  costa: {
    fondo: '#13140F',
    relleno: [['palmera', 3], ['arbusto', 1]],
    densidad: -0.22,
    suelo: true,
    singulares: [{ tipo: 'sombrilla', peso: 3, grupo: 2 }],
    separacion: 220,
    especial: 'mar',
  },
  olivar: {
    fondo: '#15140E',
    relleno: [['olivo', 1]],
    densidad: 0.08,
    hileras: true,
    suelo: true,
    singulares: [{ tipo: 'casa', peso: 1, escala: 0.9 }],
    separacion: 420,
  },
  montana: {
    fondo: '#121418',
    relleno: [['pino', 2], ['roca', 2]],
    densidad: -0.05,
    matorral: ['roca'],
    singulares: [{ tipo: 'pico', peso: 3, borde: true, escala: 1.05 }, { tipo: 'cabra', peso: 1 }],
    separacion: 170,
  },
  vinedo: {
    fondo: '#16120E',
    relleno: [['vid', 1]],
    densidad: 0.12,
    hileras: true,
    suelo: true,
    singulares: [{ tipo: 'bodega', peso: 1 }],
    separacion: 420,
  },
  rio: {
    fondo: '#0D1412',
    relleno: [['sauce', 2], ['arbol', 2]],
    densidad: -0.08,
    matorral: ['junco', 'arbusto'],
    suelo: true,
    singulares: [{ tipo: 'conejo', peso: 1, escala: 0.9 }],
    especial: 'rio',
  },
  desierto: {
    fondo: '#19150F',
    relleno: [['cactus', 3], ['roca', 1]],
    densidad: -0.12,
    matorral: ['matojo', 'roca'],
    singulares: [{ tipo: 'roca', peso: 2, escala: 1.6 }, { tipo: 'casa', peso: 1, escala: 0.85 }],
    separacion: 260,
  },
  nieve: {
    fondo: '#1A1E23',
    relleno: [['pinoNevado', 1]],
    densidad: 0.05,
    matorral: ['roca'],
    singulares: [{ tipo: 'cabana', peso: 2 }, { tipo: 'ciervo', peso: 1, escala: 0.8 }],
    separacion: 300,
  },
  naranjal: {
    fondo: '#0F150F',
    relleno: [['naranjo', 1]],
    densidad: 0.08,
    hileras: true,
    suelo: true,
    singulares: [{ tipo: 'barraca', peso: 1 }],
    separacion: 380,
  },
  renovables: {
    fondo: '#0F1412',
    relleno: [['placaSolar', 1]],
    densidad: -0.05,
    hileras: true,
    suelo: true,
    singulares: [{ tipo: 'aerogenerador', peso: 1, escala: 0.85 }],
    separacion: 150,
  },
};

export interface PiezaColocada {
  tipo: TipoPieza;
  x: number;
  y: number;
  s: number;
  v: 1 | -1;
  w?: number;
  h?: number;
  semilla: number;
}

interface Punto {
  x: number;
  y: number;
}

export interface Zona {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface ZonaBioma {
  y0: number;
  y1: number;
  bioma: BiomaId;
}

export interface EntradaComposicion {
  ancho: number;
  alto: number;
  /** Puntos de paso de la carretera (tangente vertical en cada uno), ordenados de arriba abajo. */
  puntos: Punto[];
  /** Medio ancho ocupado por la calzada (con arcén o acera) fuera y dentro de la ciudad. */
  medio: { campo: number; ciudad: number };
  /** Zonas que no se pueden decorar (niveles, carteles, agua…). */
  reservas: Zona[];
  /** Bioma de cada franja de altura, de arriba abajo y sin huecos. */
  zonas: ZonaBioma[];
}

function bezier(a: Punto, b: Punto, t: number): Punto {
  const m = (a.y + b.y) / 2;
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * m + 3 * u * t * t * m + t * t * t * b.y,
  };
}

/** Elige un elemento según su peso, con `r` en [0, 1). */
function porPeso<T>(opciones: [T, number][], r: number): T {
  const total = opciones.reduce((s, [, p]) => s + p, 0);
  let acc = 0;
  for (const [o, p] of opciones) {
    acc += p / total;
    if (r < acc) return o;
  }
  return opciones[opciones.length - 1][0];
}

/**
 * Reparte el paisaje alrededor de la carretera de forma estable (misma salida para el mismo ancho).
 * Cada franja tiene su bioma. La vegetación se reparte con un campo de densidad (bosquecillos,
 * parcelas de cultivo en hileras), los elementos singulares son escasos y separados, y las
 * construcciones se apiñan junto a la carretera. Cerca del límite entre franjas se mezclan los dos
 * biomas para que el cambio sea gradual.
 */
export function componerPaisaje(e: EntradaComposicion): PiezaColocada[] {
  const { ancho: W, puntos, medio, reservas, zonas } = e;
  const entre = (v: number) => Math.min(1, Math.max(0, v));

  // Muestras de la carretera, ordenadas por y, para medir distancias con búsqueda binaria.
  const muestras: Punto[] = [];
  for (let i = 0; i < puntos.length - 1; i++) {
    for (let k = 0; k < 18; k++) muestras.push(bezier(puntos[i], puntos[i + 1], k / 18));
  }
  muestras.push(puntos[puntos.length - 1]);
  const distancia = (x: number, y: number) => {
    let lo = 0;
    let hi = muestras.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (muestras[mid].y < y) lo = mid + 1;
      else hi = mid;
    }
    let d = Infinity;
    for (let i = lo; i < muestras.length && muestras[i].y - y < d; i++) d = Math.min(d, Math.hypot(muestras[i].x - x, muestras[i].y - y));
    for (let i = lo - 1; i >= 0 && y - muestras[i].y < d; i--) d = Math.min(d, Math.hypot(muestras[i].x - x, muestras[i].y - y));
    return d;
  };
  const reservado = (x: number, y: number, r = 0) =>
    reservas.some((q) => x > q.x0 - r && x < q.x1 + r && y > q.y0 - r && y < q.y1 + r);

  const zonaEn = (y: number) => zonas.find((z) => y >= z.y0 && y < z.y1) ?? zonas[zonas.length - 1];
  const urbano = (y: number) => !!BIOMAS[zonaEn(y).bioma].urbano;
  const medioEn = (y: number) => (urbano(y) ? medio.ciudad : medio.campo);
  // Cerca del límite entre franjas se mezclan los dos biomas.
  const MEZCLA = 170;
  const biomaEn = (y: number, r: number): BiomaId => {
    const i = zonas.findIndex((z) => y >= z.y0 && y < z.y1);
    if (i < 0) return zonas[zonas.length - 1].bioma;
    const z = zonas[i];
    if (i > 0 && y - z.y0 < MEZCLA && r < 0.5 * (1 - (y - z.y0) / MEZCLA)) return zonas[i - 1].bioma;
    if (i < zonas.length - 1 && z.y1 - y < MEZCLA && r < 0.5 * (1 - (z.y1 - y) / MEZCLA)) return zonas[i + 1].bioma;
    return z.bioma;
  };
  /** Comprueba que una pieza de `alto` × 2·`medioAncho` cabe sin tocar la calzada ni las reservas. */
  const cabe = (x: number, y: number, alto: number, medioAncho: number, holgura = 6) => {
    const m = medioEn(y);
    return [
      [x - medioAncho, y],
      [x + medioAncho, y],
      [x - medioAncho, y - alto],
      [x + medioAncho, y - alto],
      [x, y - alto / 2],
    ].every(([px, py]) => distancia(px, py) > m + holgura && !reservado(px, py, 2) && py > 0);
  };

  const piezas: PiezaColocada[] = [];
  const ocupados: { x: number; y: number; r: number }[] = [];
  const libre = (x: number, y: number, r: number) => ocupados.every((o) => Math.hypot(o.x - x, o.y - y) > o.r + r);
  const poner = (p: PiezaColocada, r: number) => {
    piezas.push(p);
    ocupados.push({ x: p.x, y: p.y, r });
  };
  let semilla = 1;

  // 1. Construcciones junto a la carretera (casas, edificios, naves).
  const construcciones: PiezaColocada[] = [];
  const solapa = (x: number, y: number, w: number) =>
    construcciones.some((b) => Math.abs(b.x - x) < ((b.w ?? 0) + w) / 2 + 3 && Math.abs(b.y - y) < 26);
  for (let y = 40; y < e.alto - 10; y += 28) {
    for (let x = 12; x < W; x += 28) {
      semilla++;
      const jx = x + (azar(semilla * 2.1) - 0.5) * 10;
      const jy = y + (azar(semilla * 3.3) - 0.5) * 10;
      const b = BIOMAS[biomaEn(jy, azar(semilla * 0.37))];
      if (!b.junto) continue;
      const m = medioEn(jy);
      const d = distancia(jx, jy);
      if (d < m + 8) continue;
      const r = azar(semilla * 7.7);
      const cerca = b.junto === 'nave' ? (d < m + 90 ? 0.32 : 0.06) : d < m + 70 ? 1 : d < m + 130 ? 0.4 : 0.1;
      if (r > (b.junto === 'edificio' ? 0.5 : 0.55) * cerca) continue;
      const z = zonaEn(jy);
      let w: number;
      let h: number;
      let alto: number;
      if (b.junto === 'casaPueblo') {
        w = 20 + Math.round(azar(semilla * 4.9) * 14);
        h = 12 + Math.round(azar(semilla * 5.7) * 8);
        alto = h + w * 0.32 + 6;
      } else if (b.junto === 'nave') {
        w = 40 + Math.round(azar(semilla * 4.9) * 24);
        h = 16 + Math.round(azar(semilla * 5.7) * 12);
        alto = h + 9;
      } else {
        // Los edificios empiezan bajos y ganan altura hacia el centro de la ciudad.
        const centro = entre((jy - z.y0 - 60) / 260) * entre((z.y1 - jy - 60) / 260);
        w = 22 + Math.round(azar(semilla * 2.9) * 14);
        h = 30 + Math.round(azar(semilla * 4.3) * (14 + 46 * centro));
        while (h >= 30 && !cabe(jx, jy, h, w / 2, 12)) h -= 12;
        if (h < 30) continue;
        alto = h;
      }
      if (!cabe(jx, jy, alto, w / 2, b.junto === 'edificio' ? 12 : 6) || solapa(jx, jy, w)) continue;
      const tipo: TipoPieza = b.junto;
      const p: PiezaColocada = { tipo, x: jx, y: jy, s: 1, v: 1, w, h, semilla };
      construcciones.push(p);
      piezas.push(p);
    }
  }

  // 2. Elementos singulares: pocos y separados.
  const cuenta: Partial<Record<TipoPieza, number>> = {};
  let ultimo = -Infinity;
  for (let y = 150; y < e.alto - 40; y += 40) {
    for (let intento = 0; intento < 4; intento++) {
      semilla++;
      const bioma = biomaEn(y, azar(semilla * 0.53));
      const b = BIOMAS[bioma];
      if (!b.singulares.length || y - ultimo < (b.separacion ?? 300)) break;
      const opciones = b.singulares.filter((s) => s.maximo === undefined || (cuenta[s.tipo] ?? 0) < s.maximo);
      if (!opciones.length) break;
      const s = porPeso(opciones.map((o) => [o, o.peso] as [Singular, number]), azar(semilla * 5.3));
      const esc = s.escala ?? 1;
      const [alto, medioAncho] = TAMANO[s.tipo];
      const r = azar(semilla * 1.7);
      const x = s.borde ? (r < 0.5 ? 8 + r * 40 : W - 8 - (r - 0.5) * 40) : 30 + r * (W - 60);
      const v = (azar(semilla * 3.1) > 0.5 ? 1 : -1) as 1 | -1;
      const n = s.grupo ?? 1;
      const ancho = medioAncho * esc + (n - 1) * 12;
      if (!cabe(x, y, alto * esc, ancho, 24) || !libre(x, y, ancho + 10)) continue;
      for (let k = 0; k < n; k++) {
        const ox = x + (k - (n - 1) / 2) * 24 + (azar(semilla + k * 9) - 0.5) * 8;
        const oy = y + (azar(semilla + k * 13) - 0.5) * 16;
        poner({ tipo: s.tipo, x: ox, y: oy, s: esc * (0.92 + azar(semilla + k) * 0.16), v, semilla: semilla + k }, medioAncho * esc + 6);
      }
      cuenta[s.tipo] = (cuenta[s.tipo] ?? 0) + 1;
      ultimo = y;
      break;
    }
  }

  // 3. Vegetación y cultivos con un campo de densidad: bosquecillos, parcelas en hileras y bordes más poblados.
  const fase1 = azar(7) * 6.28;
  const fase2 = azar(11) * 6.28;
  for (let y = 10; y < e.alto; y += 24) {
    for (let x = 6; x < W; x += 24) {
      semilla++;
      const bioma = biomaEn(y, azar(semilla * 9.7));
      const b = BIOMAS[bioma];
      const fila = Math.round(y / 24);
      const jx = b.hileras ? x + (fila % 2) * 12 : x + (azar(semilla * 2.3) - 0.5) * 18;
      const jy = b.hileras ? y : y + (azar(semilla * 4.1) - 0.5) * 18;
      const borde = Math.max(0, 1 - Math.min(jx, W - jx) / 70) * (b.hileras ? 0.1 : 0.35);
      const densidad = 0.5 + 0.5 * Math.sin(jx * 0.021 + fase1) * Math.cos(jy * 0.013 + fase2) + borde + b.densidad;
      const d = distancia(jx, jy);
      if (d < medioEn(jy) + 14 || reservado(jx, jy, 8)) continue;
      const r = azar(semilla * 6.7);
      if (b.relleno.length && densidad > (b.hileras ? 0.6 : 0.78) && (b.hileras || r < 0.75)) {
        const tipo = porPeso(b.relleno, azar(semilla * 3.9));
        const esc = b.hileras ? 0.9 + azar(semilla * 8.9) * 0.12 : 0.6 + azar(semilla * 8.9) * 0.45;
        const [alto, medioAncho] = TAMANO[tipo];
        if (!cabe(jx, jy, alto * esc, medioAncho * esc * 0.6, 6) || !libre(jx, jy, medioAncho * esc * 0.55)) continue;
        poner({ tipo, x: jx, y: jy, s: esc, v: azar(semilla) > 0.5 ? 1 : -1, semilla }, medioAncho * esc * 0.55);
      } else if (b.matorral && densidad > 0.6 && r < 0.16 && libre(jx, jy, 10)) {
        const tipo = b.matorral[Math.floor(azar(semilla * 2.7) * b.matorral.length)];
        const esc = 0.6 + r * 2;
        if (cabe(jx, jy, TAMANO[tipo][0] * esc, TAMANO[tipo][1] * esc, 4)) poner({ tipo, x: jx, y: jy, s: esc, v: 1, semilla }, 10);
      } else if (b.suelo && r > 0.9) {
        piezas.push({ tipo: 'hierba', x: jx, y: jy, s: 1, v: 1, semilla });
      }
    }
  }

  // 4. Farolas a intervalos regulares, alternando lados, donde el bioma las tiene.
  let recorrido = 0;
  let lado = 1;
  for (let i = 1; i < muestras.length; i++) {
    const a = muestras[i - 1];
    const b = muestras[i];
    recorrido += Math.hypot(b.x - a.x, b.y - a.y);
    const intervalo = BIOMAS[zonaEn(b.y).bioma].farolas;
    if (!intervalo || recorrido < intervalo) continue;
    recorrido = 0;
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / len;
    const ny = (b.x - a.x) / len;
    const separacion = urbano(b.y) ? medio.ciudad - 8 : medio.campo + 6;
    const px = b.x + nx * lado * separacion;
    const py = b.y + ny * lado * separacion;
    if (!reservado(px, py, 10) && py < e.alto - 20) {
      piezas.push({ tipo: 'farola', x: px, y: py, s: 0.85, v: (nx * lado > 0 ? -1 : 1) as 1 | -1, semilla: i });
    }
    lado = -lado;
  }

  return piezas.sort((p, q) => p.y - q.y);
}

/** Dibuja una pieza colocada por `componerPaisaje`. */
export function PiezaPaisaje({ p }: { p: PiezaColocada }) {
  const comun = { x: p.x, y: p.y, s: p.s, v: p.v };
  switch (p.tipo) {
    case 'pino':
      return <Pino {...comun} />;
    case 'arbol':
      return <Arbol {...comun} />;
    case 'arbusto':
      return <Arbusto {...comun} />;
    case 'hierba':
      return <Hierba {...comun} />;
    case 'oveja':
      return <Oveja {...comun} />;
    case 'vaca':
      return <Vaca {...comun} />;
    case 'ciervo':
      return <Ciervo {...comun} />;
    case 'conejo':
      return <Conejo {...comun} />;
    case 'molino':
      return <Molino {...comun} />;
    case 'fardo':
      return <Fardo {...comun} />;
    case 'casa':
      return <Casa {...comun} />;
    case 'edificio':
      return <Edificio x={p.x} y={p.y} w={p.w ?? 30} h={p.h ?? 60} semilla={p.semilla} />;
    case 'farola':
      return <Farola {...comun} />;
    case 'casaPueblo':
      return <CasaPueblo x={p.x} y={p.y} w={p.w ?? 26} h={p.h ?? 16} semilla={p.semilla} />;
    case 'iglesia':
      return <Iglesia {...comun} />;
    case 'huerto':
      return <Huerto {...comun} />;
    case 'palmera':
      return <Palmera {...comun} />;
    case 'sombrilla':
      return <Sombrilla {...comun} />;
    case 'olivo':
      return <Olivo {...comun} />;
    case 'naranjo':
      return <Naranjo {...comun} />;
    case 'vid':
      return <Vid {...comun} />;
    case 'bodega':
      return <Bodega {...comun} />;
    case 'roca':
      return <Roca {...comun} />;
    case 'pico':
      return <Pico {...comun} />;
    case 'cabra':
      return <Cabra {...comun} />;
    case 'pinoNevado':
      return <PinoNevado {...comun} />;
    case 'cabana':
      return <Cabana {...comun} />;
    case 'cactus':
      return <Cactus {...comun} />;
    case 'matojo':
      return <Matojo {...comun} />;
    case 'sauce':
      return <Sauce {...comun} />;
    case 'junco':
      return <Junco {...comun} />;
    case 'barraca':
      return <Barraca {...comun} />;
    case 'nave':
      return <Nave x={p.x} y={p.y} w={p.w ?? 50} h={p.h ?? 20} semilla={p.semilla} />;
    case 'grua':
      return <Grua {...comun} />;
    case 'contenedores':
      return <Contenedores {...comun} />;
    case 'chimenea':
      return <Chimenea {...comun} />;
    case 'aerogenerador':
      return <Aerogenerador {...comun} />;
    case 'placaSolar':
      return <PlacaSolar {...comun} />;
  }
}
