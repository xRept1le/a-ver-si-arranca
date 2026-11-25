import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { azar } from './Paisaje';
import { colores } from './tema';

/** Colores del confeti: la paleta de la app, con algún toque cálido. */
const COLORES = [colores.acento, '#93C5FD', colores.texto, colores.correcto, '#E5C36A'];
const PIEZAS = 70;
const DURACION = 2600;

/**
 * Lluvia de confeti a pantalla completa que se reproduce una vez al montarse.
 * No intercepta toques y no se muestra si el sistema pide reducir el movimiento.
 */
export function Confeti() {
  const { width, height } = useWindowDimensions();
  const avance = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(true);
  const [sinMovimiento, setSinMovimiento] = useState<boolean | null>(null);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()
      .then(setSinMovimiento)
      .catch(() => setSinMovimiento(false));
  }, []);

  useEffect(() => {
    if (sinMovimiento !== false) return;
    const animacion = Animated.timing(avance, { toValue: 1, duration: DURACION + 900, easing: Easing.linear, useNativeDriver: Platform.OS !== 'web' });
    animacion.start(({ finished }) => finished && setVisible(false));
    return () => animacion.stop();
  }, [avance, sinMovimiento]);

  const piezas = useMemo(
    () =>
      Array.from({ length: PIEZAS }, (_, i) => {
        const inicio = azar(i * 3.1) * 0.25;
        const fin = Math.min(1, inicio + 0.55 + azar(i * 5.7) * 0.2);
        const x0 = azar(i * 1.3) * width;
        const deriva = (azar(i * 7.9) - 0.5) * 120;
        const giro = (azar(i * 2.2) > 0.5 ? 1 : -1) * (360 + azar(i * 4.4) * 540);
        const ancho = 6 + azar(i * 6.1) * 5;
        return {
          color: COLORES[i % COLORES.length],
          ancho,
          alto: ancho * (0.4 + azar(i * 8.3) * 0.5),
          redondo: i % 5 === 0,
          traslado: avance.interpolate({ inputRange: [0, inicio, fin, 1], outputRange: [-30, -30, height + 30, height + 30] }),
          lateral: avance.interpolate({
            inputRange: [0, inicio, (inicio + fin) / 2, fin, 1],
            outputRange: [x0, x0, x0 + deriva, x0 + deriva * 0.4, x0 + deriva * 0.4],
          }),
          giro: avance.interpolate({ inputRange: [0, inicio, fin, 1], outputRange: ['0deg', '0deg', `${giro}deg`, `${giro}deg`] }),
          opacidad: avance.interpolate({ inputRange: [0, inicio, inicio + 0.01, fin - 0.08, fin], outputRange: [0, 0, 1, 1, 0] }),
        };
      }),
    [avance, width, height],
  );

  if (!visible || sinMovimiento !== false) return null;

  return (
    <View testID="confeti" style={StyleSheet.absoluteFill} pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {piezas.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: p.ancho,
            height: p.redondo ? p.ancho : p.alto,
            borderRadius: p.redondo ? p.ancho / 2 : 1.5,
            backgroundColor: p.color,
            opacity: p.opacidad,
            transform: [{ translateX: p.lateral }, { translateY: p.traslado }, { rotate: p.giro }],
          }}
        />
      ))}
    </View>
  );
}
