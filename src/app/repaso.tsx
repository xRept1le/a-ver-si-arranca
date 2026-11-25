import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getPregunta, type Pregunta } from '@/content';
import { listarErrores } from '@/domain/errores';
import { useDatos } from '@/store/useDatos';
import { Boton, Cabecera, EstadoVacio, Icono, Pantalla, Tarjeta } from '@/ui/componentes';
import { SesionPractica } from '@/ui/SesionPractica';
import { colores, espacio, texto } from '@/ui/tema';

/** Práctica con las preguntas pendientes de Mis errores, tomadas al empezar. */
export default function Repaso() {
  const [preguntas] = useState<Pregunta[]>(() =>
    listarErrores(useDatos.getState().errores)
      .pendientes.map((e) => getPregunta(e.preguntaId)?.pregunta)
      .filter((p): p is Pregunta => !!p),
  );

  if (preguntas.length === 0) {
    return (
      <Pantalla cabecera={<Cabecera titulo="Repaso de errores" />}>
        <EstadoVacio icono="checkmark-done-outline" titulo="No hay errores pendientes" texto="Cuando falles una pregunta aparecerá aquí para repasarla." />
      </Pantalla>
    );
  }

  return (
    <SesionPractica
      titulo="Repaso de errores"
      preguntas={preguntas}
      origen="repaso"
      renderResumen={(r) => (
        <>
          <View style={styles.cabecera}>
            <Icono nombre="refresh-circle" color={colores.acento} tam={56} />
            <Text style={texto.titulo}>Repaso terminado</Text>
          </View>
          <View style={styles.cifras}>
            <Tarjeta estilo={styles.cifra}>
              <Icono nombre="checkmark" color={colores.acierto} />
              <Text style={styles.numero} testID="repaso-corregidas">{r.aciertos}</Text>
              <Text style={[texto.suave, { textAlign: 'center' }]}>Pasan a corregidas</Text>
            </Tarjeta>
            <Tarjeta estilo={styles.cifra}>
              <Icono nombre="close" color={colores.fallo} />
              <Text style={styles.numero} testID="repaso-pendientes">{r.fallos}</Text>
              <Text style={[texto.suave, { textAlign: 'center' }]}>Siguen pendientes</Text>
            </Tarjeta>
          </View>
          <View style={{ gap: espacio.s }}>
            <Boton titulo="Ver Mis errores" onPress={() => router.back()} testID="volver-errores" />
          </View>
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  cabecera: { alignItems: 'center', gap: espacio.s, paddingTop: espacio.l },
  cifras: { flexDirection: 'row', gap: espacio.m },
  cifra: { flex: 1, alignItems: 'center' },
  numero: { fontSize: 32, fontWeight: '800', color: colores.texto },
});
