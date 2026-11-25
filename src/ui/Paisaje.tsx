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

export function Semaforo({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Line x1={0} y1={0} x2={0} y2={-30} stroke={PAISAJE.farola} strokeWidth={2.5} />
      <Rect x={-5} y={-50} width={10} height={24} rx={3} fill={PAISAJE.oscuro} />
      <Circle cx={0} cy={-45} r={2.6} fill={PAISAJE.rojo} />
      <Circle cx={0} cy={-38} r={2.6} fill={PAISAJE.ventanaApagada} />
      <Circle cx={0} cy={-31} r={2.6} fill={PAISAJE.verde} />
    </En>
  );
}

export function ArbolCiudad({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Rect x={-7} y={-6} width={14} height={6} fill={PAISAJE.bordillo} />
      <Rect x={-1.5} y={-20} width={3} height={14} fill={PAISAJE.tronco} />
      <Circle cx={0} cy={-26} r={10} fill={PAISAJE.copa} />
    </En>
  );
}

/** Señal de entrada a poblado (S-500: fondo blanco, texto negro), sobre un poste. */
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
  | 'semaforo'
  | 'arbolCiudad'
  | 'casaPueblo'
  | 'iglesia'
  | 'huerto';

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

interface Zona {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export interface EntradaComposicion {
  ancho: number;
  alto: number;
  /** y a partir de la cual empieza el pueblo, entre el campo y la ciudad. */
  yPueblo: number;
  /** y a partir de la cual empieza la ciudad. */
  yCiudad: number;
  /** Puntos de paso de la carretera (tangente vertical en cada uno). */
  puntos: Punto[];
  /** Medio ancho ocupado por la calzada (con arcén o acera) en campo y en ciudad. */
  medio: { campo: number; ciudad: number };
  /** Zonas que no se pueden decorar (carteles, etc.). */
  reservas: Zona[];
  /** Carácter de cada tramo de campo por altura: [yInicio, yFin, carácter]. */
  tramos: { y0: number; y1: number; caracter: 'prado' | 'bosque' | 'cultivo' }[];
}

function bezier(a: Punto, b: Punto, t: number): Punto {
  const m = (a.y + b.y) / 2;
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x,
    y: u * u * u * a.y + 3 * u * u * t * m + 3 * u * t * t * m + t * t * t * b.y,
  };
}

/**
 * Reparte el paisaje alrededor de la carretera de forma estable (misma salida para el mismo ancho).
 * El campo se compone con un campo de densidad: los árboles forman bosquecillos y enmarcan los bordes,
 * y en los claros aparecen pocos animales, separados entre sí. Le sigue un pueblo de casas encaladas
 * y después la ciudad, cuyos edificios siguen la calle. Los cambios de zona y de tramo son graduales.
 */
export function componerPaisaje(e: EntradaComposicion): PiezaColocada[] {
  const { ancho: W, yPueblo, yCiudad, puntos, medio, reservas } = e;
  const entre = (v: number) => Math.min(1, Math.max(0, v));

  // Muestras de la carretera para medir distancias.
  const muestras: Punto[] = [];
  for (let i = 0; i < puntos.length - 1; i++) {
    for (let k = 0; k < 18; k++) muestras.push(bezier(puntos[i], puntos[i + 1], k / 18));
  }
  muestras.push(puntos[puntos.length - 1]);
  const distancia = (x: number, y: number) => {
    let d = Infinity;
    for (const m of muestras) {
      if (Math.abs(m.y - y) > d) continue;
      const dd = Math.hypot(m.x - x, m.y - y);
      if (dd < d) d = dd;
    }
    return d;
  };
  const reservado = (x: number, y: number, r = 0) =>
    reservas.some((q) => x > q.x0 - r && x < q.x1 + r && y > q.y0 - r && y < q.y1 + r);

  const piezas: PiezaColocada[] = [];
  const ocupados: { x: number; y: number; r: number }[] = [];
  const libre = (x: number, y: number, r: number) => ocupados.every((o) => Math.hypot(o.x - x, o.y - y) > o.r + r);
  const poner = (p: PiezaColocada, r: number) => {
    piezas.push(p);
    ocupados.push({ x: p.x, y: p.y, r });
  };
  // Cerca del límite entre tramos se mezclan los dos caracteres, para que el cambio sea gradual.
  const MEZCLA = 160;
  const caracterEn = (y: number, r: number) => {
    const i = e.tramos.findIndex((t) => y >= t.y0 && y < t.y1);
    if (i < 0) return 'prado';
    const t = e.tramos[i];
    if (i > 0 && y - t.y0 < MEZCLA && r < 0.5 * (1 - (y - t.y0) / MEZCLA)) return e.tramos[i - 1].caracter;
    if (i < e.tramos.length - 1 && t.y1 - y < MEZCLA && r < 0.5 * (1 - (t.y1 - y) / MEZCLA)) return e.tramos[i + 1].caracter;
    return t.caracter;
  };

  // 1. Animales y elementos singulares, pocos y separados: primero, para que los árboles los respeten.
  let semilla = 1;
  let ultimoAnimal = -Infinity;
  for (let y = 120; y < yPueblo + 160; y += 46) {
    for (let intento = 0; intento < 3; intento++) {
      semilla++;
      if (y - ultimoAnimal < 300) break;
      const x = 30 + azar(semilla * 1.7) * (W - 60);
      const d = distancia(x, y);
      if (d < medio.campo + 46 || reservado(x, y, 30) || reservado(x, y - 50, 20) || !libre(x, y, 60)) continue;
      if (distancia(x, y - 50) < medio.campo + 30) continue;
      if (y > yPueblo && d < medio.campo + 110) continue;
      const c = y > yPueblo ? 'prado' : caracterEn(y, azar(semilla * 0.7));
      const v = (azar(semilla * 3.1) > 0.5 ? 1 : -1) as 1 | -1;
      const r = azar(semilla * 5.3);
      if (c === 'prado') {
        if (r < 0.6) {
          // Rebaño pequeño: 2 o 3 ovejas, no alineadas.
          const n = r < 0.3 ? 3 : 2;
          for (let k = 0; k < n; k++) {
            const ox = x + (k - (n - 1) / 2) * 24 + (azar(semilla + k * 9) - 0.5) * 10;
            const oy = y + (azar(semilla + k * 13) - 0.5) * 18;
            if (distancia(ox, oy) > medio.campo + 30) poner({ tipo: 'oveja', x: ox, y: oy, s: 0.75 + azar(semilla + k) * 0.15, v, semilla }, 22);
          }
        } else {
          poner({ tipo: 'vaca', x, y, s: 0.9, v, semilla }, 30);
        }
      } else if (c === 'bosque') {
        poner({ tipo: r < 0.55 ? 'ciervo' : 'conejo', x, y, s: r < 0.55 ? 0.85 : 0.9, v, semilla }, 30);
      } else if (r < 0.45) {
        poner({ tipo: 'molino', x, y, s: 0.95, v, semilla }, 40);
      } else {
        const n = r < 0.8 ? 2 : 3;
        for (let k = 0; k < n; k++) poner({ tipo: 'fardo', x: x + k * 26 * v, y: y + k * 6, s: 0.75, v, semilla }, 16);
      }
      ultimoAnimal = y;
      break;
    }
  }

  // 2. Vegetación del campo con un campo de densidad: bosquecillos y bordes más poblados.
  const fase1 = azar(7) * 6.28;
  const fase2 = azar(11) * 6.28;
  for (let y = 10; y < yCiudad; y += 24) {
    for (let x = 6; x < W; x += 24) {
      semilla++;
      const jx = x + (azar(semilla * 2.3) - 0.5) * 18;
      const jy = y + (azar(semilla * 4.1) - 0.5) * 18;
      const c = caracterEn(jy, azar(semilla * 9.7));
      const borde = Math.max(0, 1 - Math.min(jx, W - jx) / 70) * 0.35;
      const base = c === 'bosque' ? 0.12 : c === 'cultivo' ? -0.12 : -0.05;
      // En el pueblo hay menos árboles, y desaparecen al llegar a la ciudad.
      const rural = entre((jy - yPueblo + 80) / 240);
      const densidad =
        0.5 + 0.5 * Math.sin(jx * 0.021 + fase1) * Math.cos(jy * 0.013 + fase2) + borde + base - 0.3 * rural - 0.6 * entre((jy - yCiudad + 60) / 120);
      const d = distancia(jx, jy);
      if (d < medio.campo + 14 || reservado(jx, jy, 8) || reservado(jx, jy - 40, 4)) continue;
      const r = azar(semilla * 6.7);
      if (densidad > 0.78 && r < 0.75) {
        const tipo: TipoPieza = c === 'bosque' ? (r < 0.6 ? 'pino' : 'arbol') : r < 0.3 ? 'pino' : 'arbol';
        const s = 0.6 + azar(semilla * 8.9) * 0.45;
        // La copa crece hacia arriba: comprueba también su parte alta.
        if (distancia(jx, jy - 50 * s) < medio.campo + 8 || !libre(jx, jy, 12 * s)) continue;
        poner({ tipo, x: jx, y: jy, s, v: 1, semilla }, 12 * s);
      } else if (densidad > 0.62 && r < 0.18 && libre(jx, jy, 10)) {
        poner({ tipo: 'arbusto', x: jx, y: jy, s: 0.6 + r * 1.5, v: 1, semilla }, 10);
      } else if (jy > yPueblo - 280 && jy < yPueblo && r > 0.975 && d > medio.campo + 40 && libre(jx, jy, 30)) {
        // Afueras: algún cortijo suelto antes del pueblo.
        poner({ tipo: 'casa', x: jx, y: jy, s: 0.9, v: 1, semilla }, 30);
      } else if (r > 0.9) {
        piezas.push({ tipo: 'hierba', x: jx, y: jy, s: 1, v: 1, semilla });
      }
    }
  }

  // 3. Pueblo: casas encaladas junto a la carretera, más densas en el centro del pueblo,
  // que continúan un poco dentro de la ciudad para que el cambio no sea brusco.
  const casas: PiezaColocada[] = [];
  const solapa = (x: number, y: number, w: number) =>
    casas.some((b) => Math.abs(b.x - x) < ((b.w ?? 0) + w) / 2 + 3 && Math.abs(b.y - y) < 26);
  let iglesia = false;
  for (let y = yPueblo - 40; y < yCiudad + 170; y += 28) {
    for (let x = 12; x < W; x += 28) {
      semilla++;
      const jx = x + (azar(semilla * 2.1) - 0.5) * 10;
      const jy = y + (azar(semilla * 3.3) - 0.5) * 10;
      const ciudad = jy >= yCiudad;
      const m = ciudad ? medio.ciudad : medio.campo;
      const d = distancia(jx, jy);
      if (d < m + 8 || reservado(jx, jy, 6)) continue;
      const r = azar(semilla * 7.7);
      const intensidad = entre((jy - yPueblo + 40) / 200) * (1 - entre((jy - yCiudad) / 170));
      if (!iglesia && !ciudad && jy > yPueblo + 200 && d > m + 30 && d < m + 100 && r < 0.3) {
        const cabe = [
          [jx - 26, jy],
          [jx + 26, jy],
          [jx + 18, jy - 68],
          [jx - 18, jy - 68],
          [jx, jy - 34],
        ].every(([px, py]) => distancia(px, py) > m + 8 && !reservado(px, py, 4));
        if (cabe && !solapa(jx, jy, 50) && libre(jx, jy, 30)) {
          const ig: PiezaColocada = { tipo: 'iglesia', x: jx, y: jy, s: 1, v: jx < W / 2 ? 1 : -1, w: 50, semilla };
          casas.push(ig);
          poner(ig, 30);
          iglesia = true;
          continue;
        }
      }
      const cerca = d < m + 70 ? 1 : d < m + 130 ? 0.4 : 0.1;
      if (r > 0.55 * intensidad * cerca) {
        if (!ciudad && jy > yPueblo + 40 && d > m + 110 && r > 0.985 && libre(jx, jy, 26)) {
          poner({ tipo: 'huerto', x: jx, y: jy, s: 0.9, v: 1, semilla }, 26);
        }
        continue;
      }
      const w = 20 + Math.round(azar(semilla * 4.9) * 14);
      const h = 12 + Math.round(azar(semilla * 5.7) * 8);
      const alto = h + w * 0.32 + 6;
      const cabe = [
        [jx - w / 2, jy],
        [jx + w / 2, jy],
        [jx - w / 2, jy - alto],
        [jx + w / 2, jy - alto],
      ].every(([px, py]) => distancia(px, py) > m + 6 && !reservado(px, py, 3));
      if (!cabe || solapa(jx, jy, w) || !libre(jx, jy, w / 2)) continue;
      const c: PiezaColocada = { tipo: 'casaPueblo', x: jx, y: jy, s: 1, v: 1, w, h, semilla };
      casas.push(c);
      piezas.push(c);
    }
  }

  // 4. Ciudad: edificios que siguen la calle, sin invadir la acera. Empiezan bajos y
  // ganan altura hacia el centro.
  const edificios: PiezaColocada[] = [];
  for (let y = yCiudad + 50; y < e.alto - 10; y += 34) {
    for (let x = 14; x < W; x += 30) {
      semilla++;
      const jx = x + (azar(semilla * 1.9) - 0.5) * 8;
      const jy = y + (azar(semilla * 3.7) - 0.5) * 10;
      const centroCiudad = entre((jy - yCiudad - 60) / 260);
      if (azar(semilla * 5.9) < 0.5 + 0.3 * (1 - centroCiudad) || reservado(jx, jy, 6)) continue;
      const w = 22 + Math.round(azar(semilla * 2.9) * 14);
      let h = 30 + Math.round(azar(semilla * 4.3) * (14 + 46 * centroCiudad));
      const cabe = (hh: number) =>
        [
          [jx - w / 2, jy],
          [jx + w / 2, jy],
          [jx - w / 2, jy - hh],
          [jx + w / 2, jy - hh],
          [jx, jy - hh / 2],
        ].every(([px, py]) => distancia(px, py) > medio.ciudad + 12 && py > yCiudad + 10 && !reservado(px, py, 4));
      while (h >= 30 && !cabe(h)) h -= 12;
      if (h < 30) continue;
      if (edificios.some((b) => Math.abs(b.x - jx) < ((b.w ?? 0) + w) / 2 - 2 && Math.abs(b.y - jy) < 30)) continue;
      if (solapa(jx, jy, w)) continue;
      const b: PiezaColocada = { tipo: 'edificio', x: jx, y: jy, s: 1, v: 1, w, h, semilla };
      edificios.push(b);
      piezas.push(b);
    }
  }

  // 5. Farolas a intervalos regulares, alternando lados: espaciadas en el pueblo y más seguidas en la ciudad.
  let recorrido = 0;
  let lado = 1;
  for (let i = 1; i < muestras.length; i++) {
    const a = muestras[i - 1];
    const b = muestras[i];
    recorrido += Math.hypot(b.x - a.x, b.y - a.y);
    const enCiudad = b.y >= yCiudad + 30;
    if (b.y < yPueblo + 80 || recorrido < (enCiudad ? 150 : 250)) continue;
    recorrido = 0;
    const separacion = enCiudad ? medio.ciudad - 8 : medio.campo + 6;
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const nx = -(b.y - a.y) / len;
    const ny = (b.x - a.x) / len;
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
  switch (p.tipo) {
    case 'pino':
      return <Pino x={p.x} y={p.y} s={p.s} />;
    case 'arbol':
      return <Arbol x={p.x} y={p.y} s={p.s} />;
    case 'arbusto':
      return <Arbusto x={p.x} y={p.y} s={p.s} />;
    case 'hierba':
      return <Hierba x={p.x} y={p.y} />;
    case 'oveja':
      return <Oveja x={p.x} y={p.y} s={p.s} v={p.v} />;
    case 'vaca':
      return <Vaca x={p.x} y={p.y} s={p.s} v={p.v} />;
    case 'ciervo':
      return <Ciervo x={p.x} y={p.y} s={p.s} v={p.v} />;
    case 'conejo':
      return <Conejo x={p.x} y={p.y} s={p.s} v={p.v} />;
    case 'molino':
      return <Molino x={p.x} y={p.y} s={p.s} />;
    case 'fardo':
      return <Fardo x={p.x} y={p.y} s={p.s} />;
    case 'casa':
      return <Casa x={p.x} y={p.y} s={p.s} />;
    case 'edificio':
      return <Edificio x={p.x} y={p.y} w={p.w ?? 30} h={p.h ?? 60} semilla={p.semilla} />;
    case 'farola':
      return <Farola x={p.x} y={p.y} s={p.s} v={p.v} />;
    case 'semaforo':
      return <Semaforo x={p.x} y={p.y} s={p.s} />;
    case 'arbolCiudad':
      return <ArbolCiudad x={p.x} y={p.y} s={p.s} />;
    case 'casaPueblo':
      return <CasaPueblo x={p.x} y={p.y} w={p.w ?? 26} h={p.h ?? 16} semilla={p.semilla} />;
    case 'iglesia':
      return <Iglesia x={p.x} y={p.y} s={p.s} v={p.v} />;
    case 'huerto':
      return <Huerto x={p.x} y={p.y} s={p.s} />;
  }
}
