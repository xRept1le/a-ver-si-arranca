import { router } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { camino, esPrevisto, niveles, tituloNivel, type Nivel, type NivelPrevisto, type TramoCamino } from '@/content';
import { estadosNiveles, nivelActual, nivelQueFalta, type EstadoNivel } from '@/domain/niveles';
import { useDatos } from '@/store/useDatos';
import { Dialogo, Icono, type NombreIcono } from './componentes';
import {
  Arbol,
  ArbolCiudad,
  Arbusto,
  azar,
  Casa,
  Ciervo,
  Conejo,
  Edificio,
  EntradaPoblado,
  Farola,
  Fardo,
  Flores,
  Hierba,
  Meta,
  Molino,
  Oveja,
  PAISAJE,
  Pajaros,
  PasoPeatones,
  Pino,
  Semaforo,
  Valla,
  Vaca,
} from './Paisaje';
import { colores, espacio, radio, texto } from './tema';

const NODO = 60;
const NODO_ACTUAL = 72;
/** Altura de cada elemento del camino. */
const ALTO = { cartel: 140, nivel: 150, entrada: 120, meta: 120 } as const;
/** Ancho de la calzada en el campo y en la ciudad. */
const CALZADA = { campo: 60, ciudad: 70 } as const;
/** Los dos últimos tramos discurren por ciudad. */
const PRIMER_TRAMO_CIUDAD = Math.max(0, camino.length - 2);

type EstadoCamino = EstadoNivel | 'previsto';
type Lado = 'izq' | 'der';
type Entorno = 'campo' | 'ciudad';

const ICONO: Record<EstadoCamino, NombreIcono> = {
  completado: 'checkmark',
  disponible: 'play',
  bloqueado: 'lock-closed',
  previsto: 'time-outline',
};

const TEXTO_ESTADO: Record<EstadoCamino, string> = {
  completado: 'Completado · Repetir',
  disponible: 'Empezar',
  bloqueado: 'Bloqueado',
  previsto: 'Próximamente',
};

type Elemento =
  | { tipo: 'cartel'; y: number; tramo: TramoCamino; t: number }
  | { tipo: 'nivel'; y: number; tramo: TramoCamino; t: number; nivel: Nivel | NivelPrevisto; lado: Lado; k: number }
  | { tipo: 'entrada'; y: number }
  | { tipo: 'meta'; y: number };

const alto = (e: Elemento) => ALTO[e.tipo];
const centro = (e: Elemento) => e.y + alto(e) / 2;

/** Coloca los elementos del camino de arriba abajo. */
function trazar() {
  const elementos: Elemento[] = [];
  let y = 0;
  let k = 0;
  camino.forEach((tramo, t) => {
    if (t === PRIMER_TRAMO_CIUDAD && t > 0) {
      elementos.push({ tipo: 'entrada', y });
      y += ALTO.entrada;
    }
    elementos.push({ tipo: 'cartel', y, tramo, t });
    y += ALTO.cartel;
    for (const nivel of tramo.niveles) {
      elementos.push({ tipo: 'nivel', y, tramo, t, nivel, lado: k % 2 === 0 ? 'izq' : 'der', k });
      y += ALTO.nivel;
      k++;
    }
  });
  elementos.push({ tipo: 'meta', y });
  y += ALTO.meta;
  return { elementos, total: y };
}

const entornoDe = (e: Elemento, yEntrada: number): Entorno => (e.y >= yEntrada ? 'ciudad' : 'campo');

/** Tramo de curva entre dos puntos, con tangentes verticales en ambos extremos. */
function curva(a: { x: number; y: number }, b: { x: number; y: number }) {
  const m = (a.y + b.y) / 2;
  return `C${a.x},${m} ${b.x},${m} ${b.x},${b.y}`;
}

/** Decoración al lado exterior de un nivel, distinta según el tramo y el entorno. */
function decoracion(e: Extract<Elemento, { tipo: 'nivel' }>, x: number, y: number, ancho: number, entorno: Entorno): ReactNode {
  const fuera = e.lado === 'izq' ? -1 : 1;
  const borde = x + fuera * (CALZADA[entorno] / 2 + 6);
  const hueco = e.lado === 'izq' ? borde : ancho - borde;
  const cx = e.lado === 'izq' ? borde / 2 : borde + hueco / 2;
  const mira = (fuera * -1) as 1 | -1;
  const r = azar(e.k + 1);

  if (entorno === 'ciudad') {
    const w1 = Math.min(34, hueco / 2 - 4);
    const w2 = Math.min(30, hueco / 2 - 6);
    const xa = cx - fuera * (w1 / 2 + 2);
    const xb = cx + fuera * (w2 / 2 + 2);
    const base = y + 58;
    return (
      <G key={`d${e.k}`}>
        <Edificio x={xb} y={base - 4} w={w2} h={70 + Math.round(r * 40)} semilla={e.k * 3 + 1} />
        <Edificio x={xa} y={base} w={w1} h={90 + Math.round(azar(e.k + 9) * 50)} semilla={e.k * 3} />
        <Farola x={x + fuera * (CALZADA.ciudad / 2 + 10)} y={y + 30} v={mira} />
        {e.k % 3 === 1 ? <Semaforo x={x + fuera * (CALZADA.ciudad / 2 + 10)} y={y - 30} /> : null}
        {e.k % 3 === 2 ? <ArbolCiudad x={x + fuera * (CALZADA.ciudad / 2 + 12)} y={y - 34} /> : null}
      </G>
    );
  }

  // Campo: prado con ganado, bosque y campos de cultivo, según el tramo.
  const variante = e.t % 3;
  const principal =
    variante === 0
      ? [<Oveja key="a" x={cx} y={y + 16} s={1.25} v={mira} />, <Vaca key="b" x={cx} y={y + 16} s={1.1} v={mira} />][e.k % 2]
      : variante === 1
        ? [<Ciervo key="a" x={cx} y={y + 20} s={1.1} v={mira} />, <Pino key="b" x={cx} y={y + 24} s={1.1} />][e.k % 2]
        : [<Molino key="a" x={cx} y={y + 24} s={1.1} />, <Fardo key="b" x={cx} y={y + 16} s={1.3} />][e.k % 2];
  const secundaria =
    variante === 0
      ? [<Flores key="c" x={cx + 10} y={y + 64} />, <Valla key="c" x={cx} y={y + 66} s={0.9} />][e.k % 2]
      : variante === 1
        ? [<Conejo key="c" x={cx - 8} y={y + 66} v={mira} />, <Arbusto key="c" x={cx + 6} y={y + 64} />][e.k % 2]
        : [<Fardo key="c" x={cx + 12} y={y + 66} s={0.8} />, <Oveja key="c" x={cx} y={y + 66} s={0.8} v={mira} />][e.k % 2];
  const extra =
    r > 0.5 ? <Pajaros x={cx} y={y - 48} /> : variante === 1 ? <Pino x={cx + 14} y={y - 34} s={0.7} /> : <Arbol x={cx - 6} y={y - 30} s={0.6} />;
  return (
    <G key={`d${e.k}`}>
      {extra}
      {principal}
      {secundaria}
    </G>
  );
}

/** Camino de niveles con forma de carretera: campo al principio y ciudad en los últimos tramos. */
export function CaminoNiveles() {
  const { width: anchoVentana } = useWindowDimensions();
  const [ancho, setAncho] = useState(0);
  const W = ancho || anchoVentana;
  const completados = useDatos((s) => s.completados);
  const estados = estadosNiveles(niveles, completados);
  const actual = nivelActual(niveles, completados);
  const [aviso, setAviso] = useState<{ tipo: 'bloqueado'; nivel: Nivel; falta?: Nivel } | { tipo: 'previsto'; tramo: TramoCamino } | null>(null);

  const { elementos, total } = useMemo(trazar, []);
  const yEntrada = elementos.find((e) => e.tipo === 'entrada')?.y ?? total;

  const xDe = (e: Elemento) => (e.tipo === 'nivel' ? (e.lado === 'izq' ? 0.3 : 0.7) * W : W / 2);
  const puntos = [{ x: W / 2, y: 0 }, ...elementos.map((e) => ({ x: xDe(e), y: centro(e) })), { x: W / 2, y: total }];
  const indiceActual = actual ? elementos.findIndex((e) => e.tipo === 'nivel' && e.nivel.id === actual.id) + 1 : puntos.length;
  // La parte recorrida empieza en el primer tramo con preguntas: los previstos no se han hecho.
  const inicioRecorrido = elementos.findIndex((e) => e.tipo === 'cartel' && !esPrevisto(e.tramo)) + 1;
  const recorrido = (fin: number) => fin > inicioRecorrido && fin <= indiceActual;

  const estadoDe = (e: Extract<Elemento, { tipo: 'nivel' }>): EstadoCamino =>
    esPrevisto(e.tramo) ? 'previsto' : estados[e.nivel.id];

  const pulsar = (e: Extract<Elemento, { tipo: 'nivel' }>) => {
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

  // Calzada: un trazado para el campo y otro para la ciudad.
  const trazado = { campo: '', ciudad: '' };
  for (let i = 0; i < puntos.length - 1; i++) {
    const entorno: Entorno = puntos[i].y >= yEntrada ? 'ciudad' : 'campo';
    if (!trazado[entorno]) trazado[entorno] = `M${puntos[i].x},${puntos[i].y}`;
    trazado[entorno] += curva(puntos[i], puntos[i + 1]);
  }

  // Hierba repartida por el campo (la calzada la tapa al pintarse encima).
  const hierba: ReactNode[] = [];
  for (let i = 0; i < Math.floor(yEntrada / 26); i++) {
    hierba.push(<Hierba key={i} x={azar(i * 2 + 0.5) * W} y={azar(i * 3 + 0.25) * yEntrada} />);
  }

  // Pasos de peatones en la mitad de algunos tramos de ciudad.
  const pasos: ReactNode[] = [];
  for (let i = 1; i < puntos.length - 2; i++) {
    const a = puntos[i];
    const b = puntos[i + 1];
    const e = elementos[i - 1];
    if (a.y < yEntrada || e.tipo !== 'nivel' || e.k % 2 === 1) continue;
    const grados = (Math.atan2(0.75 * (b.y - a.y), 1.5 * (b.x - a.x)) * 180) / Math.PI;
    pasos.push(<PasoPeatones key={i} x={(a.x + b.x) / 2} y={(a.y + b.y) / 2} grados={grados} ancho={CALZADA.ciudad - 10} />);
  }

  return (
    <View
      testID="camino"
      style={[styles.camino, { height: total }]}
      onLayout={(ev) => setAncho(ev.nativeEvent.layout.width)}
    >
      <View style={StyleSheet.absoluteFill} pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <Svg width={W} height={total}>
          <Defs>
            <LinearGradient id="fundido" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colores.fondo} stopOpacity={1} />
              <Stop offset="1" stopColor={colores.fondo} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Rect x={0} y={0} width={W} height={yEntrada} fill={PAISAJE.campo} />
          <Rect x={0} y={yEntrada} width={W} height={total - yEntrada} fill={PAISAJE.ciudad} />
          {hierba}

          {/* Decoración exterior de cada nivel */}
          {elementos.map((e, i) =>
            e.tipo === 'nivel' ? decoracion(e, puntos[i + 1].x, puntos[i + 1].y, W, entornoDe(e, yEntrada)) : null,
          )}

          {/* Calzada */}
          {trazado.campo ? (
            <G>
              <Path d={trazado.campo} stroke={PAISAJE.arcen} strokeWidth={CALZADA.campo + 14} fill="none" />
              <Path d={trazado.campo} stroke={PAISAJE.lineaBorde} strokeWidth={CALZADA.campo + 4} fill="none" />
              <Path d={trazado.campo} stroke={PAISAJE.asfalto} strokeWidth={CALZADA.campo} fill="none" />
            </G>
          ) : null}
          {trazado.ciudad ? (
            <G>
              <Path d={trazado.ciudad} stroke={PAISAJE.acera} strokeWidth={CALZADA.ciudad + 30} fill="none" />
              <Path d={trazado.ciudad} stroke={PAISAJE.bordillo} strokeWidth={CALZADA.ciudad + 6} fill="none" />
              <Path d={trazado.ciudad} stroke={PAISAJE.asfaltoCiudad} strokeWidth={CALZADA.ciudad} fill="none" />
            </G>
          ) : null}
          {pasos}

          {/* Línea central: azul en la parte del camino ya recorrida */}
          {puntos.slice(0, -1).map((p, i) => (
            <Path
              key={`l${i}`}
              d={`M${p.x},${p.y}${curva(p, puntos[i + 1])}`}
              stroke={recorrido(i + 1) ? colores.acento : PAISAJE.lineaCentral}
              strokeOpacity={recorrido(i + 1) ? 1 : 0.7}
              strokeWidth={3}
              strokeDasharray="14 12"
              fill="none"
            />
          ))}

          {/* Pórticos de los carteles de tramo */}
          {elementos.map((e) =>
            e.tipo === 'cartel' ? (
              <G key={`p${e.t}`}>
                <Rect x={W / 2 - 150} y={centro(e) - 8} width={6} height={56} fill={PAISAJE.farola} />
                <Rect x={W / 2 + 144} y={centro(e) - 8} width={6} height={56} fill={PAISAJE.farola} />
              </G>
            ) : null,
          )}

          {elementos.map((e) =>
            e.tipo === 'entrada' ? (
              <G key="entrada">
                <EntradaPoblado x={W / 2 - CALZADA.ciudad / 2 - 60} y={centro(e) + 36} nombre="CIUDAD" />
                <Casa x={W / 2 + CALZADA.ciudad / 2 + 52} y={centro(e) + 30} s={1.2} />
                <Arbol x={W / 2 + CALZADA.ciudad / 2 + 100} y={e.y + 30} s={0.8} />
                <Farola x={W / 2 + CALZADA.ciudad / 2 + 18} y={centro(e) + 46} v={-1} />
              </G>
            ) : e.tipo === 'meta' ? (
              <G key="meta">
                <Meta x={W / 2} y={centro(e) - 4} w={CALZADA.ciudad} />
                <Edificio x={W / 2 - 120} y={e.y + ALTO.meta} w={44} h={100} semilla={7} />
                <Edificio x={W / 2 + 118} y={e.y + ALTO.meta} w={40} h={84} semilla={8} />
              </G>
            ) : null,
          )}
          <Rect x={0} y={0} width={W} height={40} fill="url(#fundido)" />
        </Svg>
      </View>

      {/* Carteles de tramo, como señales de orientación sobre la calzada */}
      {elementos.map((e) =>
        e.tipo === 'cartel' ? (
          <View
            key={`c${e.t}`}
            style={[styles.cartel, { top: centro(e) - 40, left: W / 2 - 150, width: 300 }]}
            testID={`tramo-${e.tramo.id}`}
            accessibilityRole="header"
          >
            <Text style={styles.cartelTramo}>{`Tramo ${e.t + 1}`}</Text>
            <Text style={styles.cartelTitulo} numberOfLines={2}>
              {e.tramo.titulo}
            </Text>
            {esPrevisto(e.tramo) ? <Text style={styles.cartelProximamente}>Próximamente</Text> : null}
          </View>
        ) : e.tipo === 'meta' ? (
          <View key="meta" style={[styles.meta, { top: centro(e) + 16 }]}>
            <Icono nombre="flag" color={colores.texto} tam={18} />
            <Text style={[texto.suave, { color: colores.texto }]}>Fin del camino de la demo</Text>
          </View>
        ) : null,
      )}

      {/* Niveles */}
      {elementos.map((e, i) => {
        if (e.tipo !== 'nivel') return null;
        const p = puntos[i + 1];
        const estado = estadoDe(e);
        const esActual = actual?.id === e.nivel.id;
        const tam = esActual ? NODO_ACTUAL : NODO;
        const previsto = estado === 'previsto';
        const titulo = previsto ? `Nivel ${e.nivel.numero}` : `Nivel ${e.nivel.numero} · ${(e.nivel as Nivel).titulo}`;
        const detalle = previsto ? 'Preguntas en preparación' : `${(e.nivel as Nivel).preguntas.length} preguntas`;
        const izq = e.lado === 'izq';
        const posicion = izq ? { left: p.x - tam / 2, right: espacio.m } : { left: espacio.m, right: W - (p.x + tam / 2) };
        return (
          <Pressable
            key={e.nivel.id}
            accessibilityRole="button"
            accessibilityLabel={`Tramo ${e.t + 1}, ${e.tramo.titulo}. ${titulo}. ${TEXTO_ESTADO[estado]}`}
            accessibilityState={{ disabled: estado === 'bloqueado' || previsto }}
            testID={`nivel-${e.nivel.id}`}
            onPress={() => pulsar(e)}
            style={[styles.fila, posicion, { top: p.y - 44, flexDirection: izq ? 'row' : 'row-reverse' }]}
          >
            <View
              style={[
                styles.nodo,
                { width: tam, height: tam, borderRadius: tam / 2 },
                estado === 'completado' && styles.nodoCompletado,
                esActual && styles.nodoActual,
                estado === 'bloqueado' && styles.nodoBloqueado,
                previsto && styles.nodoPrevisto,
              ]}
            >
              <Icono
                nombre={ICONO[estado]}
                tam={esActual ? 30 : 24}
                color={esActual ? colores.sobreAcento : estado === 'bloqueado' || previsto ? colores.textoTenue : colores.texto}
              />
            </View>
            <View style={[styles.etiqueta, { alignItems: izq ? 'flex-start' : 'flex-end' }]}>
              <Text
                style={[texto.cuerpo, styles.etiquetaTitulo, (estado === 'bloqueado' || previsto) && { color: colores.textoSuave }, !izq && { textAlign: 'right' }]}
                numberOfLines={2}
              >
                {titulo}
              </Text>
              <Text style={[styles.estadoTexto, esActual && { color: colores.acento }, !izq && { textAlign: 'right' }]}>
                <Text testID={`estado-${e.nivel.id}`}>{TEXTO_ESTADO[estado]}</Text>
                <Text style={styles.detalle}>{` · ${detalle}`}</Text>
              </Text>
            </View>
          </Pressable>
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
  camino: { marginHorizontal: -espacio.l, overflow: 'hidden' },
  cartel: {
    position: 'absolute',
    minHeight: 64,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s,
    borderRadius: radio.s,
    backgroundColor: colores.acentoRelleno,
    borderWidth: 2,
    borderColor: colores.texto,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  cartelTramo: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' },
  cartelTitulo: { fontSize: 18, fontWeight: '800', color: colores.sobreAcento, textAlign: 'center' },
  cartelProximamente: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '800',
    color: colores.acentoRelleno,
    backgroundColor: colores.texto,
    paddingHorizontal: espacio.s,
    paddingVertical: 1,
    borderRadius: radio.total,
    overflow: 'hidden',
  },
  meta: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: espacio.xs },
  fila: { position: 'absolute', height: 88, alignItems: 'center', gap: espacio.m },
  nodo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.superficieAlta,
    borderWidth: 3,
    borderColor: colores.bordeFuerte,
  },
  nodoCompletado: { borderColor: colores.acierto, backgroundColor: colores.superficie },
  nodoActual: { backgroundColor: colores.acentoRelleno, borderColor: colores.acento, borderWidth: 4 },
  nodoBloqueado: { borderWidth: 2, borderColor: colores.bordeFuerte, backgroundColor: colores.fondo },
  nodoPrevisto: { borderWidth: 2, borderColor: colores.borde, backgroundColor: colores.superficie },
  etiqueta: {
    flexShrink: 1,
    gap: 2,
    paddingHorizontal: espacio.s,
    paddingVertical: 6,
    borderRadius: radio.s,
    backgroundColor: 'rgba(11,11,12,0.8)',
  },
  etiquetaTitulo: { fontWeight: '700', fontSize: 15, lineHeight: 20 },
  estadoTexto: { fontSize: 13, fontWeight: '700', color: colores.textoSuave },
  detalle: { fontWeight: '400', color: colores.textoSuave },
});
