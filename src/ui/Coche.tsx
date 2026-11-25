import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform } from 'react-native';
import Svg, { Circle, Rect } from 'react-native-svg';

/** Azul claro del coche: del mismo tono que el acento, más luminoso. */
const AZUL_COCHE = '#93C5FD';
const LARGO = 34;
const ANCHO = 18;

export interface Recorrido {
  /** Longitud acumulada de cada muestra, estrictamente creciente. */
  s: number[];
  x: number[];
  y: number[];
  /** Ángulo de avance en grados, sin saltos de 360°. */
  grados: number[];
}

/** Última posición mostrada, para animar desde ahí al volver a Inicio. */
let ultimaPosicion: number | null = null;

/**
 * Coche visto desde arriba que avanza por el recorrido hasta la posición `destino` (en px de recorrido).
 * Con `activo` a falso (pantalla no visible), espera y avanza al volver a estar a la vista.
 */
export function Coche({ recorrido, destino, activo }: { recorrido: Recorrido; destino: number; activo: boolean }) {
  const progreso = useRef(new Animated.Value(ultimaPosicion ?? destino)).current;
  const [sinMovimiento, setSinMovimiento] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setSinMovimiento)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!activo) return;
    const desde = ultimaPosicion ?? destino;
    ultimaPosicion = destino;
    if (desde === destino) {
      progreso.setValue(destino);
      return;
    }
    if (sinMovimiento) {
      progreso.setValue(destino);
      return;
    }
    progreso.setValue(desde);
    const distancia = Math.abs(destino - desde);
    const animacion = Animated.timing(progreso, {
      toValue: destino,
      duration: Math.min(5000, Math.max(1400, distancia * 2.2)),
      delay: 350,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: Platform.OS !== 'web',
    });
    animacion.start();
    return () => animacion.stop();
  }, [destino, progreso, sinMovimiento, activo]);

  const transform = useMemo(() => {
    const entrada = recorrido.s;
    return [
      { translateX: progreso.interpolate({ inputRange: entrada, outputRange: recorrido.x.map((v) => v - LARGO / 2), extrapolate: 'clamp' }) },
      { translateY: progreso.interpolate({ inputRange: entrada, outputRange: recorrido.y.map((v) => v - ANCHO / 2), extrapolate: 'clamp' }) },
      { rotate: progreso.interpolate({ inputRange: entrada, outputRange: recorrido.grados.map((g) => `${g}deg`), extrapolate: 'clamp' }) },
    ];
  }, [progreso, recorrido]);

  return (
    <Animated.View
      testID="coche"
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      style={{ position: 'absolute', left: 0, top: 0, width: LARGO, height: ANCHO, transform }}
    >
      <Svg width={LARGO} height={ANCHO}>
        <Rect x={2} y={2.5} width={31} height={15} rx={5} fill="#000" opacity={0.35} />
        <Rect x={1} y={1} width={31} height={15} rx={5} fill={AZUL_COCHE} />
        <Rect x={19} y={3} width={6} height={11} rx={2} fill="#1E3A5F" />
        <Rect x={5} y={3.5} width={4} height={10} rx={1.5} fill="#1E3A5F" opacity={0.85} />
        <Rect x={10} y={3} width={8} height={11} rx={2} fill="#BFDBFE" opacity={0.55} />
        <Circle cx={31} cy={4} r={1.4} fill="#FFF6D5" />
        <Circle cx={31} cy={13} r={1.4} fill="#FFF6D5" />
      </Svg>
    </Animated.View>
  );
}

/**
 * Muestrea la carretera (curvas con tangentes verticales entre `puntos`) para el coche,
 * desplazado `carril` px a la derecha del sentido de la marcha.
 */
export function muestrearRecorrido(puntos: { x: number; y: number }[], carril: number, porTramo = 12): Recorrido {
  const r: Recorrido = { s: [], x: [], y: [], grados: [] };
  let s = 0;
  let previo: { x: number; y: number } | undefined;
  let gradosPrevio: number | undefined;
  for (let i = 0; i < puntos.length - 1; i++) {
    const a = puntos[i];
    const b = puntos[i + 1];
    const m = (a.y + b.y) / 2;
    for (let k = i === 0 ? 0 : 1; k <= porTramo; k++) {
      const t = k / porTramo;
      const u = 1 - t;
      const x = u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x;
      const y = u * u * u * a.y + 3 * u * u * t * m + 3 * u * t * t * m + t * t * t * b.y;
      // Derivada para la dirección de avance.
      const dx = 6 * u * t * (b.x - a.x);
      const dy = 3 * u * u * (m - a.y) + 3 * t * t * (b.y - m);
      const len = Math.hypot(dx, dy) || 1;
      let g = (Math.atan2(dy, dx) * 180) / Math.PI;
      if (gradosPrevio !== undefined) {
        while (g - gradosPrevio > 180) g -= 360;
        while (g - gradosPrevio < -180) g += 360;
      }
      // Derecha del sentido de la marcha en pantalla (y hacia abajo): (-dy, dx).
      const px = x + (-dy / len) * carril;
      const py = y + (dx / len) * carril;
      if (previo) {
        const paso = Math.hypot(px - previo.x, py - previo.y);
        if (paso < 0.01) continue;
        s += paso;
      }
      r.s.push(s);
      r.x.push(px);
      r.y.push(py);
      r.grados.push(g);
      previo = { x: px, y: py };
      gradosPrevio = g;
    }
  }
  return r;
}

/** Longitud de recorrido en la que se alcanza la y indicada (primera muestra por debajo). */
export function posicionEnY(recorrido: Recorrido, y: number) {
  const i = recorrido.y.findIndex((v) => v >= y);
  return i < 0 ? recorrido.s[recorrido.s.length - 1] : recorrido.s[i];
}
