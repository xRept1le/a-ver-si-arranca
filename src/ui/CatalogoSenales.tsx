import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FAMILIAS,
  FUENTE_CATALOGO,
  getTipoSenal,
  imagenSenal,
  paginaFuente,
  SENALES,
  senalesDeTipo,
  tiposDeFamilia,
  tituloTipo,
  type SenalCatalogo,
  type TipoSenal,
} from '@/content/senales';
import { Boton, Cabecera, EstadoVacio, Icono, MarcaDemo, Pantalla } from './componentes';
import { colores, espacio, radio, texto, TOQUE_MIN } from './tema';

const ANCHO_TARJETA = 150;
const HUECO = espacio.m;

function Miniatura({ senal, tam }: { senal: SenalCatalogo; tam: number }) {
  const fuente = imagenSenal(senal);
  return (
    <View style={[styles.miniatura, { width: tam, height: tam }]}>
      {fuente ? <Image source={fuente} style={styles.imagen} resizeMode="contain" accessibilityIgnoresInvertColors /> : null}
    </View>
  );
}

function Fuente() {
  return (
    <View style={styles.fuente} testID="catalogo-fuente">
      <Text style={texto.etiqueta}>Fuente</Text>
      <Text style={texto.cuerpo}>
        {FUENTE_CATALOGO.titulo}. {FUENTE_CATALOGO.editor}.
      </Text>
      <Text style={texto.suave}>{FUENTE_CATALOGO.nota}</Text>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Abrir el PDF original"
        onPress={() => Linking.openURL(FUENTE_CATALOGO.url)}
        style={styles.enlace}
        hitSlop={4}
      >
        <Icono nombre="open-outline" color={colores.acento} tam={16} />
        <Text style={[texto.suave, { color: colores.acento, flexShrink: 1 }]}>Abrir el PDF original</Text>
      </Pressable>
    </View>
  );
}

function FilaTipo({ tipo }: { tipo: TipoSenal }) {
  const lista = senalesDeTipo(tipo.id);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${tituloTipo(tipo)}, ${lista.length} señales`}
      testID={`tipo-${tipo.id}`}
      onPress={() => router.push({ pathname: '/temario/catalogo-senales/[tipo]', params: { tipo: tipo.id } })}
      style={({ pressed }) => [styles.filaTipo, pressed && { backgroundColor: colores.superficieAlta }]}
    >
      <View style={styles.previas}>
        {lista.slice(0, 3).map((s) => (
          <Miniatura key={s.imagen} senal={s} tam={40} />
        ))}
      </View>
      <View style={{ flex: 1 }}>
        {tipo.grupo ? <Text style={styles.grupo}>{tipo.grupo}</Text> : null}
        <Text style={texto.cuerpo}>{tipo.titulo}</Text>
        <Text style={texto.suave}>{lista.length === 1 ? '1 señal' : `${lista.length} señales`}</Text>
      </View>
      <Icono nombre="chevron-forward" color={colores.textoTenue} tam={18} />
    </Pressable>
  );
}

/** Señales reconocibles para la portada del banner. */
const PORTADA = ['r-2', 'r-1', 'p-20', 'r-301', 's-17'];

/** Acceso destacado al catálogo: tarjeta con muestras de señales y botón. */
export function BannerCatalogo({ testID, compacto }: { testID: string; compacto?: boolean }) {
  const muestras = PORTADA.map((id) => SENALES.find((s) => s.imagen === id)).filter((s): s is SenalCatalogo => !!s);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Abrir el catálogo de señales: ${SENALES.length} señales con imagen y descripción`}
      testID={testID}
      onPress={() => router.push('/temario/catalogo-senales')}
      style={({ pressed }) => [styles.banner, pressed && { opacity: 0.9 }]}
    >
      <View style={styles.bannerMuestras}>
        {muestras.map((s) => (
          <View key={s.imagen} style={styles.bannerMuestra}>
            <Image source={imagenSenal(s)} style={styles.imagen} resizeMode="contain" accessibilityIgnoresInvertColors />
          </View>
        ))}
      </View>
      <View style={{ gap: espacio.xs }}>
        <Text style={[texto.etiqueta, { color: colores.acento }]}>Consulta</Text>
        <Text style={[texto.titulo, { fontSize: compacto ? 22 : 24 }]}>Catálogo de señales</Text>
        <Text style={texto.cuerpo}>
          {`Las ${SENALES.length} señales del dosier, con su código, imagen y descripción, ordenadas por tipo.`}
        </Text>
      </View>
      <View style={styles.bannerBoton}>
        <Icono nombre="grid" color={colores.sobreAcento} tam={20} />
        <Text style={styles.bannerBotonTexto}>Abrir catálogo</Text>
        <Icono nombre="arrow-forward" color={colores.sobreAcento} tam={20} />
      </View>
    </Pressable>
  );
}

/** Índice del catálogo: familias del dosier y, dentro, sus tipos. */
export function IndiceCatalogo() {
  return (
    <Pantalla cabecera={<Cabecera titulo="Señales y marcas viales" />} testID="pantalla-catalogo">
      <Text style={texto.titulo} accessibilityRole="header">
        Catálogo de señales
      </Text>
      <MarcaDemo />
      <Text style={texto.suave}>
        {SENALES.length} señales y pictogramas del dosier, agrupados por tipo. Pulsa una señal para ver su descripción.
      </Text>
      {FAMILIAS.map((f) => {
        const tipos = tiposDeFamilia(f.id);
        const total = tipos.reduce((n, t) => n + senalesDeTipo(t.id).length, 0);
        return (
          <View key={f.id} style={{ gap: espacio.s }} testID={`familia-${f.id}`}>
            <View style={styles.cabeceraFamilia}>
              <Text style={texto.subtitulo} accessibilityRole="header">
                {f.titulo}
              </Text>
              <Text style={texto.suave}>{total}</Text>
            </View>
            {tipos.map((t) => (
              <FilaTipo key={t.id} tipo={t} />
            ))}
          </View>
        );
      })}
      <Fuente />
    </Pantalla>
  );
}

function FichaSenal({
  lista,
  indice,
  onCambiar,
  onCerrar,
}: {
  lista: SenalCatalogo[];
  indice: number | null;
  onCambiar: (i: number) => void;
  onCerrar: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const senal = indice === null ? undefined : lista[indice];
  const fuente = senal ? imagenSenal(senal) : undefined;
  const tipo = senal ? getTipoSenal(senal.tipo) : undefined;
  return (
    <Modal visible={!!senal} animationType="slide" onRequestClose={onCerrar} statusBarTranslucent navigationBarTranslucent>
      <View style={[styles.ficha, { paddingTop: insets.top, paddingBottom: insets.bottom }]} testID="ficha-senal" accessibilityViewIsModal>
        <Cabecera titulo={senal?.codigo} iconoAtras="close" onAtras={onCerrar} />
        {senal ? (
          <ScrollView contentContainerStyle={styles.fichaContenido}>
            <View style={[styles.fichaImagen, { height: Math.min(280, height * 0.36) }]}>
              {fuente ? (
                <Image
                  source={fuente}
                  style={styles.imagen}
                  resizeMode="contain"
                  accessibilityLabel={`Imagen de la señal ${senal.codigo}`}
                />
              ) : null}
            </View>
            <Text style={[texto.etiqueta, { color: colores.acento, textTransform: 'none', fontSize: 14 }]} testID="ficha-codigo">
              {senal.codigo}
            </Text>
            <Text style={texto.titulo} accessibilityRole="header" testID="ficha-nombre">
              {senal.nombre}
            </Text>
            <Text style={texto.cuerpo} testID="ficha-descripcion">
              {senal.descripcion}
            </Text>
            <Text style={texto.suave}>
              {tipo ? `${tituloTipo(tipo)} · ` : ''}
              {paginaFuente(senal.pagina)}
            </Text>
            <MarcaDemo />
          </ScrollView>
        ) : null}
        {senal && indice !== null ? (
          <View style={styles.fichaPie}>
            <Boton
              titulo="Anterior"
              icono="chevron-back"
              variante="secundario"
              desactivado={indice === 0}
              onPress={() => onCambiar(indice - 1)}
              estilo={{ flex: 1 }}
              testID="ficha-anterior"
            />
            <Text style={[texto.suave, styles.fichaPosicion]}>
              {indice + 1}/{lista.length}
            </Text>
            <Boton
              titulo="Siguiente"
              icono="chevron-forward"
              variante="secundario"
              desactivado={indice === lista.length - 1}
              onPress={() => onCambiar(indice + 1)}
              estilo={{ flex: 1 }}
              testID="ficha-siguiente"
            />
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

/** Rejilla de un tipo: imagen, código y nombre; al pulsar, la ficha con la descripción. */
export function TipoCatalogo({ tipoId }: { tipoId: string }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [abierta, setAbierta] = useState<number | null>(null);
  const tipo = getTipoSenal(tipoId);

  if (!tipo) {
    return (
      <View style={[styles.pantalla, { paddingTop: insets.top }]}>
        <Cabecera titulo="Catálogo de señales" />
        <EstadoVacio icono="document-outline" titulo="Tipo no encontrado" texto="Vuelve al índice del catálogo." />
      </View>
    );
  }

  const lista = senalesDeTipo(tipo.id);
  const util = width - insets.left - insets.right - espacio.l * 2;
  const columnas = Math.max(2, Math.floor((util + HUECO) / (ANCHO_TARJETA + HUECO)));
  const anchoTarjeta = (util - HUECO * (columnas - 1)) / columnas;
  const familia = FAMILIAS.find((f) => f.id === tipo.familia);

  return (
    <View style={[styles.pantalla, { paddingTop: insets.top }]} testID="pantalla-tipo-senal">
      <Cabecera titulo="Catálogo de señales" />
      <FlatList
        key={columnas}
        data={lista}
        numColumns={columnas}
        keyExtractor={(s) => s.imagen}
        columnWrapperStyle={columnas > 1 ? { gap: HUECO } : undefined}
        contentContainerStyle={[styles.rejilla, { paddingBottom: espacio.xxl + insets.bottom }]}
        initialNumToRender={12}
        ListHeaderComponent={
          <View style={{ gap: espacio.s, marginBottom: espacio.s }}>
            <Text style={styles.grupo}>{tipo.grupo ? `${familia?.titulo} · ${tipo.grupo}` : familia?.titulo}</Text>
            <Text style={texto.titulo} accessibilityRole="header">
              {tipo.titulo}
            </Text>
            <Text style={texto.suave}>{lista.length === 1 ? '1 señal' : `${lista.length} señales`}</Text>
            <MarcaDemo />
          </View>
        }
        renderItem={({ item, index }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.codigo}, ${item.nombre}`}
            accessibilityHint="Abre la descripción"
            testID={`senal-${item.imagen}`}
            onPress={() => setAbierta(index)}
            style={({ pressed }) => [styles.tarjeta, { width: anchoTarjeta }, pressed && { borderColor: colores.acento }]}
          >
            <Miniatura senal={item} tam={anchoTarjeta - espacio.s * 2} />
            <Text style={styles.codigo}>{item.codigo}</Text>
            <Text style={styles.nombre} numberOfLines={3}>
              {item.nombre}
            </Text>
          </Pressable>
        )}
      />
      <FichaSenal lista={lista} indice={abierta} onCambiar={setAbierta} onCerrar={() => setAbierta(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  imagen: { width: '100%', height: '100%' },
  miniatura: {
    backgroundColor: colores.superficieAlta,
    borderRadius: radio.s,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previas: { flexDirection: 'row', gap: 4 },
  filaTipo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    minHeight: 64,
    paddingHorizontal: espacio.m,
    paddingVertical: espacio.s,
    backgroundColor: colores.superficie,
    borderRadius: radio.m,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  grupo: { ...texto.etiqueta, fontSize: 11 },
  cabeceraFamilia: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: espacio.s },
  fuente: { backgroundColor: colores.superficie, borderRadius: radio.m, padding: espacio.l, gap: espacio.xs },
  enlace: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs, minHeight: TOQUE_MIN },
  rejilla: { paddingHorizontal: espacio.l, paddingTop: espacio.s, gap: HUECO },
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radio.m,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: espacio.s,
    gap: espacio.xs,
  },
  codigo: { fontSize: 13, fontWeight: '700', color: colores.acento },
  nombre: { fontSize: 14, lineHeight: 19, color: colores.texto },
  ficha: { flex: 1, backgroundColor: colores.fondo },
  fichaContenido: { paddingHorizontal: espacio.l, gap: espacio.m, paddingBottom: espacio.xl },
  fichaImagen: {
    backgroundColor: colores.superficieAlta,
    borderRadius: radio.l,
    padding: espacio.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fichaPie: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
    paddingHorizontal: espacio.l,
    paddingTop: espacio.m,
    paddingBottom: espacio.l,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colores.borde,
  },
  fichaPosicion: { minWidth: 56, textAlign: 'center' },
  banner: {
    backgroundColor: colores.acentoSuave,
    borderWidth: 2,
    borderColor: colores.acento,
    borderRadius: radio.l,
    padding: espacio.l,
    gap: espacio.m,
  },
  bannerMuestras: { flexDirection: 'row', gap: espacio.s },
  bannerMuestra: {
    flex: 1,
    aspectRatio: 1,
    maxWidth: 64,
    backgroundColor: colores.superficieAlta,
    borderRadius: radio.s,
    padding: 3,
  },
  bannerBoton: {
    minHeight: 52,
    borderRadius: radio.m,
    backgroundColor: colores.acentoRelleno,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.s,
  },
  bannerBotonTexto: { fontSize: 16, fontWeight: '700', color: colores.sobreAcento },
});
