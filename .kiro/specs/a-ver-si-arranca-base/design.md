# Diseño · Base navegable de «A Ver si Arranca»

## Pila técnica

- Expo (última SDK estable al inicializar; hoy SDK 58) + React Native + TypeScript estricto.
- Expo Router para la navegación por archivos.
- Estado con Zustand y `persist` sobre AsyncStorage, con número de versión del esquema.
- `react-native-svg` para la escena cenital, `@expo/vector-icons` para iconos y `@react-native-community/datetimepicker` para la hora.
- Todo es compatible con Expo Go, así que se puede probar en el móvil sin compilar un APK.

## Estructura de carpetas

```
a-ver-si-arranca/
  app/                      rutas (Expo Router)
    _layout.tsx             Stack raíz + SafeAreaProvider + carga del estado
    (tabs)/_layout.tsx      4 pestañas
    (tabs)/index.tsx        Inicio
    (tabs)/temario/index.tsx         Índice
    (tabs)/temario/[capituloId].tsx  Lectura de capítulo
    (tabs)/simulador.tsx    Preparación del simulacro
    (tabs)/progreso.tsx     Progreso
    errores.tsx             Mis errores (secundaria)
    ajustes.tsx             Ajustes (secundaria)
    leccion/[nivelId].tsx   Lección (sin pestañas)
    repaso.tsx              Repaso de errores (sin pestañas)
    simulacro/index.tsx     Simulacro en curso (sin pestañas)
    simulacro/[resultadoId].tsx  Resultado
  src/
    content/                datos de demostración (temario, niveles, preguntas, simulacro)
    domain/                 lógica pura: desbloqueo, errores, progreso, corrección
    store/                  store persistido
    ui/                     tema, componentes (botón, tarjeta, nodo de nivel, opción)
```

Las pantallas que ocultan la barra están en el Stack raíz, fuera de `(tabs)`. Así la barra desaparece sin trucos.

## Mapa de pantallas

```
Stack raíz
├── (tabs)
│   ├── Inicio ─────────┬─► Lección
│   │                   ├─► Mis errores ─► Repaso
│   │                   └─► Ajustes
│   ├── Temario ─► Capítulo ─► «Practicar este tema» ─► Lección (o aviso de bloqueo)
│   ├── Simulador ─► Simulacro ─► Resultado
│   └── Progreso ─┬─► Mis errores
│                 └─► Resultado de un simulacro anterior
├── Lección ─► Resumen ─► Inicio  ·  «Ver en el temario» ─► Capítulo
├── Repaso ─► Resumen ─► Mis errores
└── Simulacro ─► Resultado
```

## Pantallas: qué se ve al entrar y acción principal

| Pantalla | Al entrar | Acción principal |
|---|---|---|
| Inicio | Cabecera con nombre e icono de Ajustes; tarjeta «Continuar»; acceso a Mis errores; camino de niveles | Continuar |
| Temario | Lista de capítulos numerados con estado de su lección | Abrir capítulo |
| Capítulo | Título, apartados y aviso de contenido de demostración | Practicar este tema |
| Lección | Barra de avance «2 de 4», enunciado, escena (si hay) y 3 opciones | Comprobar → Continuar |
| Resumen | Aciertos y fallos, lista de falladas, nivel desbloqueado | Volver al camino |
| Simulador | Ficha: preguntas, tiempo, criterio, etiqueta de demostración y último resultado | Empezar simulacro |
| Simulacro | Temporizador, rejilla de preguntas, enunciado y opciones | Entregar |
| Resultado | Apto / No apto de demostración, cifras y revisión pregunta a pregunta | Volver |
| Progreso | Lecciones completadas, tabla por tema, historial (o estado inicial) | Ver Mis errores |
| Mis errores | Segmento Pendientes / Corregidas con lista | Repasar errores |
| Ajustes | Interruptor, hora, aviso de notificaciones pendientes, borrar progreso | Guardar al cambiar |

## Esquema de Inicio

```
┌──────────────────────────────────────┐
│ A Ver si Arranca                 ⚙   │  ← Ajustes
├──────────────────────────────────────┤
│ CONTINUAR                            │
│ Prioridad de paso · Nivel 3          │
│ 4 preguntas · ≈ 3 min                │
│ [        Continuar  ▶        ]       │  ← botón azul
├──────────────────────────────────────┤
│ ✕ Mis errores · 2 pendientes      ›  │
├──────────────────────────────────────┤
│ TEMA 1 · Señales                     │
│        ✓  Nivel 1 · Completado       │
│        ┆                             │
│        ✓  Nivel 2 · Completado       │
│        ┆                             │
│ TEMA 2 · Prioridad de paso           │
│        ●  Nivel 3 · Disponible       │  ← azul, nodo grande
│        ┆                             │
│        🔒 Nivel 4 · Bloqueado        │
│        ┆                             │
│ TEMA 3 · Velocidad                   │
│        🔒 Nivel 5 · Bloqueado        │
├──────────────────────────────────────┤
│  Inicio   Temario  Simulador Progreso│
└──────────────────────────────────────┘
```

Identidad propia: el camino se dibuja como una carretera vista desde arriba, con línea discontinua central gris. Los nodos son pilotos de salpicadero redondos (✓ completado en gris claro, ● actual en azul con halo, candado en gris oscuro). Los nodos van en zigzag suave a izquierda y derecha de la línea.

## Estados

### Nivel
```
bloqueado ──(se completa el anterior)──► disponible ──(se termina la lección)──► completado
                                                                       └── repetir ──┘
```
- Solo el primer nivel no completado está disponible; es el «nivel actual» y el destino de «Continuar».
- Completar = responder todas las preguntas de la lección (sin nota mínima en esta fase).
- Repetir un nivel completado no cambia su estado; sí registra respuestas y errores.

### Pregunta en lección o repaso
```
sin responder ─(elegir)─► seleccionada ─(Comprobar)─► acierto | fallo ─(Continuar)─► siguiente
                  └─(cambiar opción)─┘
```

### Pregunta en simulacro
- Durante: sin responder | respondida (se puede cambiar).
- Tras corregir: acierto | fallo | sin responder (cuenta como fallo).

### Simulacro
```
preparación ─► en curso ─(Entregar + confirmar | tiempo agotado)─► corregido ─► guardado en historial
                   └─(salir + confirmar)─► descartado
```
- Demostración: 6 preguntas, 3 minutos, apto con 1 fallo como máximo. Son valores de demostración configurables en `src/content`, no las condiciones del examen oficial.

### Mis errores
```
(nueva) ─fallo en cualquier sesión─► pendiente ─acierto en repaso─► corregida
                                         ▲                              │
                                         └──── fallo en otra sesión ────┘
```
- Acertar una pregunta pendiente en una lección normal no la corrige; solo cuenta el repaso.
- Cada error guarda: id de pregunta, estado, veces fallada, fecha del último fallo y de corrección.

## Modelo de datos persistido (versión 1)

```ts
type EstadoGuardado = {
  version: 1;
  nivelesCompletados: Record<NivelId, { primeraVez: string; veces: number }>;
  respuestas: Array<{ preguntaId; temaId; correcta: boolean; origen: 'leccion'|'repaso'|'simulacro'; fecha: string }>;
  errores: Record<PreguntaId, { estado: 'pendiente'|'corregida'; vecesFallada: number; ultimoFallo: string; corregidaEn?: string }>;
  simulacros: Array<{ id; fecha; aciertos; fallos; sinResponder; apto: boolean; porTiempo: boolean; respuestas: Record<PreguntaId, OpcionId|null> }>;
  ajustes: { recordatorios: boolean; hora: string /* 'HH:mm' */ };
};
```

- Desbloqueo, cifras de Progreso y transiciones de errores se calculan con funciones puras en `src/domain`.
- Las cifras de Progreso salen de `respuestas`, `nivelesCompletados` y `simulacros`; no se guarda ningún porcentaje.

## Contenido de demostración

- Índice provisional de capítulos del permiso B. Solo «Prioridad de paso» tiene texto completo.
- 3 temas × 2 niveles = 6 niveles, con 4 preguntas cada uno; banco de simulacro de 6 preguntas.
- Una pregunta de prioridad en cruce sin señalizar incluye escena cenital SVG.
- Todas las preguntas llevan `revisado: false` y la interfaz muestra «Demostración · pendiente de revisión».
- Las fuentes oficiales (DGT, BOE) solo se enlazan si he abierto y comprobado la URL concreta. Si no puedo comprobarla, no hay enlace.

## Tema visual

| Token | Valor | Uso |
|---|---|---|
| fondo | `#0B0B0C` | pantalla |
| superficie | `#17171A` | tarjetas |
| borde | `#2A2A2F` | separadores |
| texto | `#F2F2F3` | principal |
| texto2 | `#A1A1AA` | secundario (contraste ≥ 4.5:1 sobre fondo) |
| acento | `#3B82F6` | botones, selección y nivel actual |

- Acierto: icono ✓ + «Correcto». Fallo: icono ✕ + «Incorrecto». Bloqueo: candado + «Bloqueado».
- Tipografía del sistema: lectura a 16–17 sp y títulos a 22–28 sp. Controles de al menos 48 dp.

## Verificación

- `tsc --noEmit`, `expo lint` y `npx expo-doctor`.
- Pruebas unitarias (Jest) de `src/domain`: desbloqueo, transiciones de errores, cifras de Progreso y corrección del simulacro.
- Recorrido completo en la versión web con Playwright, incluida la recarga para comprobar la persistencia. El simulacro por tiempo se prueba con un reloj simulado.
- `npx expo export --platform android` para comprobar que el bundle de Android compila.
- La prueba final en el dispositivo la haces tú con Expo Go.
