import { router, useNavigation, usePreventRemove } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { REGLAS, temas, type Pregunta } from '@/content';
import { corregirSimulacro, formatoTiempo, generarSimulacro } from '@/domain/simulacro';
import { nuevoId, useDatos } from '@/store/useDatos';
import { Boton, Cabecera, Dialogo, Icono, Pantalla } from '@/ui/componentes';
import { PreguntaVista } from '@/ui/PreguntaVista';
import { colores, espacio, radio, texto } from '@/ui/tema';

const { preguntas: NUM_PREGUNTAS, segundos: SEGUNDOS, maxFallos: MAX_FALLOS } = REGLAS.simulacro;

export default function Simulacro() {
  const guardar = useDatos((s) => s.guardarSimulacro);
  const navigation = useNavigation();
  const [preguntas] = useState<Pregunta[]>(() =>
    generarSimulacro(
      temas.map((t) => t.niveles.flatMap((n) => n.preguntas)),
      Math.ceil(NUM_PREGUNTAS / temas.length),
    ).slice(0, NUM_PREGUNTAS),
  );
  const fin = useRef(Date.now() + SEGUNDOS * 1000).current;
  const [restante, setRestante] = useState<number>(SEGUNDOS);
  const [indice, setIndice] = useState(0);
  const [elecciones, setElecciones] = useState<Record<string, number>>({});
  const [entregadoId, setEntregadoId] = useState<string>();
  const [confirmarEntrega, setConfirmarEntrega] = useState(false);
  const [salida, setSalida] = useState<{ accion: unknown } | null>(null);

  const [saliendo, setSaliendo] = useState<{ accion: unknown } | null>(null);

  usePreventRemove(!entregadoId && !saliendo, ({ data }) => setSalida({ accion: data.action }));

  // Primero se desactiva el bloqueo y, ya renderizado, se repite la navegación.
  useEffect(() => {
    if (saliendo) navigation.dispatch(saliendo.accion as never);
  }, [saliendo, navigation]);

  const entregar = useCallback(
    (porTiempo: boolean) => {
      if (entregadoId) return;
      const correccion = corregirSimulacro(preguntas, elecciones, MAX_FALLOS);
      const id = nuevoId();
      guardar({ id, fecha: Date.now(), porTiempo, ...correccion });
      setConfirmarEntrega(false);
      setSalida(null);
      setEntregadoId(id);
    },
    [entregadoId, preguntas, elecciones, guardar],
  );

  // Temporizador: se calcula con la hora de fin para no acumular desfases.
  useEffect(() => {
    if (entregadoId) return;
    const t = setInterval(() => {
      const s = (fin - Date.now()) / 1000;
      setRestante(Math.max(0, s));
    }, 250);
    return () => clearInterval(t);
  }, [fin, entregadoId]);

  useEffect(() => {
    if (restante <= 0 && !entregadoId) entregar(true);
  }, [restante, entregadoId, entregar]);

  // Navegar al resultado cuando ya no se bloquea la salida.
  useEffect(() => {
    if (entregadoId) router.replace({ pathname: '/resultado/[id]', params: { id: entregadoId } });
  }, [entregadoId]);

  const pregunta = preguntas[indice];
  const sinResponder = preguntas.filter((p) => elecciones[p.id] === undefined).length;
  const poco = restante <= 30;

  return (
    <Pantalla
      testID="pantalla-simulacro"
      cabecera={
        <View style={{ paddingBottom: espacio.s, gap: espacio.s }}>
          <Cabecera
            titulo="Simulacro de demostración"
            iconoAtras="close"
            derecha={
              <View style={[styles.reloj, poco && { borderColor: colores.acento }]} accessibilityLabel={`Tiempo restante ${formatoTiempo(restante)}`}>
                <Icono nombre="timer-outline" tam={16} color={poco ? colores.acento : colores.textoSuave} />
                <Text style={[styles.relojTexto, poco && { color: colores.acento }]} testID="reloj">
                  {formatoTiempo(restante)}
                </Text>
              </View>
            }
          />
          <View style={styles.rejilla} accessibilityLabel="Preguntas del simulacro">
            {preguntas.map((p, i) => {
              const respondida = elecciones[p.id] !== undefined;
              const actual = i === indice;
              return (
                <Pressable
                  key={p.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Pregunta ${i + 1}, ${respondida ? 'respondida' : 'sin responder'}`}
                  accessibilityState={{ selected: actual }}
                  onPress={() => setIndice(i)}
                  testID={`ir-pregunta-${i}`}
                  style={[styles.celda, respondida && styles.celdaRespondida, actual && styles.celdaActual]}
                >
                  <Text style={[styles.celdaTexto, actual && { color: colores.texto }]}>{i + 1}</Text>
                  {respondida ? <View style={styles.punto} /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      }
      pie={
        <>
          <View style={{ flexDirection: 'row', gap: espacio.s }}>
            <Boton titulo="Anterior" variante="secundario" icono="chevron-back" desactivado={indice === 0} onPress={() => setIndice(indice - 1)} estilo={{ flex: 1 }} testID="anterior" />
            <Boton
              titulo="Siguiente"
              variante="secundario"
              icono="chevron-forward"
              desactivado={indice === preguntas.length - 1}
              onPress={() => setIndice(indice + 1)}
              estilo={{ flex: 1 }}
              testID="siguiente"
            />
          </View>
          <Boton titulo="Entregar" icono="send" onPress={() => setConfirmarEntrega(true)} testID="entregar" />
        </>
      }
    >
      <Text style={texto.suave} testID="posicion">{`Pregunta ${indice + 1} de ${preguntas.length} · ${preguntas.length - sinResponder} respondidas`}</Text>
      <PreguntaVista
        key={pregunta.id}
        pregunta={pregunta}
        elegida={elecciones[pregunta.id]}
        onElegir={(i) => setElecciones((e) => ({ ...e, [pregunta.id]: i }))}
      />

      <Dialogo
        visible={confirmarEntrega}
        titulo="¿Entregar el simulacro?"
        mensaje={sinResponder ? `Tienes ${sinResponder} pregunta${sinResponder === 1 ? '' : 's'} sin responder; contarán como fallo.` : 'Has respondido todas las preguntas.'}
        confirmar="Entregar"
        cancelar="Seguir revisando"
        onCancelar={() => setConfirmarEntrega(false)}
        onConfirmar={() => entregar(false)}
      />
      <Dialogo
        visible={!!salida}
        titulo="¿Abandonar el simulacro?"
        mensaje="No se guardará ningún resultado."
        confirmar="Abandonar"
        cancelar="Seguir"
        onCancelar={() => setSalida(null)}
        onConfirmar={() => {
          setSaliendo(salida);
          setSalida(null);
        }}
      />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  reloj: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: espacio.s,
    paddingVertical: 4,
    borderRadius: radio.total,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  relojTexto: { fontSize: 15, fontWeight: '700', color: colores.texto, fontVariant: ['tabular-nums'] },
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s, paddingHorizontal: espacio.l },
  celda: {
    width: 48,
    height: 48,
    borderRadius: radio.s,
    borderWidth: 1,
    borderColor: colores.borde,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.superficie,
  },
  celdaRespondida: { backgroundColor: colores.superficieAlta, borderColor: colores.bordeFuerte },
  celdaActual: { borderColor: colores.acento, borderWidth: 2 },
  celdaTexto: { fontSize: 15, fontWeight: '700', color: colores.textoSuave },
  punto: { position: 'absolute', bottom: 6, width: 5, height: 5, borderRadius: 3, backgroundColor: colores.texto },
});
