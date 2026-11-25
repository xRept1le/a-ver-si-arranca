import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useDatos } from '@/store/useDatos';
import { Cabecera, Icono, Pantalla, Tarjeta, type NombreIcono } from '@/ui/componentes';
import { colores, espacio, radio, TOQUE_MIN, texto } from '@/ui/tema';

const MINUTOS = [0, 15, 30, 45];

function Paso({ icono, etiqueta, onPress, desactivado, testID }: { icono: NombreIcono; etiqueta: string; onPress: () => void; desactivado: boolean; testID: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={etiqueta}
      accessibilityState={{ disabled: desactivado }}
      disabled={desactivado}
      onPress={onPress}
      testID={testID}
      style={[styles.paso, desactivado && { opacity: 0.4 }]}
    >
      <Icono nombre={icono} />
    </Pressable>
  );
}

export default function Ajustes() {
  const ajustes = useDatos((s) => s.ajustes);
  const cambiar = useDatos((s) => s.cambiarAjustes);
  const [h, m] = ajustes.hora.split(':').map(Number);
  const off = !ajustes.recordatorios;

  const fijar = (hora: number, minuto: number) =>
    cambiar({ hora: `${String((hora + 24) % 24).padStart(2, '0')}:${String(minuto).padStart(2, '0')}` });
  const moverMinuto = (d: number) => {
    const i = MINUTOS.indexOf(m);
    const n = (i < 0 ? 0 : i) + d;
    if (n < 0) fijar(h - 1, MINUTOS[MINUTOS.length - 1]);
    else if (n >= MINUTOS.length) fijar(h + 1, MINUTOS[0]);
    else fijar(h, MINUTOS[n]);
  };

  return (
    <Pantalla testID="pantalla-ajustes" cabecera={<Cabecera titulo="Ajustes" />}>
      <Tarjeta>
        <View style={styles.fila}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[texto.cuerpo, { fontWeight: '700' }]}>Recordatorio diario</Text>
            <Text style={texto.suave}>Un aviso para estudiar a la hora que elijas.</Text>
          </View>
          <Switch
            value={ajustes.recordatorios}
            onValueChange={(v) => cambiar({ recordatorios: v })}
            trackColor={{ false: colores.bordeFuerte, true: colores.acentoRelleno }}
            thumbColor={colores.texto}
            accessibilityLabel="Recordatorio diario"
            testID="interruptor-recordatorios"
          />
        </View>
        <Text style={texto.suave} testID="estado-recordatorios">
          {ajustes.recordatorios ? 'Activado' : 'Desactivado'}
        </Text>
      </Tarjeta>

      <Tarjeta estilo={off ? { opacity: 0.6 } : undefined}>
        <Text style={[texto.cuerpo, { fontWeight: '700' }]}>Hora del recordatorio</Text>
        <View style={styles.selector} accessibilityLabel={`Hora seleccionada ${ajustes.hora}`}>
          <View style={styles.columna}>
            <Paso icono="chevron-up" etiqueta="Una hora más" onPress={() => fijar(h + 1, m)} desactivado={off} testID="hora-mas" />
            <Text style={styles.digitos}>{String(h).padStart(2, '0')}</Text>
            <Paso icono="chevron-down" etiqueta="Una hora menos" onPress={() => fijar(h - 1, m)} desactivado={off} testID="hora-menos" />
          </View>
          <Text style={styles.digitos}>:</Text>
          <View style={styles.columna}>
            <Paso icono="chevron-up" etiqueta="Quince minutos más" onPress={() => moverMinuto(1)} desactivado={off} testID="minuto-mas" />
            <Text style={styles.digitos}>{String(m).padStart(2, '0')}</Text>
            <Paso icono="chevron-down" etiqueta="Quince minutos menos" onPress={() => moverMinuto(-1)} desactivado={off} testID="minuto-menos" />
          </View>
        </View>
        <Text style={texto.suave} testID="hora-guardada">{`Hora guardada: ${ajustes.hora}`}</Text>
      </Tarjeta>

      <View style={styles.aviso} testID="aviso-notificaciones">
        <Icono nombre="construct-outline" color={colores.textoSuave} tam={18} />
        <Text style={[texto.suave, { flex: 1 }]}>
          El envío de notificaciones está pendiente de implementación. Por ahora solo se guardan tus preferencias en este dispositivo.
        </Text>
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.m, minHeight: TOQUE_MIN },
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espacio.l, paddingVertical: espacio.s },
  columna: { alignItems: 'center', gap: espacio.xs },
  digitos: { fontSize: 40, fontWeight: '800', color: colores.texto, fontVariant: ['tabular-nums'] },
  paso: {
    width: TOQUE_MIN,
    height: TOQUE_MIN,
    borderRadius: radio.total,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.superficieAlta,
  },
  aviso: {
    flexDirection: 'row',
    gap: espacio.s,
    padding: espacio.l,
    borderRadius: radio.m,
    borderWidth: 1,
    borderColor: colores.borde,
    borderStyle: 'dashed',
  },
});
