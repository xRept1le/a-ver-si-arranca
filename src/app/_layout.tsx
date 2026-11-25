import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useDatosCargados } from '@/store/useDatos';
import { colores } from '@/ui/tema';

const tema = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colores.acento,
    background: colores.fondo,
    card: colores.fondo,
    text: colores.texto,
    border: colores.borde,
  },
};

export default function RootLayout() {
  const cargados = useDatosCargados();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={tema}>
        <StatusBar style="light" />
        {cargados ? (
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colores.fondo } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="leccion/[nivel]" options={{ gestureEnabled: false }} />
            <Stack.Screen name="repaso" options={{ gestureEnabled: false }} />
            <Stack.Screen name="simulacro" options={{ gestureEnabled: false }} />
            <Stack.Screen name="resultado/[id]" />
            <Stack.Screen name="errores" />
            <Stack.Screen name="ajustes" />
            <Stack.Screen name="lectura/[capitulo]" options={{ presentation: 'modal' }} />
          </Stack>
        ) : (
          <View style={{ flex: 1, backgroundColor: colores.fondo, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colores.acento} />
          </View>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
