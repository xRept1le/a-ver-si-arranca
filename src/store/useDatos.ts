import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getPregunta, REGLAS } from '@/content';
import { aplicarAErrores } from '@/domain/errores';
import { nivelSuperado } from '@/domain/niveles';
import { datosIniciales, type Ajustes, type Datos, type Origen, type ResultadoSimulacro } from '@/domain/types';

interface Acciones {
  /** Guarda una respuesta de lección o repaso en el momento de comprobarla. */
  registrarRespuesta: (preguntaId: string, acierto: boolean, origen: Exclude<Origen, 'simulacro'>, sesionId: string) => void;
  /** Cierra una lección. Devuelve si el nivel se ha superado en este intento. */
  terminarLeccion: (nivelId: string, fallos: number) => boolean;
  guardarSimulacro: (resultado: ResultadoSimulacro) => void;
  cambiarAjustes: (cambios: Partial<Ajustes>) => void;
}

export type Store = Datos & Acciones;

export const CLAVE_ALMACEN = 'ava:v1';

export const useDatos = create<Store>()(
  persist(
    (set, get) => ({
      ...datosIniciales(),

      registrarRespuesta: (preguntaId, acierto, origen, sesionId) => {
        const temaId = getPregunta(preguntaId)?.tema.id ?? 'desconocido';
        const fecha = Date.now();
        set((s) => ({
          respuestas: [...s.respuestas, { preguntaId, temaId, acierto, origen, sesionId, fecha }],
          errores: aplicarAErrores(s.errores, { preguntaId, acierto, origen, sesionId, fecha }),
        }));
      },

      terminarLeccion: (nivelId, fallos) => {
        const superado = nivelSuperado(fallos, REGLAS.maxFallosNivel);
        if (superado) {
          const previo = get().completados[nivelId];
          set((s) => ({
            completados: {
              ...s.completados,
              [nivelId]: { veces: (previo?.veces ?? 0) + 1, ultimaVez: Date.now() },
            },
          }));
        }
        return superado;
      },

      guardarSimulacro: (resultado) => {
        set((s) => {
          let errores = s.errores;
          const respuestas = [...s.respuestas];
          for (const r of resultado.respuestas) {
            const temaId = getPregunta(r.preguntaId)?.tema.id ?? 'desconocido';
            respuestas.push({
              preguntaId: r.preguntaId,
              temaId,
              acierto: r.acierto,
              origen: 'simulacro',
              sesionId: resultado.id,
              fecha: resultado.fecha,
            });
            errores = aplicarAErrores(errores, {
              preguntaId: r.preguntaId,
              acierto: r.acierto,
              origen: 'simulacro',
              sesionId: resultado.id,
              fecha: resultado.fecha,
            });
          }
          return { simulacros: [resultado, ...s.simulacros], respuestas, errores };
        });
      },

      cambiarAjustes: (cambios) => set((s) => ({ ajustes: { ...s.ajustes, ...cambios } })),
    }),
    {
      name: CLAVE_ALMACEN,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ completados, respuestas, errores, simulacros, ajustes }) => ({
        completados,
        respuestas,
        errores,
        simulacros,
        ajustes,
      }),
    },
  ),
);

/** `true` cuando ya se han cargado los datos guardados en el dispositivo. */
export function useDatosCargados() {
  const [cargados, setCargados] = useState(() => useDatos.persist.hasHydrated());
  useEffect(() => {
    const quitar = useDatos.persist.onFinishHydration(() => setCargados(true));
    if (useDatos.persist.hasHydrated()) setCargados(true);
    return quitar;
  }, []);
  return cargados;
}

export const nuevoId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
