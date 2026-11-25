import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colores } from '@/ui/tema';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

const icono =
  (activo: NombreIcono, inactivo: NombreIcono) =>
  ({ focused, color }: { focused: boolean; color: ColorValue; size: number }) => (
    <Ionicons name={focused ? activo : inactivo} color={color as string} size={24} />
  );

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colores.acento,
        tabBarInactiveTintColor: colores.textoSuave,
        tabBarStyle: {
          backgroundColor: colores.fondo,
          borderTopColor: colores.borde,
          height: 64 + insets.bottom,
          paddingTop: 4,
          paddingBottom: 4 + insets.bottom,
        },
        tabBarItemStyle: { height: 56 },
        tabBarLabelStyle: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
        sceneStyle: { backgroundColor: colores.fondo },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio', tabBarButtonTestID: 'tab-inicio', tabBarIcon: icono('home', 'home-outline') }} />
      <Tabs.Screen name="temario" options={{ title: 'Temario', tabBarButtonTestID: 'tab-temario', tabBarIcon: icono('book', 'book-outline') }} />
      <Tabs.Screen name="simulador" options={{ title: 'Simulador', tabBarButtonTestID: 'tab-simulador', tabBarIcon: icono('timer', 'timer-outline') }} />
      <Tabs.Screen name="progreso" options={{ title: 'Progreso', tabBarButtonTestID: 'tab-progreso', tabBarIcon: icono('stats-chart', 'stats-chart-outline') }} />
    </Tabs>
  );
}
