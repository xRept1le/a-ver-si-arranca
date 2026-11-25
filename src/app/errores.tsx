import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getPregunta } from '@/content';
import { listarErrores } from '@/domain/errores';
import type { RegistroError } from '@/domain/types';
import { useDatos } from '@/store/useDatos';
import { Boton, Cabecera, EstadoVacio, Icono, MarcaDemo, Pantalla } from '@/ui/componentes';
import { colores, espacio, radio, texto } from '@/ui/tema';

type Pestana = 'pendientes' | 'corregidas';

export default function MisErrores() {
  const errores = useDatos((s) => s.errores);
  const { pendientes, corregidas } = listarErrores(errores);
  const [pestana, setPestana] = useState<Pestana>('pendientes');
  const lista = pestana === 'pendientes' ? pendientes : corregidas;

  return (
    <Pantalla
      testID="pantalla-errores"
      cabecera={<Cabecera titulo="Mis errores" />}
      pie={
        <Boton
          titulo={pendientes.length ? `Repasar errores (${pendientes.length})` : 'Repasar errores'}
          icono="refresh"
          desactivado={pendientes.length === 0}
          onPress={() => router.push('/repaso')}
          testID="repasar-errores"
        />
      }
    >
      <View style={styles.segmento} accessibilityRole="tablist">
        {(['pendientes', 'corregidas'] as const).map((p) => {
          const activa = pestana === p;
          const n = p === 'pendientes' ? pendientes.length : corregidas.length;
          return (
            <Pressable
              key={p}
              accessibilityRole="tab"
              accessibilityState={{ selected: activa }}
              onPress={() => setPestana(p)}
              testID={`segmento-${p}`}
              style={[styles.segmentoBoton, activa && styles.segmentoActivo]}
            >
              <Text style={[styles.segmentoTexto, activa && { color: colores.texto }]}>
                {`${p === 'pendientes' ? 'Pendientes' : 'Corregidas'} (${n})`}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {lista.length === 0 ? (
        pestana === 'pendientes' ? (
          <EstadoVacio
            icono="checkmark-done-outline"
            titulo="No tienes errores pendientes"
            texto="Las preguntas que falles en lecciones o simulacros aparecerán aquí."
          />
        ) : (
          <EstadoVacio
            icono="ribbon-outline"
            titulo="Aún no hay preguntas corregidas"
            texto="Acierta una pregunta pendiente en el repaso y pasará a esta lista."
          />
        )
      ) : (
        <View style={{ gap: espacio.s }} testID={`lista-${pestana}`}>
          <MarcaDemo />
          {lista.map((e) => (
            <FilaError key={e.preguntaId} error={e} />
          ))}
        </View>
      )}
    </Pantalla>
  );
}

function FilaError({ error }: { error: RegistroError }) {
  const info = getPregunta(error.preguntaId);
  if (!info) return null;
  const pendiente = error.estado === 'pendiente';
  return (
    <View style={styles.fila} testID={`error-${error.preguntaId}`}>
      <Icono nombre={pendiente ? 'alert-circle-outline' : 'checkmark-circle-outline'} color={pendiente ? colores.fallo : colores.acierto} />
      <View style={{ flex: 1, gap: espacio.xs }}>
        <Text style={texto.cuerpo}>{info.pregunta.enunciado}</Text>
        <Text style={texto.suave}>
          {`${info.tema.titulo} · ${pendiente ? 'Pendiente' : 'Corregida'} · ${error.fallos} fallo${error.fallos === 1 ? '' : 's'}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  segmento: { flexDirection: 'row', backgroundColor: colores.superficie, borderRadius: radio.m, padding: 4, gap: 4 },
  segmentoBoton: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radio.s },
  segmentoActivo: { backgroundColor: colores.superficieAlta, borderWidth: 1, borderColor: colores.acento },
  segmentoTexto: { fontSize: 15, fontWeight: '700', color: colores.textoSuave },
  fila: {
    flexDirection: 'row',
    gap: espacio.m,
    padding: espacio.l,
    borderRadius: radio.m,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
});
