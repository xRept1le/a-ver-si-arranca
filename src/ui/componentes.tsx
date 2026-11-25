import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ComponentProps, ReactNode, Ref } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ETIQUETA_DEMO } from '@/content';
import { colores, espacio, radio, texto, TOQUE_MIN } from './tema';

export type NombreIcono = ComponentProps<typeof Ionicons>['name'];

export function Icono({ nombre, color = colores.texto, tam = 22 }: { nombre: NombreIcono; color?: string; tam?: number }) {
  return <Ionicons name={nombre} size={tam} color={color} />;
}

interface PantallaProps {
  children: ReactNode;
  /** Cabecera fija (fuera del scroll). */
  cabecera?: ReactNode;
  /** Zona inferior fija, por ejemplo el botón «Comprobar». */
  pie?: ReactNode;
  /** En pantallas con pestañas, la barra ya respeta el área segura inferior. */
  enPestanas?: boolean;
  scroll?: boolean;
  scrollRef?: Ref<ScrollViewInstance>;
  testID?: string;
}

export function Pantalla({ children, cabecera, pie, enPestanas, scroll = true, scrollRef, testID }: PantallaProps) {
  const insets = useSafeAreaInsets();
  const inferior = enPestanas ? 0 : insets.bottom;
  const contenido = scroll ? (
    <ScrollView
      ref={scrollRef}
      style={styles.flex}
      contentContainerStyle={[styles.contenido, { paddingBottom: (pie ? espacio.l : espacio.xxl) + (pie ? 0 : inferior) }]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.contenido]}>{children}</View>
  );

  return (
    <View
      testID={testID}
      style={[styles.pantalla, { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }]}
    >
      {cabecera}
      {contenido}
      {pie ? <View style={[styles.pie, { paddingBottom: espacio.l + inferior }]}>{pie}</View> : null}
    </View>
  );
}

export function Cabecera({
  titulo,
  atras = true,
  onAtras,
  derecha,
  iconoAtras = 'arrow-back',
}: {
  titulo?: string;
  atras?: boolean;
  onAtras?: () => void;
  derecha?: ReactNode;
  iconoAtras?: NombreIcono;
}) {
  return (
    <View style={styles.cabecera}>
      {atras ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={iconoAtras === 'close' ? 'Salir' : 'Volver'}
          testID="boton-atras"
          hitSlop={8}
          onPress={onAtras ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
          style={styles.botonIcono}
        >
          <Icono nombre={iconoAtras} />
        </Pressable>
      ) : (
        <View style={styles.botonIconoVacio} />
      )}
      <Text style={styles.cabeceraTitulo} numberOfLines={1} accessibilityRole="header">
        {titulo}
      </Text>
      <View style={styles.cabeceraDerecha}>{derecha}</View>
    </View>
  );
}

type Variante = 'primario' | 'secundario' | 'fantasma';

export function Boton({
  titulo,
  onPress,
  variante = 'primario',
  desactivado,
  icono,
  testID,
  estilo,
}: {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  desactivado?: boolean;
  icono?: NombreIcono;
  testID?: string;
  estilo?: ViewStyle;
}) {
  const colorTexto =
    variante === 'primario' ? colores.sobreAcento : variante === 'secundario' ? colores.texto : colores.acento;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!desactivado }}
      disabled={desactivado}
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.boton,
        variante === 'primario' && styles.botonPrimario,
        variante === 'secundario' && styles.botonSecundario,
        desactivado && styles.botonDesactivado,
        pressed && !desactivado && { opacity: 0.85 },
        estilo,
      ]}
    >
      {icono ? <Icono nombre={icono} color={desactivado ? colores.textoTenue : colorTexto} tam={20} /> : null}
      <Text style={[styles.botonTexto, { color: desactivado ? colores.textoTenue : colorTexto }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Tarjeta({ children, estilo, testID }: { children: ReactNode; estilo?: ViewStyle; testID?: string }) {
  return (
    <View testID={testID} style={[styles.tarjeta, estilo]}>
      {children}
    </View>
  );
}

/** Fila pulsable con icono, texto y chevron. */
export function FilaEnlace({
  icono,
  titulo,
  detalle,
  onPress,
  testID,
}: {
  icono: NombreIcono;
  titulo: string;
  detalle?: string;
  onPress: () => void;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [styles.fila, pressed && { backgroundColor: colores.superficieAlta }]}
    >
      <Icono nombre={icono} color={colores.textoSuave} />
      <View style={styles.flex}>
        <Text style={texto.cuerpo}>{titulo}</Text>
        {detalle ? <Text style={texto.suave}>{detalle}</Text> : null}
      </View>
      <Icono nombre="chevron-forward" color={colores.textoTenue} tam={18} />
    </Pressable>
  );
}

export function MarcaDemo({ texto: t = ETIQUETA_DEMO }: { texto?: string }) {
  return (
    <View style={styles.marcaDemo} accessibilityLabel={t}>
      <Icono nombre="flask-outline" color={colores.textoSuave} tam={14} />
      <Text style={styles.marcaDemoTexto}>{t}</Text>
    </View>
  );
}

export function EstadoVacio({ icono, titulo, texto: t, children }: { icono: NombreIcono; titulo: string; texto: string; children?: ReactNode }) {
  return (
    <View style={styles.vacio}>
      <Icono nombre={icono} color={colores.textoTenue} tam={36} />
      <Text style={[texto.subtitulo, { textAlign: 'center' }]}>{titulo}</Text>
      <Text style={[texto.suave, { textAlign: 'center' }]}>{t}</Text>
      {children}
    </View>
  );
}

/** Diálogo de confirmación propio (Alert no funciona en la versión web). */
export function Dialogo({
  visible,
  titulo,
  mensaje,
  confirmar,
  cancelar = 'Cancelar',
  onConfirmar,
  onCancelar,
}: {
  visible: boolean;
  titulo: string;
  mensaje?: string;
  confirmar: string;
  cancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar} statusBarTranslucent navigationBarTranslucent>
      <View style={styles.velo}>
        <View style={styles.dialogo} testID="dialogo" accessibilityViewIsModal>
          <Text style={texto.subtitulo}>{titulo}</Text>
          {mensaje ? <Text style={texto.suave}>{mensaje}</Text> : null}
          <View style={{ gap: espacio.s, marginTop: espacio.s }}>
            <Boton titulo={confirmar} onPress={onConfirmar} testID="dialogo-confirmar" />
            <Boton titulo={cancelar} onPress={onCancelar} variante="secundario" testID="dialogo-cancelar" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingHorizontal: espacio.l, paddingTop: espacio.s, gap: espacio.l },
  pie: {
    paddingHorizontal: espacio.l,
    paddingTop: espacio.m,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.borde,
    backgroundColor: colores.fondo,
    gap: espacio.s,
  },
  cabecera: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: espacio.s,
    minHeight: 56,
    gap: espacio.s,
  },
  cabeceraTitulo: { ...texto.subtitulo, flex: 1, fontSize: 18 },
  cabeceraDerecha: { minWidth: TOQUE_MIN, alignItems: 'flex-end' },
  botonIcono: { width: TOQUE_MIN, height: TOQUE_MIN, alignItems: 'center', justifyContent: 'center', borderRadius: radio.total },
  botonIconoVacio: { width: espacio.s },
  boton: {
    minHeight: 52,
    borderRadius: radio.m,
    paddingHorizontal: espacio.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.s,
  },
  botonPrimario: { backgroundColor: colores.acentoRelleno },
  botonSecundario: { backgroundColor: colores.superficieAlta, borderWidth: 1, borderColor: colores.borde },
  botonDesactivado: { backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde },
  botonTexto: { fontSize: 16, fontWeight: '700' },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radio.l,
    padding: espacio.l,
    borderWidth: 1,
    borderColor: colores.borde,
    gap: espacio.s,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    minHeight: 56,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.m,
    backgroundColor: colores.superficie,
    borderRadius: radio.m,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  marcaDemo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: espacio.xs,
    paddingHorizontal: espacio.s,
    paddingVertical: 3,
    borderRadius: radio.total,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  marcaDemoTexto: { fontSize: 12, color: colores.textoSuave, fontWeight: '600' },
  vacio: { alignItems: 'center', gap: espacio.s, paddingVertical: espacio.xl, paddingHorizontal: espacio.l },
  velo: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: espacio.xl },
  dialogo: { backgroundColor: colores.superficie, borderRadius: radio.l, padding: espacio.xl, gap: espacio.s, borderWidth: 1, borderColor: colores.borde },
});
