import { useLocalSearchParams } from 'expo-router';

import { CapituloVista } from '@/ui/CapituloVista';

/** Consulta del temario desde una pregunta, sin salir de la lección. */
export default function Lectura() {
  const { capitulo, apartado } = useLocalSearchParams<{ capitulo: string; apartado?: string }>();
  return <CapituloVista capituloId={capitulo} apartado={apartado} modo="lectura" />;
}
