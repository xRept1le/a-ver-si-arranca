import { View } from 'react-native';
import Svg, { G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import type { EscenaId } from '@/content';
import { colores } from './tema';

const ASFALTO = '#2A2C31';
const ACERA = '#16171A';
const MARCA = '#9A9DA5';

function Coche({ x, y, rot, relleno, letra }: { x: number; y: number; rot: number; relleno: string; letra: string }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${rot})`}>
      <Rect x={-11} y={-19} width={22} height={38} rx={6} fill={relleno} />
      <Rect x={-8} y={-12} width={16} height={9} rx={2} fill="#0B0B0C" opacity={0.55} />
      <SvgText x={0} y={12} fontSize={12} fontWeight="bold" fill="#0B0B0C" textAnchor="middle" transform={`rotate(${-rot} 0 8)`}>
        {letra}
      </SvgText>
    </G>
  );
}

/** Vista cenital de un cruce sin señalizar: A (usted) sube; B llega por la derecha de A. */
function CruceSinSenalizar() {
  return (
    <Svg viewBox="0 0 300 220" width="100%" height="100%">
      <Rect x={0} y={0} width={300} height={220} fill={ACERA} />
      {/* Vías */}
      <Rect x={120} y={0} width={60} height={220} fill={ASFALTO} />
      <Rect x={0} y={80} width={300} height={60} fill={ASFALTO} />
      {/* Ejes discontinuos */}
      {[10, 40, 160, 190].map((y) => (
        <Line key={`v${y}`} x1={150} y1={y} x2={150} y2={y + 18} stroke={MARCA} strokeWidth={2} />
      ))}
      {[10, 40, 70, 210, 240, 270].map((x) => (
        <Line key={`h${x}`} x1={x} y1={110} x2={x + 18} y2={110} stroke={MARCA} strokeWidth={2} />
      ))}
      {/* Trayectorias */}
      <Path d="M165 150 L165 92" stroke={colores.acento} strokeWidth={2} strokeDasharray="4 4" />
      <Path d="M158 98 L165 88 L172 98" stroke={colores.acento} strokeWidth={2} fill="none" />
      <Path d="M206 95 L140 95" stroke={colores.textoSuave} strokeWidth={2} strokeDasharray="4 4" />
      <Path d="M146 88 L136 95 L146 102" stroke={colores.textoSuave} strokeWidth={2} fill="none" />
      <Coche x={165} y={178} rot={0} relleno={colores.acento} letra="A" />
      <Coche x={232} y={95} rot={-90} relleno="#D9DADF" letra="B" />
      <SvgText x={8} y={212} fontSize={10} fill={colores.textoSuave}>
        Sin señales ni semáforos
      </SvgText>
    </Svg>
  );
}

const DESCRIPCION: Record<EscenaId, string> = {
  'cruce-sin-senalizar':
    'Vista cenital de un cruce sin señalizar. El vehículo A, el suyo, se dirige hacia el cruce desde abajo. El vehículo B se acerca desde la derecha de A.',
};

/** Escena estática. Ocupa todo el marco que la contiene, sin deformarse. */
export function Escena({ id }: { id: EscenaId }) {
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={DESCRIPCION[id]} testID={`escena-${id}`} style={{ flex: 1 }}>
      {id === 'cruce-sin-senalizar' ? <CruceSinSenalizar /> : null}
    </View>
  );
}
