import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { REGLAS } from '@/content';
import { formatoTiempo } from '@/domain/simulacro';
import { useDatos } from '@/store/useDatos';
import { Boton, FilaEnlace, Icono, MarcaDemo, Pantalla, Tarjeta } from '@/ui/componentes';
import { colores, espacio, texto } from '@/ui/tema';

const fecha = (ms: number) =>
  new Date(ms).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default function Simulador() {
  const ultimo = useDatos((s) => s.simulacros[0]);
  const { preguntas, segundos, maxFallos } = REGLAS.simulacro;

  return (
    <Pantalla enPestanas testID="pantalla-simulador">
      <View style={{ gap: espacio.s, paddingTop: espacio.m }}>
        <Text style={texto.titulo} accessibilityRole="header">
          Simulador
        </Text>
        <MarcaDemo texto="Simulacro de demostración" />
      </View>

      <Tarjeta>
        <Text style={texto.subtitulo}>Simulacro</Text>
        {[
          { icono: 'help-circle-outline' as const, t: `${preguntas} preguntas de tres opciones` },
          { icono: 'timer-outline' as const, t: `${formatoTiempo(segundos)} minutos en total` },
          { icono: 'checkmark-done-outline' as const, t: `Apto con ${maxFallos} ${(maxFallos as number) === 1 ? 'fallo' : 'fallos'} como máximo` },
          { icono: 'swap-horizontal-outline' as const, t: 'Puedes cambiar respuestas antes de entregar' },
          { icono: 'alarm-outline' as const, t: 'Se corrige al entregar o al agotarse el tiempo' },
        ].map((f) => (
          <View key={f.t} style={{ flexDirection: 'row', gap: espacio.s, alignItems: 'center' }}>
            <Icono nombre={f.icono} color={colores.textoSuave} tam={18} />
            <Text style={texto.cuerpo}>{f.t}</Text>
          </View>
        ))}
        <Text style={[texto.suave, { marginTop: espacio.s }]}>
          Es una demostración: el número de preguntas, el tiempo y el criterio de aprobado no reproducen el examen oficial.
        </Text>
        <Boton titulo="Empezar simulacro" icono="play" onPress={() => router.push('/simulacro')} testID="empezar-simulacro" estilo={{ marginTop: espacio.s }} />
      </Tarjeta>

      {ultimo ? (
        <View style={{ gap: espacio.s }}>
          <Text style={texto.etiqueta}>Último resultado</Text>
          <FilaEnlace
            icono={ultimo.apto ? 'checkmark-circle-outline' : 'close-circle-outline'}
            titulo={`${ultimo.apto ? 'Apto' : 'No apto'} · ${ultimo.aciertos}/${ultimo.total} aciertos`}
            detalle={`${fecha(ultimo.fecha)}${ultimo.porTiempo ? ' · Tiempo agotado' : ''}`}
            onPress={() => router.push({ pathname: '/resultado/[id]', params: { id: ultimo.id } })}
            testID="ultimo-simulacro"
          />
        </View>
      ) : null}
    </Pantalla>
  );
}
