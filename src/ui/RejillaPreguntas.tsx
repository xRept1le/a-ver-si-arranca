import { StyleSheet, Text, View } from 'react-native';

import { Icono } from './componentes';
import { colores, espacio, radio } from './tema';

/**
 * Recuadros numerados de la lección o el repaso, como en el simulador.
 * Solo informan: en una lección las preguntas se responden en orden.
 * `resultados[i]` es `true` (acierto), `false` (fallo) o `undefined` (pendiente).
 */
export function RejillaPreguntas({ total, actual, resultados }: { total: number; actual: number; resultados: (boolean | undefined)[] }) {
  const respondidas = resultados.filter((r) => r !== undefined).length;
  return (
    <View
      style={styles.rejilla}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Pregunta ${actual + 1} de ${total}. ${respondidas} respondidas`}
      testID="rejilla-preguntas"
    >
      {Array.from({ length: total }, (_, i) => {
        const r = resultados[i];
        const esActual = i === actual;
        return (
          <View
            key={i}
            testID={`celda-${i}`}
            style={[
              styles.celda,
              r === true && styles.celdaAcierto,
              r === false && styles.celdaFallo,
              esActual && styles.celdaActual,
            ]}
          >
            {r === undefined ? (
              <Text style={[styles.numero, esActual && { color: colores.texto }]}>{i + 1}</Text>
            ) : (
              <Icono nombre={r ? 'checkmark' : 'close'} tam={16} color={r ? colores.correcto : colores.incorrecto} />
            )}
          </View>
        );
      })}
    </View>
  );
}

const TAM = 34;

const styles = StyleSheet.create({
  rejilla: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingHorizontal: espacio.l },
  celda: {
    width: TAM,
    height: TAM,
    borderRadius: radio.s,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  celdaAcierto: { borderColor: colores.correcto, backgroundColor: colores.correctoSuave },
  celdaFallo: { borderColor: colores.incorrecto, backgroundColor: colores.incorrectoSuave },
  celdaActual: { borderColor: colores.acento, borderWidth: 2 },
  numero: { fontSize: 13, fontWeight: '700', color: colores.textoSuave },
});
