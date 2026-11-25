import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { getPregunta, REGLAS } from '@/content';
import { useDatos } from '@/store/useDatos';
import { Boton, Cabecera, EstadoVacio, Icono, MarcaDemo, Pantalla, Tarjeta } from '@/ui/componentes';
import { colores, espacio, texto } from '@/ui/tema';

const LETRAS = ['A', 'B', 'C'];

export default function ResultadoSimulacro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resultado = useDatos((s) => s.simulacros.find((r) => r.id === id));

  if (!resultado) {
    return (
      <Pantalla cabecera={<Cabecera titulo="Resultado" />}>
        <EstadoVacio icono="document-outline" titulo="Resultado no encontrado" texto="Consulta el historial en Progreso." />
      </Pantalla>
    );
  }

  const fallos = resultado.total - resultado.aciertos;

  return (
    <Pantalla
      testID="pantalla-resultado"
      cabecera={<Cabecera titulo="Resultado del simulacro" onAtras={() => router.dismissTo('/simulador')} />}
      pie={
        <>
          <Boton titulo="Ver en Progreso" icono="stats-chart" onPress={() => router.dismissTo('/progreso')} testID="ver-progreso" />
          {fallos > 0 ? <Boton titulo="Repasar errores" variante="secundario" onPress={() => router.push('/errores')} /> : null}
        </>
      }
    >
      <View style={styles.cabecera}>
        <MarcaDemo texto="Simulacro de demostración" />
        {resultado.porTiempo ? (
          <View style={styles.aviso} testID="tiempo-agotado">
            <Icono nombre="alarm-outline" color={colores.acento} tam={18} />
            <Text style={[texto.cuerpo, { flex: 1 }]}>Tiempo agotado: el simulacro se ha corregido automáticamente.</Text>
          </View>
        ) : null}
        <Icono nombre={resultado.apto ? 'checkmark-circle' : 'close-circle'} color={resultado.apto ? colores.acierto : colores.fallo} tam={56} />
        <Text style={texto.titulo} testID="resultado-veredicto">
          {resultado.apto ? 'Apto' : 'No apto'}
        </Text>
        <Text style={texto.suave} testID="resultado-cifras">
          {`${resultado.aciertos} de ${resultado.total} aciertos · ${fallos} fallo${fallos === 1 ? '' : 's'} (máximo ${REGLAS.simulacro.maxFallos})`}
        </Text>
        {fallos > 0 ? <Text style={texto.suave}>Los fallos se han añadido a Mis errores.</Text> : null}
      </View>

      <Text style={texto.etiqueta}>Revisión</Text>
      {resultado.respuestas.map((r, i) => {
        const p = getPregunta(r.preguntaId)?.pregunta;
        if (!p) return null;
        return (
          <Tarjeta key={r.preguntaId} testID={`revision-${i}`}>
            <View style={{ flexDirection: 'row', gap: espacio.s, alignItems: 'center' }}>
              <Icono nombre={r.acierto ? 'checkmark-circle' : 'close-circle'} color={r.acierto ? colores.acierto : colores.fallo} tam={20} />
              <Text style={[texto.etiqueta, { color: colores.texto }]}>{`${i + 1} · ${r.acierto ? 'Acierto' : r.elegida === null ? 'Sin responder' : 'Fallo'}`}</Text>
            </View>
            <Text style={texto.cuerpo}>{p.enunciado}</Text>
            {!r.acierto && r.elegida !== null ? (
              <Text style={texto.suave}>{`Tu respuesta: ${LETRAS[r.elegida]}. ${p.opciones[r.elegida]}`}</Text>
            ) : null}
            <Text style={texto.suave}>
              Correcta: <Text style={{ color: colores.texto, fontWeight: '700' }}>{`${LETRAS[p.correcta]}. ${p.opciones[p.correcta]}`}</Text>
            </Text>
            {!r.acierto ? <Text style={texto.suave}>{p.explicacion}</Text> : null}
          </Tarjeta>
        );
      })}
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  cabecera: { alignItems: 'center', gap: espacio.s, paddingTop: espacio.s },
  aviso: {
    flexDirection: 'row',
    gap: espacio.s,
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: espacio.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colores.acento,
    backgroundColor: colores.acentoSuave,
  },
});
