import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { capitulos } from '@/content';
import { Icono, MarcaDemo, Pantalla } from '@/ui/componentes';
import { colores, espacio, radio, texto } from '@/ui/tema';

export default function Temario() {
  return (
    <Pantalla enPestanas testID="pantalla-temario">
      <View style={{ gap: espacio.s, paddingTop: espacio.m }}>
        <Text style={texto.titulo} accessibilityRole="header">
          Temario
        </Text>
        <Text style={texto.suave}>Índice provisional del teórico del permiso B.</Text>
        <MarcaDemo />
      </View>
      <View style={{ gap: espacio.s }}>
        {capitulos.map((c) => {
          const abrible = c.legible || !!c.temaId;
          const estado = c.legible ? 'Disponible para leer' : c.temaId ? 'Texto pendiente · Se puede practicar' : 'Próximamente';
          return (
            <Pressable
              key={c.id}
              accessibilityRole="button"
              accessibilityLabel={`Capítulo ${c.numero}: ${c.titulo}. ${estado}`}
              accessibilityState={{ disabled: !abrible }}
              disabled={!abrible}
              testID={`capitulo-${c.id}`}
              onPress={() => router.push({ pathname: '/temario/[capitulo]', params: { capitulo: c.id } })}
              style={({ pressed }) => [styles.fila, !abrible && { opacity: 0.55 }, pressed && { backgroundColor: colores.superficieAlta }]}
            >
              <Text style={styles.numero}>{String(c.numero).padStart(2, '0')}</Text>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={[texto.cuerpo, { fontWeight: '600' }]}>{c.titulo}</Text>
                <View style={styles.estado}>
                  <Icono
                    nombre={c.legible ? 'book-outline' : c.temaId ? 'school-outline' : 'time-outline'}
                    color={c.legible ? colores.acento : colores.textoTenue}
                    tam={14}
                  />
                  <Text style={[texto.suave, c.legible && { color: colores.acento }]}>{estado}</Text>
                </View>
              </View>
              {abrible ? <Icono nombre="chevron-forward" color={colores.textoTenue} tam={18} /> : null}
            </Pressable>
          );
        })}
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    minHeight: 64,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.m,
    borderRadius: radio.m,
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  numero: { fontSize: 15, fontWeight: '800', color: colores.textoTenue, width: 26 },
  estado: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs },
});
