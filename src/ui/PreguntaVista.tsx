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

const COLOR_ICONO: Record<EstadoOpcion, string> = {
  normal: colores.textoTenue,
  seleccionada: colores.acento,
  correcta: colores.correcto,
  incorrecta: colores.incorrecto,
  atenuada: colores.textoTenue,
};

/**
 * Recuadro horizontal sobre las opciones. Muestra la escena de la pregunta
 * si la tiene; si no, un hueco reservado para la futura imagen.
 */
function MarcoImagen({ pregunta }: { pregunta: Pregunta }) {
  return (
    <View style={styles.marco} testID="marco-imagen">
      {pregunta.escena ? (
        <Escena id={pregunta.escena} />
      ) : (
        <View style={styles.hueco} accessible accessibilityLabel="Espacio reservado para la imagen de la pregunta">
          <Icono nombre="image-outline" color={colores.textoTenue} tam={32} />
          <Text style={styles.huecoTexto}>Imagen de la pregunta · próximamente</Text>
        </View>
      )}
    </View>
  );
}

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
  const acierto = comprobada && elegida === pregunta.correcta;
  return (
    <View style={{ gap: espacio.l }} testID={`pregunta-${pregunta.id}`}>
      <MarcaDemo />
      <Text style={styles.enunciado} accessibilityRole="header" testID="enunciado">
        {pregunta.enunciado}
      </Text>
      <MarcoImagen pregunta={pregunta} />
      <View style={{ gap: espacio.s }} accessibilityRole="radiogroup">
        {pregunta.opciones.map((opcion, i) => {
          const estado = estadoOpcion(i, elegida, pregunta.correcta, comprobada);
          const etiquetaEstado =
            estado === 'correcta'
              ? acierto
                ? 'Tu respuesta · correcta'
                : 'Respuesta correcta'
              : estado === 'incorrecta'
                ? 'Tu respuesta · incorrecta'
                : undefined;
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
              <Icono nombre={ICONO[estado]} color={COLOR_ICONO[estado]} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[texto.cuerpo, estado === 'atenuada' && { color: colores.textoTenue }]}>
                  <Text style={{ fontWeight: '700' }}>{LETRAS[i]}. </Text>
                  {opcion}
                </Text>
                {etiquetaEstado ? (
                  <Text style={[styles.etiquetaEstado, { color: COLOR_ICONO[estado] }]} testID={`estado-opcion-${i}`}>
                    {etiquetaEstado}
                  </Text>
                ) : null}
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
  marco: {
    aspectRatio: 16 / 9,
    borderRadius: radio.m,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
  },
  hueco: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: espacio.s, padding: espacio.l },
  huecoTexto: { fontSize: 13, color: colores.textoTenue, textAlign: 'center' },
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
  etiquetaEstado: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
});

const estilosOpcion: Record<EstadoOpcion, object> = {
  normal: { borderColor: colores.borde },
  seleccionada: { borderColor: colores.acento, backgroundColor: colores.acentoSuave },
  correcta: { borderColor: colores.correcto, backgroundColor: colores.correctoSuave },
  incorrecta: { borderColor: colores.incorrecto, backgroundColor: colores.incorrectoSuave },
  atenuada: { borderColor: colores.borde, opacity: 0.6 },
};
