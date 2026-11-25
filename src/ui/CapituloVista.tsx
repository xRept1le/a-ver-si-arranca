import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getCapitulo, getTema, niveles, tituloNivel, type Nivel } from '@/content';
import { estadosNiveles, nivelActual } from '@/domain/niveles';
import type { Datos } from '@/domain/types';
import { useDatos } from '@/store/useDatos';
import { BannerCatalogo } from './CatalogoSenales';
import { Boton, Cabecera, Dialogo, EstadoVacio, MarcaDemo } from './componentes';
import { colores, espacio, radio, texto } from './tema';

/** Nivel que abre «Practicar este tema» y su estado. */
export function nivelParaPracticar(temaId: string, completados: Datos['completados']) {
  const tema = getTema(temaId);
  if (!tema) return undefined;
  const estados = estadosNiveles(niveles, completados);
  const nivel = tema.niveles.find((n) => estados[n.id] !== 'completado') ?? tema.niveles[0];
  return { nivel, estado: estados[nivel.id] };
}

export function CapituloVista({
  capituloId,
  apartado,
  modo,
}: {
  capituloId: string;
  apartado?: string;
  /** «temario»: desde la pestaña; «lectura»: consulta rápida desde una pregunta. */
  modo: 'temario' | 'lectura';
}) {
  const capitulo = getCapitulo(capituloId);
  const completados = useDatos((s) => s.completados);
  const insets = useSafeAreaInsets();
  const scroll = useRef<ScrollViewInstance>(null);
  const posiciones = useRef<Record<string, number>>({});
  const [falta, setFalta] = useState<{ bloqueado: Nivel; falta?: Nivel } | null>(null);

  useEffect(() => {
    if (!apartado) return;
    const t = setTimeout(() => {
      const y = posiciones.current[apartado];
      if (y !== undefined) scroll.current?.scrollTo({ y: Math.max(0, y - espacio.l), animated: true });
    }, 300);
    return () => clearTimeout(t);
  }, [apartado]);

  if (!capitulo) {
    return (
      <View style={[styles.pantalla, { paddingTop: insets.top }]}>
        <Cabecera titulo="Temario" />
        <EstadoVacio icono="document-outline" titulo="Capítulo no encontrado" texto="Vuelve al índice del temario." />
      </View>
    );
  }

  const practica = capitulo.temaId ? nivelParaPracticar(capitulo.temaId, completados) : undefined;

  const practicar = () => {
    if (!practica) return;
    if (practica.estado === 'bloqueado') {
      setFalta({ bloqueado: practica.nivel, falta: nivelActual(niveles, completados) });
      return;
    }
    router.push({ pathname: '/leccion/[nivel]', params: { nivel: practica.nivel.id } });
  };

  return (
    <View style={[styles.pantalla, { paddingTop: insets.top }]} testID="pantalla-capitulo">
      <Cabecera titulo={`Capítulo ${capitulo.numero}`} iconoAtras={modo === 'lectura' ? 'close' : 'arrow-back'} />
      <ScrollView ref={scroll} contentContainerStyle={[styles.contenido, { paddingBottom: espacio.xxl + insets.bottom }]}>
        <Text style={texto.titulo} accessibilityRole="header">
          {capitulo.titulo}
        </Text>
        <MarcaDemo />

        {modo === 'temario' && capitulo.catalogoSenales ? <BannerCatalogo testID="abrir-catalogo" /> : null}

        {modo === 'temario' && practica ? (
          <View style={{ gap: espacio.xs }}>
            <Boton
              titulo="Practicar este tema"
              icono={practica.estado === 'bloqueado' ? 'lock-closed' : 'play'}
              onPress={practicar}
              testID="practicar-tema"
              variante={practica.estado === 'bloqueado' ? 'secundario' : 'primario'}
            />
            <Text style={texto.suave} testID="practicar-detalle">
              {practica.estado === 'bloqueado'
                ? `Bloqueado: completa antes «${tituloNivel(nivelActual(niveles, completados) ?? practica.nivel)}».`
                : practica.estado === 'completado'
                  ? `Tema completado. Repite «${tituloNivel(practica.nivel)}».`
                  : `Abre «${tituloNivel(practica.nivel)}».`}
            </Text>
          </View>
        ) : null}

        {!capitulo.legible ? (
          <View style={styles.aviso} testID="capitulo-pendiente">
            <Text style={texto.cuerpo}>El texto de este capítulo aún no está disponible en la demo.</Text>
            {capitulo.apartados.length ? <Text style={texto.suave}>Apartados previstos:</Text> : null}
          </View>
        ) : null}

        {capitulo.apartados.map((a) => {
          const destacado = a.id === apartado;
          return (
            <View
              key={a.id}
              testID={`apartado-${a.id}`}
              onLayout={(e) => {
                posiciones.current[a.id] = e.nativeEvent.layout.y;
              }}
              style={[styles.apartado, destacado && styles.apartadoDestacado]}
            >
              <Text style={texto.subtitulo}>{a.titulo}</Text>
              {destacado ? <Text style={[texto.etiqueta, { color: colores.acento }]}>Apartado relacionado</Text> : null}
              {a.parrafos.map((p, i) => (
                <Text key={i} style={texto.cuerpo}>
                  {p}
                </Text>
              ))}
            </View>
          );
        })}
      </ScrollView>
      <Dialogo
        visible={!!falta}
        titulo="Lección bloqueada"
        mensaje={
          falta?.falta
            ? `«${tituloNivel(falta.bloqueado)}» se desbloquea al completar «${tituloNivel(falta.falta)}».`
            : undefined
        }
        confirmar={falta?.falta ? `Ir a ${tituloNivel(falta.falta)}` : 'Entendido'}
        cancelar="Cerrar"
        onCancelar={() => setFalta(null)}
        onConfirmar={() => {
          const n = falta?.falta;
          setFalta(null);
          if (n) router.push({ pathname: '/leccion/[nivel]', params: { nivel: n.id } });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { paddingHorizontal: espacio.l, gap: espacio.l, paddingTop: espacio.s },
  aviso: { backgroundColor: colores.superficie, borderRadius: radio.m, padding: espacio.l, gap: espacio.xs },
  apartado: { gap: espacio.s, paddingLeft: espacio.m, borderLeftWidth: 3, borderLeftColor: colores.borde },
  apartadoDestacado: { borderLeftColor: colores.acento },
});
