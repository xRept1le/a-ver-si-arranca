import { useLocalSearchParams } from 'expo-router';

import { TipoCatalogo } from '@/ui/CatalogoSenales';

export default function TipoSenalCatalogo() {
  const { tipo } = useLocalSearchParams<{ tipo: string }>();
  return <TipoCatalogo tipoId={tipo} />;
}
