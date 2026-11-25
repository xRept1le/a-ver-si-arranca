import { Stack } from 'expo-router';

import { colores } from '@/ui/tema';

export default function TemarioLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colores.fondo } }} />;
}
