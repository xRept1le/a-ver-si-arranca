import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { camino, esPrevisto, niveles, tituloNivel, type Nivel, type NivelPrevisto, type TramoCamino } from '@/content';
import { estadosNiveles, nivelActual, nivelQueFalta, type EstadoNivel } from '@/domain/niveles';
import { useDatos } from '@/store/useDatos';
import { Dialogo, Icono } from './componentes';
import { azar, CartelOrientacion, componerPaisaje, EntradaPoblado, Meta, PAISAJE, PasoPeatones, PiezaPaisaje, Tunel } from './Paisaje';
import { colores, radio } from './tema';

const NODO = 58;
const NODO_ACTUAL = 70;
/** Altura de cada elemento del camino. */
const ALTO = { cartel: 96, nivel: 118, entrada: 110, meta: 90 } as const;
/** Altura de la ladera con el túnel del principio y altura de su boca. */
const TUNEL = { alto: 128, boca: 104 } as const;
/** Medio ancho de la calzada y de lo que ocupa con arcén o acera. */
const CALZADA = { campo: 54, ciudad: 64 } as const;
const OCUPA = { campo: CALZADA.campo / 2 + 7, ciudad: CALZADA.ciudad / 2 + 15 } as const;
/** El penúltimo tramo atraviesa un pueblo y el último, la ciudad. */
const PRIMER_TRAMO_PUEBLO = Math.max(0, camino.length - 2);
const PRIMER_TRAMO_CIUDAD = Math.max(0, camino.length - 1);
/** Nombre del pueblo en la señal de entrada a poblado. */
const NOMBRE_PUEBLO = 'VILLARRANCA';
/** Altura de los fundidos entre zonas. */
const FUNDIDO = 220;
const CARACTER = ['prado', 'bosque', 'cultivo'] as const;
const CARTEL = { ancho: 150, alto: 52 } as const;
const ENSANCHE = 30;

/** Trapecio centrado en `x` que pasa de ancho `w0` (arriba) a `w1` (abajo). */
const trapecio = (x: number, y: number, w0: number, w1: number) =>
  `M${x - w0 / 2},${y}L${x + w0 / 2},${y}L${x + w1 / 2},${y + ENSANCHE}L${x - w1 / 2},${y + ENSANCHE}Z`;

type EstadoCamino = EstadoNivel | 'previsto';

const TEXTO_ESTADO: Record<EstadoCamino, string> = {
  completado: 'Completado',
  disponible: 'Empezar',
  bloqueado: 'Bloqueado',
  previsto: 'Próximamente',
};

type Elemento =
  | { tipo: 'cartel'; y: number; tramo: TramoCamino; t: number }
  | { tipo: 'nivel'; y: number; tramo: TramoCamino; t: number; nivel: Nivel | NivelPrevisto; k: number }
  | { tipo: 'entrada'; y: number }
  | { tipo: 'meta'; y: number };
type ElementoNivel = Extract<Elemento, { tipo: 'nivel' }>;

const centro = (e: Elemento) => e.y + ALTO[e.tipo] / 2;

/** Coloca los elementos del camino de arriba abajo. */
function trazar() {
  const elementos: Elemento[] = [];
  let y = TUNEL.alto;
  let k = 0;
  camino.forEach((tramo, t) => {
    if (t === PRIMER_TRAMO_CIUDAD && t > 0) {
      elementos.push({ tipo: 'entrada', y });
      y += ALTO.entrada;
    }
    elementos.push({ tipo: 'cartel', y, tramo, t });
    y += ALTO.cartel;
    for (const nivel of tramo.niveles) {
      elementos.push({ tipo: 'nivel', y, tramo, t, nivel, k });
      y += ALTO.nivel;
      k++;
    }
  });
  elementos.push({ tipo: 'meta', y });
  y += ALTO.meta;
  return { elementos, total: y };
}

/** Curva entre dos puntos con tangentes verticales en ambos extremos. */
function curva(a: { x: number; y: number }, b: { x: number; y: number }) {
  const m = (a.y + b.y) / 2;
  return `C${a.x},${m} ${b.x},${m} ${b.x},${b.y}`;
}

/**
 * Camino de niveles con forma de carretera. Los niveles son los protagonistas: el paisaje,
 * en tonos apagados, se reparte alrededor sin patrones fijos y el texto se limita al nivel actual.
 */
export function CaminoNiveles() {
  const { width: anchoVentana } = useWindowDimensions();
  const [ancho, setAncho] = useState(0);
  const W = Math.round(ancho || anchoVentana);
  const completados = useDatos((s) => s.completados);
  const estados = estadosNiveles(niveles, completados);
  const actual = nivelActual(niveles, completados);
  const [aviso, setAviso] = useState<{ tipo: 'bloqueado'; nivel: Nivel; falta?: Nivel } | { tipo: 'previsto'; tramo: TramoCamino } | null>(null);

  const { elementos, total } = useMemo(trazar, []);
  const yCiudad = elementos.find((e) => e.tipo === 'entrada')?.y ?? total;
  const cartelPueblo = elementos.find((e) => e.tipo === 'cartel' && e.t === PRIMER_TRAMO_PUEBLO);
  const yPueblo = cartelPueblo && PRIMER_TRAMO_PUEBLO > 0 ? cartelPueblo.y - 30 : yCiudad;

  // Geometría y paisaje: solo dependen del ancho.
  const escena = useMemo(() => {
    // Zigzag con amplitud algo irregular para que no parezca dibujado con plantilla.
    const xDe = (e: Elemento) => {
      if (e.tipo !== 'nivel') return W / 2;
      const amplitud = 0.17 + azar(e.k * 3 + 2) * 0.06;
      return W * (0.5 + (e.k % 2 === 0 ? -amplitud : amplitud));
    };
    const puntos = [{ x: W / 2, y: TUNEL.boca }, ...elementos.map((e) => ({ x: xDe(e), y: centro(e) })), { x: W / 2, y: total }];

    // Carteles junto a la calzada, alternando lado.
    const carteles = elementos.flatMap((e) => {
      if (e.tipo !== 'cartel') return [];
      const izq = e.t % 2 === 0;
      const x = izq ? W / 2 - OCUPA.campo - 14 - CARTEL.ancho : W / 2 + OCUPA.campo + 14;
      return [{ e, x, y: centro(e) - CARTEL.alto / 2 - 10 }];
    });

    // Señal de entrada a poblado, en el lado contrario al cartel del tramo.
    const entradaPueblo =
      cartelPueblo && cartelPueblo.tipo === 'cartel' && yPueblo < yCiudad
        ? {
            x: cartelPueblo.t % 2 === 0 ? W / 2 + OCUPA.campo + 58 : W / 2 - OCUPA.campo - 58,
            y: centro(cartelPueblo) + 30,
          }
        : undefined;

    const reservas = [
      { x0: 0, y0: 0, x1: W, y1: TUNEL.alto },
      ...(entradaPueblo ? [{ x0: entradaPueblo.x - 52, y0: entradaPueblo.y - 64, x1: entradaPueblo.x + 52, y1: entradaPueblo.y + 6 }] : []),
      // Alrededor de cada nivel, incluida la pastilla del nivel actual.
      ...elementos.flatMap((e, i) =>
        e.tipo === 'nivel' ? [{ x0: puntos[i + 1].x - 56, y0: puntos[i + 1].y - 50, x1: puntos[i + 1].x + 56, y1: puntos[i + 1].y + 70 }] : [],
      ),
      ...carteles.map((c) => ({ x0: c.x - 6, y0: c.y - 6, x1: c.x + CARTEL.ancho + 6, y1: c.y + CARTEL.alto + 34 })),
      ...elementos
        .filter((e) => e.tipo === 'entrada' || e.tipo === 'meta')
        .map((e) => ({ x0: 0, y0: e.y, x1: W, y1: e.y + ALTO[e.tipo] })),
    ];
    const tramos = elementos.flatMap((e, i) => {
      if (e.tipo !== 'cartel') return [];
      const siguiente = elementos.slice(i + 1).find((s) => s.tipo !== 'nivel');
      return [{ y0: e.y, y1: siguiente?.y ?? total, caracter: e.t < PRIMER_TRAMO_PUEBLO ? CARACTER[e.t % 3] : 'cultivo' }];
    });
    const piezas = componerPaisaje({ ancho: W, alto: total, yPueblo, yCiudad, puntos, medio: OCUPA, reservas, tramos });

    // Trazado de la calzada, separado en campo y ciudad. Al entrar en la ciudad la calzada
    // se ensancha de forma gradual en un tramo recto de ENSANCHE px.
    const trazado = { campo: '', ciudad: '' };
    let yEnsanche: number | undefined;
    for (let i = 0; i < puntos.length - 1; i++) {
      const a = puntos[i];
      const b = puntos[i + 1];
      if (a.y < yCiudad) {
        if (!trazado.campo) trazado.campo = `M${a.x},${a.y}`;
        trazado.campo += curva(a, b);
      } else if (!trazado.ciudad) {
        yEnsanche = a.y;
        trazado.ciudad = `M${a.x},${a.y + ENSANCHE}L${b.x},${b.y}`;
      } else {
        trazado.ciudad += curva(a, b);
      }
    }

    // Un paso de peatones por tramo de pueblo o ciudad, en mitad de su primera curva.
    const pasos = elementos.flatMap((e, i) => {
      if (e.tipo !== 'cartel' || e.y < yPueblo) return [];
      const a = puntos[i + 2];
      const b = puntos[i + 3];
      if (!a || !b) return [];
      const grados = (Math.atan2(0.75 * (b.y - a.y), 1.5 * (b.x - a.x)) * 180) / Math.PI;
      const ancho = (e.y >= yCiudad ? CALZADA.ciudad : CALZADA.campo) - 10;
      return [{ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, grados, ancho }];
    });

    return { puntos, carteles, piezas, trazado, pasos, yEnsanche, entradaPueblo };
  }, [W, elementos, total, yPueblo, yCiudad, cartelPueblo]);

  const { puntos } = escena;
  const indiceActual = actual ? elementos.findIndex((e) => e.tipo === 'nivel' && e.nivel.id === actual.id) + 1 : puntos.length;
  // Lo recorrido empieza en el primer tramo con preguntas: los previstos no se han hecho.
  const inicioRecorrido = elementos.findIndex((e) => e.tipo === 'cartel' && !esPrevisto(e.tramo)) + 1;
  const recorrido = (fin: number) => fin > inicioRecorrido && fin <= indiceActual;

  const estadoDe = (e: ElementoNivel): EstadoCamino => (esPrevisto(e.tramo) ? 'previsto' : estados[e.nivel.id]);

  const pulsar = (e: ElementoNivel) => {
    if (esPrevisto(e.tramo)) {
      setAviso({ tipo: 'previsto', tramo: e.tramo });
      return;
    }
    const nivel = e.nivel as Nivel;
    if (estados[nivel.id] === 'bloqueado') {
      setAviso({ tipo: 'bloqueado', nivel, falta: nivelQueFalta(niveles, completados, nivel.id) });
      return;
    }
    router.push({ pathname: '/leccion/[nivel]', params: { nivel: nivel.id } });
  };

  return (
    <View testID="camino" style={[styles.camino, { height: total }]} onLayout={(ev) => setAncho(ev.nativeEvent.layout.width)}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <Svg width={W} height={total}>
          <Defs>
            <LinearGradient id="fundido" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colores.fondo} stopOpacity={1} />
              <Stop offset="1" stopColor={colores.fondo} stopOpacity={0} />
            </LinearGradient>
            <LinearGradient id="aPueblo" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={PAISAJE.campo} stopOpacity={1} />
              <Stop offset="1" stopColor={PAISAJE.pueblo} stopOpacity={1} />
            </LinearGradient>
            <LinearGradient id="aCiudad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={PAISAJE.pueblo} stopOpacity={1} />
              <Stop offset="1" stopColor={PAISAJE.ciudad} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={yPueblo} fill={PAISAJE.campo} />
          <Rect x={0} y={yPueblo} width={W} height={yCiudad - yPueblo} fill={PAISAJE.pueblo} />
          <Rect x={0} y={yCiudad} width={W} height={total - yCiudad} fill={PAISAJE.ciudad} />
          <Rect x={0} y={yPueblo - FUNDIDO / 2} width={W} height={FUNDIDO} fill="url(#aPueblo)" />
          <Rect x={0} y={yCiudad - FUNDIDO / 2} width={W} height={FUNDIDO} fill="url(#aCiudad)" />

          {/* Calzada */}
          {escena.trazado.campo ? (
            <G>
              <Path d={escena.trazado.campo} stroke={PAISAJE.arcen} strokeWidth={CALZADA.campo + 14} fill="none" />
              <Path d={escena.trazado.campo} stroke={PAISAJE.lineaBorde} strokeOpacity={0.55} strokeWidth={CALZADA.campo + 3} fill="none" />
              <Path d={escena.trazado.campo} stroke={PAISAJE.asfalto} strokeWidth={CALZADA.campo} fill="none" />
            </G>
          ) : null}
          {escena.trazado.ciudad ? (
            <G>
              <Path d={escena.trazado.ciudad} stroke={PAISAJE.acera} strokeWidth={CALZADA.ciudad + 30} fill="none" />
              <Path d={escena.trazado.ciudad} stroke={PAISAJE.bordillo} strokeWidth={CALZADA.ciudad + 4} fill="none" />
              <Path d={escena.trazado.ciudad} stroke={PAISAJE.asfaltoCiudad} strokeWidth={CALZADA.ciudad} fill="none" />
            </G>
          ) : null}
          {escena.yEnsanche !== undefined ? (
            <G>
              <Path d={trapecio(W / 2, escena.yEnsanche, CALZADA.campo + 14, CALZADA.ciudad + 30)} fill={PAISAJE.acera} />
              <Path d={trapecio(W / 2, escena.yEnsanche, CALZADA.campo + 3, CALZADA.ciudad + 4)} fill={PAISAJE.bordillo} />
              <Path d={trapecio(W / 2, escena.yEnsanche, CALZADA.campo, CALZADA.ciudad)} fill={PAISAJE.asfaltoCiudad} />
            </G>
          ) : null}
          {escena.pasos.map((p, i) => (
            <PasoPeatones key={`pp${i}`} x={p.x} y={p.y} grados={p.grados} ancho={p.ancho} />
          ))}

          {/* Línea central: azul en la parte ya recorrida */}
          {puntos.slice(0, -1).map((p, i) => (
            <Path
              key={`l${i}`}
              d={`M${p.x},${p.y}${curva(p, puntos[i + 1])}`}
              stroke={recorrido(i + 1) ? colores.acento : PAISAJE.lineaCentral}
              strokeOpacity={recorrido(i + 1) ? 1 : 0.45}
              strokeWidth={recorrido(i + 1) ? 3 : 2}
              strokeDasharray="12 12"
              fill="none"
            />
          ))}

          {/* Paisaje, ordenado por profundidad */}
          {escena.piezas.map((p, i) => (
            <PiezaPaisaje key={`z${i}`} p={p} />
          ))}

          {/* Postes de los carteles de tramo */}
          {escena.carteles.map(({ e, x, y }) => (
            <G key={`poste${e.t}`}>
              <Rect x={x + 22} y={y + CARTEL.alto - 2} width={3} height={30} fill={PAISAJE.farola} />
              <Rect x={x + CARTEL.ancho - 25} y={y + CARTEL.alto - 2} width={3} height={30} fill={PAISAJE.farola} />
            </G>
          ))}

          {escena.entradaPueblo ? <EntradaPoblado x={escena.entradaPueblo.x} y={escena.entradaPueblo.y} nombre={NOMBRE_PUEBLO} /> : null}
          {elementos.map((e) =>
            e.tipo === 'entrada' ? (
              <CartelOrientacion
                key="entrada"
                x={W / 2}
                y={e.y + 6}
                ySuelo={e.y + ALTO.entrada - 4}
                ruta={`T-${PRIMER_TRAMO_CIUDAD + 1}`}
                nombre="Ciudad"
                separacion={CALZADA.ciudad + 44}
              />
            ) : e.tipo === 'meta' ? (
              <Meta key="meta" x={W / 2} y={centro(e)} w={CALZADA.ciudad} />
            ) : null,
          )}
          <Tunel x={W / 2} yBoca={TUNEL.boca} ancho={CALZADA.campo} W={W} />
          <Rect x={0} y={0} width={W} height={36} fill="url(#fundido)" />
        </Svg>
      </View>

      {/* Carteles de tramo: pequeñas señales de orientación junto a la calzada */}
      {escena.carteles.map(({ e, x, y }) => {
        const previsto = esPrevisto(e.tramo);
        return (
          <View
            key={`c${e.t}`}
            style={[styles.cartel, { left: x, top: y, width: CARTEL.ancho, minHeight: CARTEL.alto }, previsto && styles.cartelPrevisto]}
            testID={`tramo-${e.tramo.id}`}
            accessible
            accessibilityRole="header"
            accessibilityLabel={`Tramo ${e.t + 1}: ${e.tramo.titulo}${previsto ? '. Próximamente' : ''}`}
          >
            <Text style={[styles.cartelNumero, previsto && { color: colores.textoSuave, borderColor: colores.textoSuave }]}>{e.t + 1}</Text>
            <Text style={[styles.cartelTitulo, previsto && { color: colores.textoSuave }]} numberOfLines={2}>
              {e.tramo.titulo}
            </Text>
          </View>
        );
      })}

      {/* Niveles */}
      {elementos.map((e, i) => {
        if (e.tipo !== 'nivel') return null;
        const p = puntos[i + 1];
        const estado = estadoDe(e);
        const esActual = actual?.id === e.nivel.id;
        const tam = esActual ? NODO_ACTUAL : NODO;
        const previsto = estado === 'previsto';
        const nombre = previsto ? `Nivel ${e.nivel.numero}` : `${tituloNivel(e.nivel as Nivel)}, ${(e.nivel as Nivel).titulo}`;
        return (
          <View key={e.nivel.id} style={[styles.ancla, { left: p.x - 60, top: p.y - tam / 2 }]} pointerEvents="box-none">
            {esActual ? <View style={[styles.halo, { width: tam + 18, height: tam + 18, borderRadius: (tam + 18) / 2, top: -9 }]} /> : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Tramo ${e.t + 1}. ${nombre}. ${TEXTO_ESTADO[estado]}`}
              accessibilityState={{ disabled: estado === 'bloqueado' || previsto }}
              testID={`nivel-${e.nivel.id}`}
              onPress={() => pulsar(e)}
              hitSlop={6}
              style={({ pressed }) => [
                styles.nodo,
                { width: tam, height: tam, borderRadius: tam / 2 },
                estado === 'completado' && styles.nodoCompletado,
                estado === 'bloqueado' && styles.nodoBloqueado,
                previsto && styles.nodoPrevisto,
                esActual && styles.nodoActual,
                pressed && { transform: [{ scale: 0.96 }] },
              ]}
            >
              {esActual ? (
                <Icono nombre="play" tam={30} color={colores.sobreAcento} />
              ) : estado === 'completado' ? (
                <Icono nombre="checkmark" tam={26} color={colores.acierto} />
              ) : (
                <Text style={[styles.numero, previsto && { color: colores.textoTenue }]}>{e.nivel.numero}</Text>
              )}
            </Pressable>
            {esActual ? (
              <View style={styles.pastilla} pointerEvents="none">
                <Text style={styles.pastillaTexto}>{TEXTO_ESTADO[estado]}</Text>
              </View>
            ) : null}
          </View>
        );
      })}

      <Dialogo
        visible={!!aviso}
        titulo={aviso?.tipo === 'previsto' ? 'Tema en preparación' : 'Nivel bloqueado'}
        mensaje={
          aviso?.tipo === 'previsto'
            ? `Las preguntas de «${aviso.tramo.titulo}» todavía no están disponibles.${actual ? ` Mientras tanto, sigue con «${tituloNivel(actual)}».` : ''}`
            : aviso?.falta
              ? `Para desbloquear «${tituloNivel(aviso.nivel)}», completa antes «${tituloNivel(aviso.falta)}» con 3 fallos como máximo.`
              : undefined
        }
        confirmar={
          aviso?.tipo === 'previsto'
            ? actual
              ? `Ir a ${tituloNivel(actual)}`
              : 'Entendido'
            : aviso?.falta
              ? `Ir a ${tituloNivel(aviso.falta)}`
              : 'Entendido'
        }
        cancelar="Cerrar"
        onCancelar={() => setAviso(null)}
        onConfirmar={() => {
          const destino = aviso?.tipo === 'previsto' ? actual : aviso?.falta;
          setAviso(null);
          if (destino) router.push({ pathname: '/leccion/[nivel]', params: { nivel: destino.id } });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  camino: { marginHorizontal: -16, overflow: 'hidden' },
  cartel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colores.acentoRelleno,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  cartelPrevisto: { backgroundColor: colores.superficieAlta, borderColor: colores.borde },
  cartelNumero: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
    color: colores.sobreAcento,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 21,
  },
  cartelTitulo: { flex: 1, fontSize: 13, lineHeight: 17, fontWeight: '700', color: colores.sobreAcento },
  ancla: { position: 'absolute', width: 120, alignItems: 'center' },
  halo: { position: 'absolute', backgroundColor: colores.acento, opacity: 0.18 },
  nodo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.superficieAlta,
    borderWidth: 2,
    borderColor: colores.bordeFuerte,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  nodoCompletado: { borderColor: colores.acierto, borderWidth: 2.5, backgroundColor: colores.superficie },
  nodoBloqueado: { backgroundColor: colores.superficie, borderColor: colores.bordeFuerte },
  nodoPrevisto: { backgroundColor: colores.fondo, borderColor: colores.borde, elevation: 0, shadowOpacity: 0 },
  nodoActual: { backgroundColor: colores.acentoRelleno, borderColor: colores.texto, borderWidth: 3 },
  numero: { fontSize: 20, fontWeight: '800', color: colores.textoSuave },
  pastilla: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radio.total,
    backgroundColor: colores.texto,
  },
  pastillaTexto: { fontSize: 13, fontWeight: '800', color: colores.fondo },
});
