import { router, useNavigation, usePreventRemove } from 'expo-router';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Pregunta } from '@/content';
import { getPregunta } from '@/content';
import { nuevoId, useDatos } from '@/store/useDatos';
import { BarraProgreso, Boton, Cabecera, Dialogo, Icono, Pantalla } from './componentes';
import { PreguntaVista } from './PreguntaVista';
import { colores, espacio, radio, texto } from './tema';

export interface ResultadoSesion {
  aciertos: number;
  fallos: number;
  falladas: string[];
}

/**
 * Lección o repaso: preguntas de tres opciones, sin límite de tiempo.
 * Cada respuesta se guarda al pulsar «Comprobar», así los fallos llegan
 * a Mis errores aunque se cierre la app a mitad.
 */
export function SesionPractica({
  titulo,
  preguntas,
  origen,
  onTerminar,
  renderResumen,
}: {
  titulo: string;
  preguntas: Pregunta[];
  origen: 'leccion' | 'repaso';
  onTerminar?: (r: ResultadoSesion) => void;
  renderResumen: (r: ResultadoSesion) => ReactNode;
}) {
  const registrar = useDatos((s) => s.registrarRespuesta);
  const sesionId = useRef(nuevoId()).current;
  const [indice, setIndice] = useState(0);
  const [elegida, setElegida] = useState<number>();
  const [comprobada, setComprobada] = useState(false);
  const [falladas, setFalladas] = useState<string[]>([]);
  const [resultado, setResultado] = useState<ResultadoSesion>();
  const [salida, setSalida] = useState<{ accion: unknown } | null>(null);
  const navigation = useNavigation();

  const [saliendo, setSaliendo] = useState<{ accion: unknown } | null>(null);

  usePreventRemove(!resultado && !saliendo, ({ data }) => setSalida({ accion: data.action }));

  // Primero se desactiva el bloqueo y, ya renderizado, se repite la navegación.
  useEffect(() => {
    if (saliendo) navigation.dispatch(saliendo.accion as never);
  }, [saliendo, navigation]);

  const pregunta = preguntas[indice];
  const acierto = comprobada && elegida === pregunta?.correcta;

  if (resultado) {
    return (
      <Pantalla cabecera={<Cabecera titulo={titulo} iconoAtras="close" />} testID="resumen">
        {renderResumen(resultado)}
      </Pantalla>
    );
  }

  const comprobar = () => {
    if (elegida === undefined) return;
    const ok = elegida === pregunta.correcta;
    registrar(pregunta.id, ok, origen, sesionId);
    if (!ok) setFalladas((f) => [...f, pregunta.id]);
    setComprobada(true);
  };

  const continuar = () => {
    if (indice + 1 < preguntas.length) {
      setIndice(indice + 1);
      setElegida(undefined);
      setComprobada(false);
      return;
    }
    const r = { aciertos: preguntas.length - falladas.length, fallos: falladas.length, falladas };
    onTerminar?.(r);
    setResultado(r);
  };

  const capituloId = getPregunta(pregunta.id)?.tema.capituloId;

  return (
    <Pantalla
      testID="sesion"
      cabecera={
        <View style={styles.cabecera}>
          <Cabecera
            titulo={titulo}
            iconoAtras="close"
            derecha={<Text style={texto.suave} testID="contador">{`${indice + 1}/${preguntas.length}`}</Text>}
          />
          <View style={{ paddingHorizontal: espacio.l }}>
            <BarraProgreso
              valor={(indice + (comprobada ? 1 : 0)) / preguntas.length}
              etiqueta={`Pregunta ${indice + 1} de ${preguntas.length}`}
            />
          </View>
        </View>
      }
      pie={
        comprobada ? (
          <>
            <View style={styles.resultado} testID={acierto ? 'resultado-acierto' : 'resultado-fallo'} accessibilityLiveRegion="polite">
              <View style={styles.filaResultado}>
                <Icono nombre={acierto ? 'checkmark-circle' : 'close-circle'} color={acierto ? colores.acierto : colores.fallo} tam={26} />
                <Text style={texto.subtitulo}>{acierto ? 'Correcto' : 'Incorrecto'}</Text>
              </View>
              <Text style={texto.suave}>
                Respuesta correcta: <Text style={{ color: colores.texto, fontWeight: '700' }}>{pregunta.opciones[pregunta.correcta]}</Text>
              </Text>
              {!acierto ? <Text style={texto.cuerpo}>{pregunta.explicacion}</Text> : null}
              {capituloId ? (
                <Pressable
                  accessibilityRole="link"
                  testID="ver-temario"
                  onPress={() =>
                    router.push({ pathname: '/lectura/[capitulo]', params: { capitulo: capituloId, apartado: pregunta.apartado } })
                  }
                  style={styles.enlace}
                >
                  <Icono nombre="book-outline" color={colores.acento} tam={18} />
                  <Text style={styles.enlaceTexto}>Ver en el temario</Text>
                </Pressable>
              ) : null}
            </View>
            <Boton titulo={indice + 1 < preguntas.length ? 'Continuar' : 'Ver resumen'} onPress={continuar} testID="continuar" />
          </>
        ) : (
          <Boton titulo="Comprobar" onPress={comprobar} desactivado={elegida === undefined} testID="comprobar" />
        )
      }
    >
      <PreguntaVista key={pregunta.id} pregunta={pregunta} elegida={elegida} onElegir={setElegida} comprobada={comprobada} />
      <Dialogo
        visible={!!salida}
        titulo={origen === 'leccion' ? '¿Salir de la lección?' : '¿Salir del repaso?'}
        mensaje="Las respuestas ya comprobadas se han guardado. El nivel no contará como completado."
        confirmar="Salir"
        cancelar="Seguir respondiendo"
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
  cabecera: { paddingBottom: espacio.s },
  resultado: {
    backgroundColor: colores.superficie,
    borderRadius: radio.m,
    padding: espacio.m,
    gap: espacio.xs,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  filaResultado: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  enlace: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs, minHeight: 44, alignSelf: 'flex-start' },
  enlaceTexto: { color: colores.acento, fontWeight: '700', fontSize: 15 },
});
