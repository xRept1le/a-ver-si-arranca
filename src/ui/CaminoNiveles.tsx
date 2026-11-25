import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { niveles, temas, tituloNivel, type Nivel } from '@/content';
import { estadosNiveles, nivelActual, nivelQueFalta, type EstadoNivel } from '@/domain/niveles';
import { useDatos } from '@/store/useDatos';
import { Dialogo, Icono, type NombreIcono } from './componentes';
import { colores, espacio, texto } from './tema';

const NODO = 60;
const NODO_ACTUAL = 72;

const ICONO: Record<EstadoNivel, NombreIcono> = {
  completado: 'checkmark',
  disponible: 'play',
  bloqueado: 'lock-closed',
};

const TEXTO_ESTADO: Record<EstadoNivel, string> = {
  completado: 'Completado · Repetir',
  disponible: 'Empezar',
  bloqueado: 'Bloqueado',
};

/** Camino vertical de niveles agrupados por tema («tramos»). */
export function CaminoNiveles() {
  const completados = useDatos((s) => s.completados);
  const estados = estadosNiveles(niveles, completados);
  const actual = nivelActual(niveles, completados);
  const indiceActual = actual ? niveles.indexOf(actual) : niveles.length;
  const [bloqueado, setBloqueado] = useState<{ nivel: Nivel; falta?: Nivel } | null>(null);

  const pulsar = (nivel: Nivel) => {
    if (estados[nivel.id] === 'bloqueado') {
      setBloqueado({ nivel, falta: nivelQueFalta(niveles, completados, nivel.id) });
      return;
    }
    router.push({ pathname: '/leccion/[nivel]', params: { nivel: nivel.id } });
  };

  return (
    <View testID="camino">
      {temas.map((tema, t) => (
        <View key={tema.id} style={{ marginBottom: espacio.s }}>
          <View style={styles.tramo}>
            <Text style={texto.etiqueta}>{`Tramo ${t + 1}`}</Text>
            <Text style={texto.subtitulo}>{tema.titulo}</Text>
          </View>
          {tema.niveles.map((nivel) => {
            const i = niveles.indexOf(nivel);
            const estado = estados[nivel.id];
            const esActual = i === indiceActual;
            const tam = esActual ? NODO_ACTUAL : NODO;
            return (
              <Pressable
                key={nivel.id}
                accessibilityRole="button"
                accessibilityLabel={`${tituloNivel(nivel)}, ${nivel.titulo}. ${TEXTO_ESTADO[estado]}`}
                accessibilityState={{ disabled: estado === 'bloqueado' }}
                testID={`nivel-${nivel.id}`}
                onPress={() => pulsar(nivel)}
                style={styles.fila}
              >
                <View style={styles.carril}>
                  <View style={[styles.tramoLinea, { backgroundColor: i <= indiceActual && i > 0 ? colores.acento : colores.borde, opacity: i === 0 ? 0 : 1 }]} />
                  <View
                    style={[
                      styles.nodo,
                      { width: tam, height: tam, borderRadius: tam / 2 },
                      estado === 'completado' && styles.nodoCompletado,
                      esActual && styles.nodoActual,
                      estado === 'bloqueado' && styles.nodoBloqueado,
                    ]}
                  >
                    <Icono
                      nombre={ICONO[estado]}
                      tam={esActual ? 30 : 24}
                      color={esActual ? colores.sobreAcento : estado === 'bloqueado' ? colores.textoTenue : colores.texto}
                    />
                  </View>
                  <View
                    style={[
                      styles.tramoLinea,
                      {
                        backgroundColor: i < indiceActual ? colores.acento : colores.borde,
                        opacity: i === niveles.length - 1 ? 0 : 1,
                      },
                    ]}
                  />
                </View>
                <View style={styles.info}>
                  <Text style={[texto.cuerpo, { fontWeight: '700' }, estado === 'bloqueado' && { color: colores.textoSuave }]}>
                    {`Nivel ${nivel.numero} · ${nivel.titulo}`}
                  </Text>
                  <View style={styles.estado}>
                    <Text style={[styles.estadoTexto, esActual && { color: colores.acento }]} testID={`estado-${nivel.id}`}>
                      {TEXTO_ESTADO[estado]}
                    </Text>
                    <Text style={texto.suave}>{` · ${nivel.preguntas.length} preguntas`}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
      <Dialogo
        visible={!!bloqueado}
        titulo="Nivel bloqueado"
        mensaje={
          bloqueado?.falta
            ? `Para desbloquear «${tituloNivel(bloqueado.nivel)}», completa antes «${tituloNivel(bloqueado.falta)}» con 3 fallos como máximo.`
            : undefined
        }
        confirmar={bloqueado?.falta ? `Ir a ${tituloNivel(bloqueado.falta)}` : 'Entendido'}
        cancelar="Cerrar"
        onCancelar={() => setBloqueado(null)}
        onConfirmar={() => {
          const falta = bloqueado?.falta;
          setBloqueado(null);
          if (falta) router.push({ pathname: '/leccion/[nivel]', params: { nivel: falta.id } });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tramo: { paddingVertical: espacio.s, gap: 2 },
  fila: { flexDirection: 'row', alignItems: 'center', minHeight: 104 },
  carril: { width: 88, alignItems: 'center', alignSelf: 'stretch' },
  tramoLinea: { width: 4, flex: 1, borderRadius: 2 },
  nodo: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.superficieAlta,
    borderWidth: 3,
    borderColor: colores.bordeFuerte,
  },
  nodoCompletado: { borderColor: colores.acierto, backgroundColor: colores.superficie },
  nodoActual: { backgroundColor: colores.acentoRelleno, borderColor: colores.acento, borderWidth: 4 },
  nodoBloqueado: { borderStyle: 'dashed', borderColor: colores.borde, backgroundColor: colores.fondo },
  info: { flex: 1, paddingLeft: espacio.s, gap: 2 },
  estado: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  estadoTexto: { fontSize: 14, fontWeight: '700', color: colores.textoSuave },
});
