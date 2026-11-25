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

export function Flores({ x, y, s }: Pieza) {
  const flores: [number, number, string][] = [
    [-8, -9, PAISAJE.blanco],
    [-2, -13, '#3B82F6'],
    [5, -8, PAISAJE.ambar],
    [10, -12, PAISAJE.blanco],
  ];
  return (
    <En x={x} y={y} s={s}>
      {flores.map(([fx, fy, c]) => (
        <G key={`${fx}`}>
          <Line x1={fx} y1={0} x2={fx} y2={fy} stroke={PAISAJE.copa} strokeWidth={1.5} />
          <Circle cx={fx} cy={fy} r={2.6} fill={c} />
        </G>
      ))}
    </En>
  );
}

export function Pajaros({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      <Path
        d="M-12,0 q4,-5 8,0 q4,-5 8,0 M6,-10 q3,-4 6,0 q3,-4 6,0"
        stroke={PAISAJE.pajaro}
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
      />
    </En>
  );
}

export function Valla({ x, y, s }: Pieza) {
  return (
    <En x={x} y={y} s={s}>
      {[-18, -6, 6, 18].map((px) => (
        <Rect key={px} x={px - 1.5} y={-16} width={3} height={16} fill={PAISAJE.valla} />
      ))}
      <Rect x={-20} y={-13} width={40} height={2.5} fill={PAISAJE.valla} />
      <Rect x={-20} y={-7} width={40} height={2.5} fill={PAISAJE.valla} />
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
      const encendida = azar(semilla * 31 + f * 7 + c) > 0.62;
      ventanas.push(
        <Rect
          key={`${f}-${c}`}
          x={-w / 2 + margen + c * 9}
          y={-h + 8 + f * 12}
          width={5}
          height={6}
          fill={encendida ? PAISAJE.ventana : PAISAJE.ventanaApagada}
          opacity={encendida ? 0.85 : 1}
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

/** Señal de entrada a poblado (fondo blanco, texto negro), sobre un poste. */
export function EntradaPoblado({ x, y, nombre }: { x: number; y: number; nombre: string }) {
  return (
    <G transform={`translate(${x} ${y})`}>
      <Line x1={0} y1={0} x2={0} y2={-30} stroke={PAISAJE.farola} strokeWidth={3} />
      <Rect x={-34} y={-58} width={68} height={30} rx={3} fill={PAISAJE.blanco} stroke={PAISAJE.oscuro} strokeWidth={2} />
      <SvgText x={0} y={-39} fontSize={11} fontWeight="bold" fill="#111" textAnchor="middle">
        {nombre}
      </SvgText>
    </G>
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
