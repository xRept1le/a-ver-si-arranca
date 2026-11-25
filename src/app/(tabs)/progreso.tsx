import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { getTema, temas } from '@/content';
import { listarErrores } from '@/domain/errores';
import { porcentaje, resumenProgreso } from '@/domain/progreso';
import { useDatos } from '@/store/useDatos';
import { EstadoVacio, FilaEnlace, Icono, Pantalla, Tarjeta } from '@/ui/componentes';
import { colores, espacio, texto } from '@/ui/tema';

const fecha = (ms: number) =>
  new Date(ms).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function Progreso() {
  const respuestas = useDatos((s) => s.respuestas);
  const completados = useDatos((s) => s.completados);
  const simulacros = useDatos((s) => s.simulacros);
  const errores = useDatos((s) => s.errores);
  const resumen = resumenProgreso(temas, { respuestas, completados, simulacros });
  const pendientes = listarErrores(errores).pendientes.length;

  return (
    <Pantalla enPestanas testID="pantalla-progreso">
      <View style={{ paddingTop: espacio.m }}>
        <Text style={texto.titulo} accessibilityRole="header">
          Progreso
        </Text>
      </View>

      {!resumen.hayActividad ? (
        <Tarjeta testID="progreso-vacio">
          <EstadoVacio
            icono="trail-sign-outline"
            titulo="Todavía no hay actividad"
            texto="Cuando completes lecciones o simulacros verás aquí tus cifras. Aún no hay nada que calcular."
          />
        </Tarjeta>
      ) : (
        <>
          <Tarjeta testID="progreso-lecciones">
            <Text style={texto.etiqueta}>Lecciones completadas</Text>
            <Text style={styles.grande} testID="lecciones-completadas">
              {`${resumen.leccionesCompletadas} de ${resumen.leccionesTotales}`}
            </Text>
          </Tarjeta>

          <View style={{ gap: espacio.s }}>
            <Text style={texto.etiqueta}>Por tema</Text>
            {resumen.porTema.map((t) => {
              const total = t.aciertos + t.fallos;
              const pct = porcentaje(t.aciertos, total);
              return (
                <Tarjeta key={t.temaId} testID={`tema-${t.temaId}`}>
                  <View style={styles.filaTitulo}>
                    <Text style={[texto.cuerpo, { fontWeight: '700', flex: 1 }]}>{getTema(t.temaId)?.titulo}</Text>
                    <Text style={texto.suave}>{`Niveles ${t.nivelesCompletados}/${t.nivelesTotales}`}</Text>
                  </View>
                  {total === 0 ? (
                    <Text style={texto.suave}>Sin respuestas todavía.</Text>
                  ) : (
                    <View style={styles.cifras}>
                      <Icono nombre="checkmark" color={colores.acierto} tam={16} />
                      <Text style={texto.cuerpo} testID={`aciertos-${t.temaId}`}>{`${t.aciertos} aciertos`}</Text>
                      <Icono nombre="close" color={colores.fallo} tam={16} />
                      <Text style={texto.cuerpo} testID={`fallos-${t.temaId}`}>{`${t.fallos} fallos`}</Text>
                      <Text style={texto.suave}>{`· ${pct}% de acierto`}</Text>
                    </View>
                  )}
                </Tarjeta>
              );
            })}
          </View>
        </>
      )}

      <FilaEnlace
        icono="alert-circle-outline"
        titulo="Mis errores"
        detalle={pendientes === 0 ? 'Sin preguntas pendientes' : `${pendientes} pendiente${pendientes === 1 ? '' : 's'}`}
        onPress={() => router.push('/errores')}
        testID="progreso-errores"
      />

      <View style={{ gap: espacio.s }} testID="historial">
        <Text style={texto.etiqueta}>Historial de simulacros</Text>
        {simulacros.length === 0 ? (
          <Text style={texto.suave}>Aún no has hecho ningún simulacro.</Text>
        ) : (
          simulacros.map((s, i) => (
            <FilaEnlace
              key={s.id}
              icono={s.apto ? 'checkmark-circle-outline' : 'close-circle-outline'}
              titulo={`${s.apto ? 'Apto' : 'No apto'} · ${s.aciertos}/${s.total} aciertos`}
              detalle={`${fecha(s.fecha)} · ${s.porTiempo ? 'Tiempo agotado' : 'Entregado'}`}
              onPress={() => router.push({ pathname: '/resultado/[id]', params: { id: s.id } })}
              testID={`historial-${i}`}
            />
          ))
        )}
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  grande: { fontSize: 28, fontWeight: '800', color: colores.texto },
  filaTitulo: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  cifras: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs, flexWrap: 'wrap' },
});
