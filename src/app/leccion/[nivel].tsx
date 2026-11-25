import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getNivel, niveles, REGLAS, tituloNivel, type Nivel } from '@/content';
import { nivelQueFalta } from '@/domain/niveles';
import { useDatos } from '@/store/useDatos';
import { Boton, Cabecera, EstadoVacio, Icono, Pantalla, Tarjeta } from '@/ui/componentes';
import { SesionPractica, type ResultadoSesion } from '@/ui/SesionPractica';
import { colores, espacio, texto } from '@/ui/tema';

export default function Leccion() {
  const { nivel: nivelId } = useLocalSearchParams<{ nivel: string }>();
  const nivel = getNivel(nivelId);
  const terminarLeccion = useDatos((s) => s.terminarLeccion);
  const completados = useDatos((s) => s.completados);
  const [cierre, setCierre] = useState<{ superado: boolean; desbloqueado?: Nivel }>();
  // Se calcula al entrar: completar la lección no debe cambiar lo que se muestra.
  const [falta] = useState(() => (nivel ? nivelQueFalta(niveles, completados, nivel.id) : undefined));

  if (!nivel) {
    return (
      <Pantalla cabecera={<Cabecera titulo="Lección" />}>
        <EstadoVacio icono="help-circle-outline" titulo="Lección no encontrada" texto="Vuelve a Inicio y elige un nivel." />
      </Pantalla>
    );
  }

  if (falta) {
    return (
      <Pantalla cabecera={<Cabecera titulo={tituloNivel(nivel)} />} testID="leccion-bloqueada">
        <EstadoVacio
          icono="lock-closed-outline"
          titulo="Nivel bloqueado"
          texto={`Completa antes «${tituloNivel(falta)}» con ${REGLAS.maxFallosNivel} fallos como máximo.`}
        />
      </Pantalla>
    );
  }

  const onTerminar = (r: ResultadoSesion) => {
    const yaCompletado = !!useDatos.getState().completados[nivel.id];
    const superado = terminarLeccion(nivel.id, r.fallos);
    const siguiente = niveles[niveles.indexOf(nivel) + 1];
    setCierre({ superado, desbloqueado: superado && !yaCompletado ? siguiente : undefined });
  };

  return (
    <SesionPractica
      key={nivel.id}
      titulo={tituloNivel(nivel)}
      preguntas={nivel.preguntas}
      origen="leccion"
      onTerminar={onTerminar}
      renderResumen={(r) => <Resumen nivel={nivel} resultado={r} superado={!!cierre?.superado} desbloqueado={cierre?.desbloqueado} />}
    />
  );
}

function Resumen({
  nivel,
  resultado,
  superado,
  desbloqueado,
}: {
  nivel: Nivel;
  resultado: ResultadoSesion;
  superado: boolean;
  desbloqueado?: Nivel;
}) {
  return (
    <>
      <View style={styles.cabecera}>
        <Icono nombre={superado ? 'checkmark-circle' : 'close-circle'} color={superado ? colores.acierto : colores.fallo} tam={56} />
        <Text style={texto.titulo} testID="resumen-titulo">
          {superado ? 'Nivel completado' : 'Nivel no superado'}
        </Text>
        <Text style={[texto.suave, { textAlign: 'center' }]}>
          {superado
            ? `Has terminado «${nivel.titulo}» con ${resultado.fallos} fallo${resultado.fallos === 1 ? '' : 's'}.`
            : `Has tenido ${resultado.fallos} fallos. Para completar el nivel se permiten ${REGLAS.maxFallosNivel} como máximo.`}
        </Text>
      </View>

      <View style={styles.cifras}>
        <Tarjeta estilo={styles.cifra}>
          <Icono nombre="checkmark" color={colores.acierto} />
          <Text style={styles.numero} testID="resumen-aciertos">{resultado.aciertos}</Text>
          <Text style={texto.suave}>Aciertos</Text>
        </Tarjeta>
        <Tarjeta estilo={styles.cifra}>
          <Icono nombre="close" color={colores.fallo} />
          <Text style={styles.numero} testID="resumen-fallos">{resultado.fallos}</Text>
          <Text style={texto.suave}>Fallos</Text>
        </Tarjeta>
      </View>

      {resultado.fallos > 0 ? (
        <Text style={texto.suave}>
          {`${resultado.fallos === 1 ? 'La pregunta fallada se ha guardado' : 'Las preguntas falladas se han guardado'} en Mis errores.`}
        </Text>
      ) : null}

      {desbloqueado ? (
        <Tarjeta estilo={{ borderColor: colores.acento }} testID="desbloqueado">
          <Text style={[texto.etiqueta, { color: colores.acento }]}>Nivel desbloqueado</Text>
          <Text style={texto.subtitulo}>{tituloNivel(desbloqueado)}</Text>
          <Text style={texto.suave}>{desbloqueado.titulo}</Text>
        </Tarjeta>
      ) : null}

      <View style={{ gap: espacio.s }}>
        {desbloqueado ? (
          <Boton
            titulo="Siguiente nivel"
            icono="play"
            testID="siguiente-nivel"
            onPress={() => router.replace({ pathname: '/leccion/[nivel]', params: { nivel: desbloqueado.id } })}
          />
        ) : null}
        {!superado ? (
          <Boton
            titulo="Repetir nivel"
            icono="refresh"
            testID="repetir-nivel"
            onPress={() => router.replace({ pathname: '/leccion/[nivel]', params: { nivel: nivel.id } })}
          />
        ) : null}
        {resultado.fallos > 0 ? (
          <Boton titulo="Ver Mis errores" variante="secundario" onPress={() => router.replace('/errores')} testID="resumen-errores" />
        ) : null}
        <Boton titulo="Volver a Inicio" variante={desbloqueado || !superado ? 'secundario' : 'primario'} onPress={() => router.dismissTo('/')} testID="volver-inicio" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cabecera: { alignItems: 'center', gap: espacio.s, paddingTop: espacio.l },
  cifras: { flexDirection: 'row', gap: espacio.m },
  cifra: { flex: 1, alignItems: 'center' },
  numero: { fontSize: 32, fontWeight: '800', color: colores.texto },
});
