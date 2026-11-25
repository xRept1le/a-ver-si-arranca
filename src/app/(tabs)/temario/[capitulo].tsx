import { useLocalSearchParams } from 'expo-router';

import { CapituloVista } from '@/ui/CapituloVista';

export default function CapituloTemario() {
  const { capitulo, apartado } = useLocalSearchParams<{ capitulo: string; apartado?: string }>();
  return <CapituloVista capituloId={capitulo} apartado={apartado} modo="temario" />;
}
