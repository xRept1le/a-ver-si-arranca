import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { duracionEstimada, niveles, tituloNivel } from '@/content';
import { listarErrores } from '@/domain/errores';
import { nivelActual } from '@/domain/niveles';
import { useDatos } from '@/store/useDatos';
import { CaminoNiveles } from '@/ui/CaminoNiveles';
import { Boton, FilaEnlace, Icono, MarcaDemo, Pantalla, Tarjeta } from '@/ui/componentes';
import { colores, espacio, TOQUE_MIN, texto } from '@/ui/tema';

export default function Inicio() {
  const completados = useDatos((s) => s.completados);
  const errores = useDatos((s) => s.errores);
  const actual = nivelActual(niveles, completados);
  const pendientes = listarErrores(errores).pendientes.length;

  return (
    <Pantalla
      enPestanas
      testID="pantalla-inicio"
      cabecera={
        <View style={styles.cabecera}>
          <View style={styles.marca}>
            <View style={styles.logo}>
              <Icono nombre="speedometer-outline" color={colores.acento} tam={20} />
            </View>
            <Text style={texto.titulo} accessibilityRole="header">
              A Ver si Arranca
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajustes"
            testID="abrir-ajustes"
            onPress={() => router.push('/ajustes')}
            style={styles.botonAjustes}
          >
            <Icono nombre="settings-outline" />
          </Pressable>
        </View>
      }
    >
      <Tarjeta testID="tarjeta-continuar" estilo={styles.continuar}>
        <Text style={[texto.etiqueta, { color: colores.acento }]}>Continuar</Text>
        {actual ? (
          <>
            <Text style={texto.subtitulo}>{tituloNivel(actual)}</Text>
            <Text style={texto.cuerpo}>{actual.titulo}</Text>
            <View style={styles.meta}>
              <Icono nombre="help-circle-outline" color={colores.textoSuave} tam={16} />
              <Text style={texto.suave}>{`${actual.preguntas.length} preguntas`}</Text>
              <Icono nombre="time-outline" color={colores.textoSuave} tam={16} />
              <Text style={texto.suave} testID="duracion">{`unos ${duracionEstimada(actual.preguntas.length)} min`}</Text>
            </View>
            <Text style={texto.suave}>Se completa con 3 fallos como máximo.</Text>
            <Boton
              titulo="Empezar lección"
              icono="play"
              testID="continuar-leccion"
              onPress={() => router.push({ pathname: '/leccion/[nivel]', params: { nivel: actual.id } })}
              estilo={{ marginTop: espacio.s }}
            />
          </>
        ) : (
          <>
            <Text style={texto.subtitulo}>Has completado todos los niveles de la demo</Text>
            <Text style={texto.suave}>Repasa tus errores o haz un simulacro.</Text>
            <Boton titulo="Repasar errores" icono="refresh" onPress={() => router.push('/errores')} />
            <Boton titulo="Ir al simulador" variante="secundario" onPress={() => router.navigate('/simulador')} />
          </>
        )}
      </Tarjeta>

      <FilaEnlace
        icono="alert-circle-outline"
        titulo="Mis errores"
        detalle={pendientes === 0 ? 'Sin preguntas pendientes' : `${pendientes} pendiente${pendientes === 1 ? '' : 's'}`}
        onPress={() => router.push('/errores')}
        testID="abrir-errores"
      />

      <View style={{ gap: espacio.s }}>
        <Text style={texto.etiqueta}>Tu camino</Text>
        <MarcaDemo />
      </View>
      <CaminoNiveles />
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: espacio.l,
    paddingRight: espacio.s,
    minHeight: 60,
  },
  marca: { flexDirection: 'row', alignItems: 'center', gap: espacio.s, flexShrink: 1 },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colores.acento,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonAjustes: { width: TOQUE_MIN, height: TOQUE_MIN, alignItems: 'center', justifyContent: 'center' },
  continuar: { borderColor: colores.acento },
  meta: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs, flexWrap: 'wrap' },
});
