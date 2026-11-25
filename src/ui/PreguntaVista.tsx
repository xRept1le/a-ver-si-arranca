import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Pregunta } from '@/content';
import { Icono, MarcaDemo, type NombreIcono } from './componentes';
import { Escena } from './EscenaCruce';
import { colores, espacio, radio, texto } from './tema';

const LETRAS = ['A', 'B', 'C'] as const;

type EstadoOpcion = 'normal' | 'seleccionada' | 'correcta' | 'incorrecta' | 'atenuada';

function estadoOpcion(i: number, elegida: number | undefined, correcta: number, comprobada: boolean): EstadoOpcion {
  if (!comprobada) return elegida === i ? 'seleccionada' : 'normal';
  if (i === correcta) return 'correcta';
  if (i === elegida) return 'incorrecta';
  return 'atenuada';
}

const ICONO: Record<EstadoOpcion, NombreIcono> = {
  normal: 'ellipse-outline',
  seleccionada: 'radio-button-on',
  correcta: 'checkmark-circle',
  incorrecta: 'close-circle',
  atenuada: 'ellipse-outline',
};

export function PreguntaVista({
  pregunta,
  elegida,
  onElegir,
  comprobada = false,
}: {
  pregunta: Pregunta;
  elegida: number | undefined;
  onElegir: (i: number) => void;
  /** Tras «Comprobar» las opciones se bloquean y muestran la corrección. */
  comprobada?: boolean;
}) {
  return (
    <View style={{ gap: espacio.l }} testID={`pregunta-${pregunta.id}`}>
      <MarcaDemo />
      <Text style={styles.enunciado} accessibilityRole="header" testID="enunciado">
        {pregunta.enunciado}
      </Text>
      {pregunta.escena ? <Escena id={pregunta.escena} /> : null}
      <View style={{ gap: espacio.s }} accessibilityRole="radiogroup">
        {pregunta.opciones.map((opcion, i) => {
          const estado = estadoOpcion(i, elegida, pregunta.correcta, comprobada);
          const etiquetaEstado =
            estado === 'correcta' ? 'Respuesta correcta' : estado === 'incorrecta' ? 'Su respuesta' : undefined;
          return (
            <Pressable
              key={i}
              accessibilityRole="radio"
              accessibilityState={{ checked: elegida === i, disabled: comprobada }}
              aria-checked={elegida === i}
              aria-disabled={comprobada}
              accessibilityLabel={`${LETRAS[i]}. ${opcion}${etiquetaEstado ? `. ${etiquetaEstado}` : ''}`}
              disabled={comprobada}
              onPress={() => onElegir(i)}
              testID={`opcion-${i}`}
              style={[styles.opcion, estilosOpcion[estado]]}
            >
              <Icono
                nombre={ICONO[estado]}
                color={
                  estado === 'seleccionada'
                    ? colores.acento
                    : estado === 'correcta'
                      ? colores.acierto
                      : estado === 'incorrecta'
                        ? colores.fallo
                        : colores.textoTenue
                }
              />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[texto.cuerpo, estado === 'atenuada' && { color: colores.textoTenue }, estado === 'incorrecta' && styles.tachado]}>
                  <Text style={{ fontWeight: '700' }}>{LETRAS[i]}. </Text>
                  {opcion}
                </Text>
                {etiquetaEstado ? <Text style={styles.etiquetaEstado}>{etiquetaEstado}</Text> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  enunciado: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: colores.texto },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    minHeight: 56,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.m,
    borderRadius: radio.m,
    borderWidth: 2,
    backgroundColor: colores.superficie,
  },
  tachado: { textDecorationLine: 'line-through', color: colores.textoSuave },
  etiquetaEstado: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', color: colores.textoSuave },
});

const estilosOpcion: Record<EstadoOpcion, object> = {
  normal: { borderColor: colores.borde },
  seleccionada: { borderColor: colores.acento, backgroundColor: colores.acentoSuave },
  correcta: { borderColor: colores.acierto, backgroundColor: colores.superficieAlta },
  incorrecta: { borderColor: colores.fallo, borderStyle: 'dashed' },
  atenuada: { borderColor: colores.borde, opacity: 0.6 },
};
