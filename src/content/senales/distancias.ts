/**
 * Distancia a la que corresponde cada señal de aproximación. Texto propio, no del catálogo:
 * se calcula a partir de la descripción oficial transcrita en datos.ts.
 * El catálogo no fija metros para las balizas de paso a nivel, solo fracciones de la distancia
 * hasta la señal de peligro; los metros del ejemplo son solo un caso de cálculo.
 */
const SALIDA = (m: number) => `Distancia: la salida está a unos ${m} m de este panel.`;

const PROXIMIDAD =
  'Distancia: es la baliza más alejada. Va siempre acompañada de la señal de peligro (P-5, P-7 o P-8), así que está a la misma distancia que ella del paso a nivel o del puente móvil. Por ejemplo, si la señal de peligro está a 150 m, esta baliza también está a 150 m.';
const APROXIMACION =
  'Distancia: a dos tercios de la distancia entre la señal de peligro y el paso. Por ejemplo, si la señal de peligro está a 150 m, esta baliza queda a 100 m.';
const CERCANIA =
  'Distancia: a un tercio de la distancia entre la señal de peligro y el paso; es la baliza más cercana. Por ejemplo, si la señal de peligro está a 150 m, esta baliza queda a 50 m.';

export const DISTANCIAS: Record<string, string> = {
  'S-26a': SALIDA(100),
  'S-26b': SALIDA(200),
  'S-26c': SALIDA(300),
  'P-9a': PROXIMIDAD,
  'P-9b': APROXIMACION,
  'P-9c': CERCANIA,
  'P-10a': PROXIMIDAD,
  'P-10b': APROXIMACION,
  'P-10c': CERCANIA,
};
