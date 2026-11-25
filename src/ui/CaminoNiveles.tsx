import { router, useIsFocused } from 'expo-router';
import { memo, useMemo, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { camino, esPrevisto, niveles, tituloNivel, type Nivel, type NivelPrevisto, type TramoCamino } from '@/content';
import { estadosNiveles, nivelActual, nivelQueFalta, type EstadoNivel } from '@/domain/niveles';
import { useDatos } from '@/store/useDatos';
import { Coche, muestrearRecorrido, posicionEnY } from './Coche';
import { Dialogo, Icono } from './componentes';
import {
  azar,
  BIOMAS,
  CartelOrientacion,
  componerPaisaje,
  EntradaPoblado,
  FinPoblado,
  Mar,
  Meta,
  PAISAJE,
  PasoPeatones,
  PiezaPaisaje,
  Rio,
  Tunel,
  type BiomaId,
  type Zona,
  type ZonaBioma,
} from './Paisaje';
import { colores, radio } from './tema';

const NODO = 58;
const NODO_ACTUAL = 70;
/** Altura de cada elemento del camino. */
const ALTO = { cartel: 96, nivel: 118, entrada: 110, salida: 96, meta: 90, tunel: 170 } as const;
/** Dentro del elemento túnel: altura de la cresta y de la boca de salida. */
const TUNEL_ENTRE = { cima: 14, boca: 132 } as const;
/** Altura de la ladera con el túnel del principio y altura de su boca. */
const TUNEL = { alto: 128, boca: 104 } as const;
/** Medio ancho de la calzada y de lo que ocupa con arcén o acera. */
const CALZADA = { campo: 54, ciudad: 64 } as const;
const OCUPA = { campo: CALZADA.campo / 2 + 7, ciudad: CALZADA.ciudad / 2 + 15 } as const;
/** Un bioma por tramo, en el orden del camino; si hubiera más tramos, se repiten. */
const BIOMA_DE_TRAMO: BiomaId[] = [
  'prado',
  'bosque',
  'cultivo',
  'pueblo',
  'ciudad',
  'industrial',
  'costa',
  'olivar',
  'montana',
  'vinedo',
  'rio',
  'desierto',
  'nieve',
  'naranjal',
  'renovables',
];
const biomaDe = (t: number) => BIOMA_DE_TRAMO[t % BIOMA_DE_TRAMO.length];
/** Nombres en las señales de población. */
const NOMBRE_PUEBLO = 'VILLARRANCA';
const NOMBRE_CIUDAD = 'CIUDAD';
const CARTEL = { ancho: 150, alto: 60 } as const;
const ENSANCHE = 30;
/** Altura de cada trozo de SVG: un único lienzo de miles de px es demasiado grande en Android. */
const TROZO = 720;
/** El coche para un poco antes del nivel siguiente. */
const PARADA_COCHE = 46;

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
  | { tipo: 'nivel'; y: number; tramo: TramoCamino; t: number; nivel: Nivel | NivelPrevisto; previsto: boolean; k: number }
  | { tipo: 'entrada'; y: number; t: number }
  | { tipo: 'salida'; y: number; t: number }
  | { tipo: 'meta'; y: number }
  | { tipo: 'tunel'; y: number; t: number };
type ElementoNivel = Extract<Elemento, { tipo: 'nivel' }>;

const centro = (e: Elemento) => e.y + ALTO[e.tipo] / 2;

/** Coloca los elementos del camino de arriba abajo y la franja de bioma de cada tramo. */
function trazar() {
  const elementos: Elemento[] = [];
  const zonas: ZonaBioma[] = [];
  let y = TUNEL.alto;
  let k = 0;
  camino.forEach((tramo, t) => {
    const bioma = biomaDe(t);
    const urbano = !!BIOMAS[bioma].urbano;
    let y0 = 0;
    // Entre dos tramos, la carretera atraviesa un túnel: el bioma cambia bajo la montaña.
    if (t > 0) {
      elementos.push({ tipo: 'tunel', y, t });
      y0 = y + ALTO.tunel / 2;
      zonas[zonas.length - 1].y1 = y0;
      y += ALTO.tunel;
    }
    // Las ciudades tienen entrada y salida en tramos rectos, donde la calzada cambia de anchura.
    if (urbano && t > 0 && !BIOMAS[biomaDe(t - 1)].urbano) {
      elementos.push({ tipo: 'entrada', y, t });
      y += ALTO.entrada;
    }
    elementos.push({ tipo: 'cartel', y, tramo, t });
    y += ALTO.cartel;
    // Primero los niveles con preguntas y después los que aún están en preparación.
    const lista: { nivel: Nivel | NivelPrevisto; previsto: boolean }[] = esPrevisto(tramo)
      ? tramo.niveles.map((nivel) => ({ nivel, previsto: true }))
      : [...tramo.niveles.map((nivel) => ({ nivel, previsto: false })), ...(tramo.previstos ?? []).map((nivel) => ({ nivel, previsto: true }))];
    for (const { nivel, previsto } of lista) {
      elementos.push({ tipo: 'nivel', y, tramo, t, nivel, previsto, k });
      y += ALTO.nivel;
      k++;
    }
    if (urbano && t < camino.length - 1 && !BIOMAS[biomaDe(t + 1)].urbano) {
      elementos.push({ tipo: 'salida', y, t });
      y += ALTO.salida;
    }
    zonas.push({ y0, y1: y, bioma });
  });
  elementos.push({ tipo: 'meta', y });
  y += ALTO.meta;
  zonas[zonas.length - 1].y1 = y;
  return { elementos, zonas, total: y };
}

/** Curva entre dos puntos con tangentes verticales en ambos extremos. */
function curva(a: { x: number; y: number }, b: { x: number; y: number }) {
  const m = (a.y + b.y) / 2;
  return `C${a.x},${m} ${b.x},${m} ${b.x},${b.y}`;
}

/** Ángulo (grados) de la carretera en la mitad de la curva entre a y b. */
const anguloMitad = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  (Math.atan2(0.75 * (b.y - a.y), 1.5 * (b.x - a.x)) * 180) / Math.PI;

/** Elemento de dibujo con la franja vertical que ocupa, para repartirlo entre trozos. */
interface Capa {
  y0: number;
  y1: number;
  nodo: ReactNode;
}

/** Un trozo del fondo: un SVG de altura TROZO que solo dibuja las capas que lo tocan. */
const Trozo = memo(function Trozo({ y0, alto, W, capas, defs }: { y0: number; alto: number; W: number; capas: Capa[]; defs: ReactNode }) {
  const visibles = capas.filter((c) => c.y1 >= y0 - 2 && c.y0 <= y0 + alto + 2);
  return (
    <Svg width={W} height={alto} viewBox={`0 ${y0} ${W} ${alto}`} style={{ position: 'absolute', left: 0, top: y0 }}>
      <Defs>{defs}</Defs>
      {visibles.map((c) => c.nodo)}
    </Svg>
  );
});

/**
 * Camino de niveles con forma de carretera: sale de un túnel y cruza un bioma por tramo.
 * Los niveles son los protagonistas: el paisaje, en tonos apagados, se reparte alrededor sin
 * patrones fijos, y el texto se limita a los carteles de tramo y al nivel actual. Un coche
 * azul claro avanza por la carretera hasta el nivel que toca.
 */
export function CaminoNiveles() {
  const { width: anchoVentana } = useWindowDimensions();
  const enPantalla = useIsFocused();
  const [ancho, setAncho] = useState(0);
  const W = Math.round(ancho || anchoVentana);
  const completados = useDatos((s) => s.completados);
  const estados = estadosNiveles(niveles, completados);
  const actual = nivelActual(niveles, completados);
  const hayCompletados = niveles.some((n) => completados[n.id]);
  const [aviso, setAviso] = useState<{ tipo: 'bloqueado'; nivel: Nivel; falta?: Nivel } | { tipo: 'previsto'; tramo: TramoCamino } | null>(null);

  const { elementos, zonas, total } = useMemo(trazar, []);

  // Geometría, paisaje y capas estáticas: solo dependen del ancho.
  const escena = useMemo(() => {
    // Zigzag con amplitud algo irregular para que no parezca dibujado con plantilla.
    const xDe = (e: Elemento) => {
      if (e.tipo !== 'nivel') return W / 2;
      const b = BIOMAS[biomaDe(e.t)];
      const amplitud = (0.17 + azar(e.k * 3 + 2) * 0.06) * (b.amplitud ?? 1);
      return W * ((b.centro ?? 0.5) + (e.k % 2 === 0 ? -amplitud : amplitud));
    };
    const puntos = [{ x: W / 2, y: TUNEL.boca }, ...elementos.map((e) => ({ x: xDe(e), y: centro(e) })), { x: W / 2, y: total }];
    const indiceDe = (e: Elemento) => elementos.indexOf(e) + 1;
    const zonaDe = (y: number) => zonas.find((z) => y >= z.y0 && y < z.y1) ?? zonas[zonas.length - 1];
    const urbano = (y: number) => !!BIOMAS[zonaDe(y).bioma].urbano;

    // Carteles de tramo junto a la calzada, alternando lado.
    const carteles = elementos.flatMap((e) => {
      if (e.tipo !== 'cartel') return [];
      const izq = e.t % 2 === 0;
      const x = izq ? W / 2 - OCUPA.campo - 14 - CARTEL.ancho : W / 2 + OCUPA.campo + 14;
      return [{ e, x, y: centro(e) - CARTEL.alto / 2 - 10 }];
    });

    // Señales de población junto a la calzada, en el lado contrario al cartel del tramo.
    const senales: { tipo: 'entrada' | 'fin'; nombre: string; x: number; y: number }[] = [];
    for (const e of elementos) {
      if (e.tipo === 'cartel' && biomaDe(e.t) === 'pueblo') {
        senales.push({ tipo: 'entrada', nombre: NOMBRE_PUEBLO, x: e.t % 2 === 0 ? W / 2 + OCUPA.campo + 58 : W / 2 - OCUPA.campo - 58, y: centro(e) + 30 });
      }
      if (e.tipo === 'salida') senales.push({ tipo: 'fin', nombre: NOMBRE_CIUDAD, x: W / 2 - OCUPA.ciudad - 46, y: centro(e) + 30 });
    }

    // Elementos de fondo propios de algunos biomas: el mar en un lateral y un río con puente.
    const especiales: Capa[] = [];
    const reservasAgua: Zona[] = [];
    zonas.forEach((z) => {
      const b = BIOMAS[z.bioma];
      if (b.especial === 'mar') {
        // La playa ocupa el lateral derecho de todo el bioma: empieza justo bajo la falda de la
        // cordillera de arriba y se pierde por detrás de la siguiente. La carretera va hacia el interior.
        const niv = elementos.filter((e): e is ElementoNivel => e.tipo === 'nivel' && e.y >= z.y0 && e.y < z.y1);
        if (niv.length) {
          const tunelAntes = elementos.filter((e) => e.tipo === 'tunel' && e.y < z.y0).pop();
          const tunelDespues = elementos.find((e) => e.tipo === 'tunel' && e.y >= z.y0);
          const y0 = tunelAntes ? tunelAntes.y + TUNEL_ENTRE.boca - 26 : z.y0;
          const y1 = tunelDespues ? tunelDespues.y + TUNEL_ENTRE.cima + 44 : z.y1;
          const bordeCarretera = Math.max(...niv.map((e) => puntos[indiceDe(e)].x)) + OCUPA.campo;
          const xArena = Math.max(bordeCarretera + 18, W * 0.6);
          const xAgua = Math.max(xArena + 44, W * 0.79);
          especiales.push({ y0, y1, nodo: <Mar key={`mar${z.y0}`} y0={y0} y1={y1} xArena={xArena} xAgua={xAgua} W={W} /> });
          reservasAgua.push({ x0: xArena - 16, y0: y0 - 16, x1: W, y1: y1 + 16 });
        }
      }
      if (b.especial === 'rio') {
        const niv = elementos.filter((e): e is ElementoNivel => e.tipo === 'nivel' && e.y >= z.y0 && e.y < z.y1);
        if (niv.length >= 3) {
          const a = puntos[indiceDe(niv[1])];
          const c = puntos[indiceDe(niv[2])];
          const y = (a.y + c.y) / 2;
          especiales.push({
            y0: y - 30,
            y1: y + 30,
            nodo: <Rio key={`rio${z.y0}`} y={y} W={W} xPuente={(a.x + c.x) / 2} grados={anguloMitad(a, c)} anchoCalzada={CALZADA.campo} />,
          });
          reservasAgua.push({ x0: 0, y0: y - 34, x1: W, y1: y + 30 });
        }
      }
    });

    const reservas: Zona[] = [
      { x0: 0, y0: 0, x1: W, y1: TUNEL.alto },
      ...reservasAgua,
      ...senales.map((s) => ({ x0: s.x - 52, y0: s.y - 64, x1: s.x + 52, y1: s.y + 6 })),
      // Alrededor de cada nivel, incluida la pastilla del nivel actual.
      ...elementos.flatMap((e, i) =>
        e.tipo === 'nivel' ? [{ x0: puntos[i + 1].x - 56, y0: puntos[i + 1].y - 50, x1: puntos[i + 1].x + 56, y1: puntos[i + 1].y + 70 }] : [],
      ),
      ...carteles.map((c) => ({ x0: c.x - 6, y0: c.y - 6, x1: c.x + CARTEL.ancho + 6, y1: c.y + CARTEL.alto + 34 })),
      ...elementos
        .filter((e) => e.tipo === 'entrada' || e.tipo === 'salida' || e.tipo === 'meta')
        .map((e) => ({ x0: 0, y0: e.y, x1: W, y1: e.y + ALTO[e.tipo] })),
      // Túneles: la cordillera y un margen bajo la boca.
      ...elementos.filter((e) => e.tipo === 'tunel').map((e) => ({ x0: 0, y0: e.y, x1: W, y1: e.y + TUNEL_ENTRE.boca + 12 })),
    ];
    const piezas = componerPaisaje({ ancho: W, alto: total, puntos, medio: OCUPA, reservas, zonas });

    const capas: Capa[] = [];
    // Fondo de cada bioma: el cambio queda bajo la cordillera del túnel.
    zonas.forEach((z, i) => {
      capas.push({ y0: z.y0, y1: z.y1, nodo: <Rect key={`f${i}`} x={0} y={z.y0} width={W} height={z.y1 - z.y0} fill={BIOMAS[z.bioma].fondo} /> });
    });
    capas.push(...especiales);

    // Calzada, tramo a tramo: con arcén en el campo y con aceras en la ciudad.
    for (let i = 0; i < puntos.length - 1; i++) {
      const a = puntos[i];
      const b = puntos[i + 1];
      const e = elementos[i - 1];
      const ciudad = urbano(a.y) && e?.tipo !== 'salida';
      // En la entrada y la salida, la calzada cambia de anchura en un tramo recto.
      const d = e?.tipo === 'entrada' || e?.tipo === 'salida' ? `M${a.x},${a.y + ENSANCHE}L${b.x},${b.y}` : `M${a.x},${a.y}${curva(a, b)}`;
      const capasCalzada = ciudad
        ? [
            [PAISAJE.acera, CALZADA.ciudad + 30, 1],
            [PAISAJE.bordillo, CALZADA.ciudad + 4, 1],
            [PAISAJE.asfaltoCiudad, CALZADA.ciudad, 1],
          ]
        : [
            [PAISAJE.arcen, CALZADA.campo + 14, 1],
            [PAISAJE.lineaBorde, CALZADA.campo + 3, 0.55],
            [PAISAJE.asfalto, CALZADA.campo, 1],
          ];
      capas.push({
        y0: a.y - 10,
        y1: b.y + 10,
        nodo: (
          <G key={`c${i}`}>
            {capasCalzada.map(([color, grosor, opacidad]) => (
              <Path key={`${color}`} d={d} stroke={color as string} strokeOpacity={opacidad as number} strokeWidth={grosor as number} fill="none" />
            ))}
          </G>
        ),
      });
      if (e?.tipo === 'entrada' || e?.tipo === 'salida') {
        const [w0, w1] = e.tipo === 'entrada' ? ['campo', 'ciudad'] : ['ciudad', 'campo'];
        const ancho = (t: string, extra: { campo: number; ciudad: number }) => (t === 'campo' ? CALZADA.campo + extra.campo : CALZADA.ciudad + extra.ciudad);
        capas.push({
          y0: a.y,
          y1: a.y + ENSANCHE,
          nodo: (
            <G key={`tr${i}`}>
              <Path d={trapecio(a.x, a.y, ancho(w0, { campo: 14, ciudad: 30 }), ancho(w1, { campo: 14, ciudad: 30 }))} fill={e.tipo === 'entrada' ? PAISAJE.acera : PAISAJE.arcen} />
              <Path d={trapecio(a.x, a.y, ancho(w0, { campo: 3, ciudad: 4 }), ancho(w1, { campo: 3, ciudad: 4 }))} fill={PAISAJE.bordillo} />
              <Path d={trapecio(a.x, a.y, ancho(w0, { campo: 0, ciudad: 0 }), ancho(w1, { campo: 0, ciudad: 0 }))} fill={PAISAJE.asfaltoCiudad} />
            </G>
          ),
        });
      }
    }

    // Un paso de peatones por tramo de pueblo o ciudad, en mitad de su primera curva.
    elementos.forEach((e, i) => {
      if (e.tipo !== 'cartel') return;
      const b = BIOMAS[biomaDe(e.t)];
      if (b.junto !== 'casaPueblo' && b.junto !== 'edificio') return;
      const a = puntos[i + 2];
      const c = puntos[i + 3];
      if (!a || !c) return;
      const y = (a.y + c.y) / 2;
      capas.push({
        y0: y - 40,
        y1: y + 40,
        nodo: (
          <PasoPeatones key={`pp${i}`} x={(a.x + c.x) / 2} y={y} grados={anguloMitad(a, c)} ancho={(b.urbano ? CALZADA.ciudad : CALZADA.campo) - 10} />
        ),
      });
    });

    return { puntos, carteles, piezas, capas, senales, indiceDe };
  }, [W, elementos, zonas, total]);

  const { puntos } = escena;
  const indiceActual = actual ? elementos.findIndex((e) => e.tipo === 'nivel' && e.nivel.id === actual.id) + 1 : puntos.length;
  // Lo recorrido empieza en el primer tramo con preguntas: los previstos no se han hecho.
  const inicioRecorrido = elementos.findIndex((e) => e.tipo === 'cartel' && !esPrevisto(e.tramo)) + 1;
  const recorrido = (fin: number) => fin > inicioRecorrido && fin <= indiceActual;

  // Capas que cambian con el progreso: la línea central y, por encima, el paisaje y las señales.
  const capasDinamicas = useMemo(() => {
    const capas: Capa[] = puntos.slice(0, -1).map((p, i) => ({
      y0: p.y,
      y1: puntos[i + 1].y,
      nodo: (
        <Path
          key={`l${i}`}
          d={`M${p.x},${p.y}${curva(p, puntos[i + 1])}`}
          stroke={recorrido(i + 1) ? colores.acento : PAISAJE.lineaCentral}
          strokeOpacity={recorrido(i + 1) ? 1 : 0.45}
          strokeWidth={recorrido(i + 1) ? 3 : 2}
          strokeDasharray="12 12"
          fill="none"
        />
      ),
    }));
    return capas;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puntos, indiceActual, inicioRecorrido]);

  const capasSuperiores = useMemo(() => {
    // Paisaje y cordilleras de los túneles, ordenados por profundidad (la base más baja, delante).
    const porProfundidad: { base: number; capa: Capa }[] = escena.piezas.map((p, i) => ({
      base: p.y,
      capa: { y0: p.y - 130, y1: p.y + 10, nodo: <PiezaPaisaje key={`z${i}`} p={p} /> },
    }));
    elementos.forEach((e) => {
      if (e.tipo !== 'tunel') return;
      porProfundidad.push({
        base: e.y + TUNEL_ENTRE.boca,
        capa: {
          y0: e.y,
          y1: e.y + TUNEL_ENTRE.boca + 6,
          nodo: (
            <Tunel key={`tunel${e.t}`} x={W / 2} yBoca={e.y + TUNEL_ENTRE.boca} cima={e.y + TUNEL_ENTRE.cima} ancho={CALZADA.campo} W={W} semilla={e.t} />
          ),
        },
      });
    });
    const capas: Capa[] = porProfundidad.sort((a, b) => a.base - b.base).map((p) => p.capa);
    escena.carteles.forEach(({ e, x, y }) =>
      capas.push({
        y0: y,
        y1: y + CARTEL.alto + 30,
        nodo: (
          <G key={`poste${e.t}`}>
            <Rect x={x + 22} y={y + CARTEL.alto - 2} width={3} height={30} fill={PAISAJE.farola} />
            <Rect x={x + CARTEL.ancho - 25} y={y + CARTEL.alto - 2} width={3} height={30} fill={PAISAJE.farola} />
          </G>
        ),
      }),
    );
    escena.senales.forEach((s, i) =>
      capas.push({
        y0: s.y - 60,
        y1: s.y + 2,
        nodo:
          s.tipo === 'entrada' ? (
            <EntradaPoblado key={`s${i}`} x={s.x} y={s.y} nombre={s.nombre} />
          ) : (
            <FinPoblado key={`s${i}`} x={s.x} y={s.y} nombre={s.nombre} />
          ),
      }),
    );
    elementos.forEach((e) => {
      if (e.tipo === 'entrada') {
        capas.push({
          y0: e.y,
          y1: e.y + ALTO.entrada,
          nodo: (
            <CartelOrientacion
              key={`entrada${e.t}`}
              x={W / 2}
              y={e.y + 6}
              ySuelo={e.y + ALTO.entrada - 4}
              ruta={`T-${e.t + 1}`}
              nombre="Ciudad"
              separacion={CALZADA.ciudad + 44}
            />
          ),
        });
      }
      if (e.tipo === 'meta') capas.push({ y0: e.y, y1: e.y + ALTO.meta, nodo: <Meta key="meta" x={W / 2} y={centro(e)} w={CALZADA.campo} /> });
    });
    capas.push({ y0: 0, y1: TUNEL.alto, nodo: <Tunel key="tunel" x={W / 2} yBoca={TUNEL.boca} ancho={CALZADA.campo} W={W} /> });
    capas.push({ y0: 0, y1: 36, nodo: <Rect key="fundido" x={0} y={0} width={W} height={36} fill="url(#fundidoSuperior)" /> });
    return capas;
  }, [escena, elementos, W]);

  const defs = useMemo(
    () => (
      <>
        <LinearGradient id="fundidoSuperior" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={colores.fondo} stopOpacity={1} />
          <Stop offset="1" stopColor={colores.fondo} stopOpacity={0} />
        </LinearGradient>
      </>
    ),
    [],
  );

  const capas = useMemo(() => [...escena.capas, ...capasDinamicas, ...capasSuperiores], [escena.capas, capasDinamicas, capasSuperiores]);
  const trozos = useMemo(() => Array.from({ length: Math.ceil(total / TROZO) }, (_, i) => i * TROZO), [total]);

  // Coche: arranca a la salida del túnel y, tras completar niveles, para justo antes del siguiente.
  // Dentro de los túneles el coche no se ve.
  const rutaCoche = useMemo(() => {
    const ocultos: [number, number][] = [
      [-Infinity, TUNEL.boca - 4],
      ...elementos.filter((e) => e.tipo === 'tunel').map((e) => [e.y + TUNEL_ENTRE.cima + 10, e.y + TUNEL_ENTRE.boca - 8] as [number, number]),
    ];
    return muestrearRecorrido(puntos, 11, ocultos);
  }, [puntos, elementos]);
  const destinoCoche = useMemo(() => {
    if (!hayCompletados) return 26;
    const i = actual ? elementos.findIndex((e) => e.tipo === 'nivel' && e.nivel.id === actual.id) : -1;
    const y = i >= 0 ? puntos[i + 1].y : total - ALTO.meta / 2;
    return Math.max(26, posicionEnY(rutaCoche, y) - PARADA_COCHE);
  }, [hayCompletados, actual, elementos, puntos, rutaCoche, total]);

  const estadoDe = (e: ElementoNivel): EstadoCamino => (e.previsto ? 'previsto' : estados[e.nivel.id]);

  const pulsar = (e: ElementoNivel) => {
    if (e.previsto) {
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
        {trozos.map((y0) => (
          <Trozo key={y0} y0={y0} alto={Math.min(TROZO, total - y0)} W={W} capas={capas} defs={defs} />
        ))}
      </View>

      <Coche recorrido={rutaCoche} destino={destinoCoche} activo={enPantalla} />

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
            <Text style={[styles.cartelTitulo, previsto && { color: colores.textoSuave }]} numberOfLines={3}>
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
        titulo={aviso?.tipo === 'previsto' ? 'Nivel en preparación' : 'Nivel bloqueado'}
        mensaje={
          aviso?.tipo === 'previsto'
            ? `Este nivel de «${aviso.tramo.titulo}» todavía no tiene preguntas.${actual ? ` Mientras tanto, sigue con «${tituloNivel(actual)}».` : ''}`
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
  cartelTitulo: { flex: 1, fontSize: 12.5, lineHeight: 16, fontWeight: '700', color: colores.sobreAcento },
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
