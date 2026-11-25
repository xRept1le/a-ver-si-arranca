# Diseño · Base navegable de «A Ver si Arranca»

## Punto de partida

El repositorio solo contiene `README.md` y `.gitignore`. No hay código que reutilizar. Se propone inicializar con `create-expo-app` (plantilla TypeScript, última SDK estable compatible con Expo Go en el momento de implementar).

## Stack

| Pieza | Elección | Motivo |
|---|---|---|
| Navegación | Expo Router (pestañas + pila) | Rutas por archivos; ocultar pestañas sacando pantallas del grupo `(tabs)` |
| Estado | Zustand + `persist` | Poco código; la lógica vive en funciones puras que se pueden probar |
| Persistencia | `@react-native-async-storage/async-storage` | Local, sin servidor; clave versionada `ava:v1` |
| Escena cenital | `react-native-svg` | Dibujo vectorial estático, sin imágenes externas |
| Áreas seguras | `react-native-safe-area-context` | Incluido en Expo Router |
| Pruebas | Jest (`jest-expo`) para la lógica; recorrido en la versión web con Playwright | Comprobar flujos sin un dispositivo |

## Mapa de pantallas

```
src/app/
├─ _layout.tsx                   Pila raíz (espera a cargar el estado guardado)
├─ (tabs)/_layout.tsx            Barra inferior
│  ├─ index.tsx                  Inicio
│  ├─ temario/index.tsx          Índice de capítulos
│  ├─ temario/[capitulo].tsx     Capítulo (dentro de la pestaña Temario)
│  ├─ simulador.tsx              Preparación del simulacro
│  └─ progreso.tsx               Progreso
├─ leccion/[nivel].tsx           Lección            ─┐
├─ repaso.tsx                    Repaso de errores   │ sin barra de pestañas
├─ simulacro.tsx                 Simulacro en curso  │
├─ lectura/[capitulo].tsx        Temario desde una pregunta (modal)
├─ resultado/[id].tsx            Resultado del simulacro
├─ errores.tsx                   Mis errores (secundaria)
└─ ajustes.tsx                   Ajustes (secundaria)
```

## Pantallas: qué se ve y acción principal

| Pantalla | Al entrar | Acción principal |
|---|---|---|
| Inicio | Cabecera con nombre y ⚙, tarjeta «Continuar», acceso a Mis errores, camino de niveles | Continuar |
| Temario | Aviso «Índice provisional · demo», lista de capítulos | Abrir capítulo |
| Capítulo | Título, apartados legibles, marca demo | Practicar este tema |
| Lección | Barra de progreso, enunciado, escena (si hay), 3 opciones | Comprobar → Continuar |
| Resumen de lección | Aciertos/fallos, aviso de fallos guardados, nivel desbloqueado | Seguir |
| Simulador | Etiqueta demo, nº de preguntas, tiempo, último resultado | Empezar simulacro |
| Simulacro | Temporizador, rejilla de preguntas, opciones | Entregar |
| Resultado | Aprobado/No apto demo, revisión pregunta a pregunta | Volver / Repasar errores |
| Progreso | Lecciones completadas, aciertos y fallos por tema, historial | Ver Mis errores |
| Mis errores | Pendientes / Corregidas | Repasar errores |
| Ajustes | Interruptor, hora, aviso de notificaciones pendientes | Cambiar ajuste |

## Modelo de datos

```ts
// Contenido (src/content/demo/) — separado de la interfaz
Tema      { id, titulo, capituloId, niveles: NivelId[] }
Nivel     { id, temaId, titulo, preguntas: PreguntaId[] }
Pregunta  { id, enunciado, opciones: [string,string,string], correcta: 0|1|2,
            explicacion, apartadoRef: { capituloId, apartadoId }, escena?: EscenaId,
            estado: 'demo-pendiente-revision' }
Capitulo  { id, titulo, legible: boolean, apartados: { id, titulo, texto }[] }

// Estado persistido (clave ava:v1)
nivelesCompletados: Record<NivelId, { veces, ultimaVez }>
respuestas: { preguntaId, temaId, acierto, origen: 'leccion'|'repaso'|'simulacro', sesionId, fecha }[]
errores: Record<PreguntaId, { estado: 'pendiente'|'corregida', fallos, ultimaSesionFallo }>
simulacros: { id, fecha, aciertos, total, porTiempo: boolean, respuestas }[]
ajustes: { recordatorios: boolean, hora: 'HH:MM' }
```

Las cifras de Progreso se derivan de `respuestas`, `nivelesCompletados` y `simulacros`; no se guardan totales aparte. La duración estimada de una lección = nº de preguntas × 40 s, redondeada a minutos (15 preguntas ≈ 10 min).

## Contenido de demostración

- Temas 1 y 2 previstos (`temasPrevistos` en `src/content/demo/temas.ts`): figuran en el camino con 4 niveles sin preguntas cada uno y quedan fuera del desbloqueo, del progreso y del simulacro.
- 3 temas × 4 niveles = 12 niveles; 15 preguntas por nivel (180 en total), en JSON dentro de `src/content/demo/`. Cada bloque temático de 30 preguntas se divide en «parte 1» y «parte 2». Un nivel se completa con 3 fallos como máximo.
- El estado guardado pasa a la versión 2: al migrar se reinician los niveles completados (sus identificadores cambian) y se conservan respuestas, errores, simulacros y ajustes.
- Capítulo legible: «Prioridad de paso», enlazado al tema del mismo nombre. Contiene la escena cenital (cruce sin señalizar).
- Simulacro demo: 30 preguntas, 30 minutos. Apto con 3 fallos como máximo. Las casillas de las preguntas van en una fila desplazable que sigue a la pregunta actual. No se presenta como el formato oficial.
- Sin enlaces a fuentes oficiales salvo que la URL concreta se haya comprobado.

### Catálogo de señales

- Fuente: «Catálogo de señales de circulación» (MOPT), PDF facilitado por el usuario en dos partes (`1110950_1-1-45.pdf`, `1110950_1-46-99.pdf`). Se omiten las páginas 1–8 de la primera parte, las portadas de sección y la contraportada.
- 412 entradas: 51 de peligro, 77 de reglamentación, 215 de indicación y 69 pictogramas. Los tipos siguen las cabeceras del dosier; los seis tipos de orientación llevan el subgrupo «Orientación».
- Las imágenes son recortes del PDF en WebP (lado máximo 320 px, 2,4 MB en total) en `assets/senales/`. Los textos se transcribieron leyendo cada página; nada está escrito de memoria.
- Contenido en `src/content/senales/`: `tipos.ts` y `index.ts` a mano (familias, tipos, fuente); `datos.ts` e `imagenes.ts` generados por `herramientas/senales/`.
- Rutas: `/temario/catalogo-senales` (índice por familia y tipo) y `/temario/catalogo-senales/[tipo]` (rejilla). La ficha de cada señal es un modal con «Anterior» y «Siguiente» dentro del tipo.
- La edición del catálogo es antigua: algunas señales pueden haber cambiado. Se indica en la propia pantalla.

## Identidad visual

- Fondo `#0B0B0C`, superficies `#16171A` / `#202227`, texto `#F2F2F3` / `#A0A3AB`, acento azul `#3B82F6`.
- Corrección en lecciones y repasos: verde `#22C55E` para la respuesta correcta y naranja `#F97316` para la elegida incorrecta, con iconos ✓ / ✕ y texto. En resúmenes y listas, acierto y fallo siguen en grises con icono.
- Recuadro de imagen 16:9 sobre las opciones; la escena cenital se dibuja dentro sin deformarse.
- Camino de niveles (`src/ui/CaminoNiveles.tsx`, paisaje en `src/ui/Paisaje.tsx`): carretera en SVG que zigzaguea con amplitud ligeramente irregular. Los nodos muestran solo el número del nivel, ✓ si está completado o ▶ en el actual, que además lleva un halo y la pastilla «Empezar»; el estado completo va en la etiqueta accesible. Cada tramo tiene un cartel pequeño junto a la calzada (número y título). El paisaje se compone con `componerPaisaje`: un campo de densidad agrupa los árboles en bosquecillos y bordes, los animales y elementos singulares son escasos y separados (al menos 300 px entre uno y otro), y nada se coloca sobre la calzada, los nodos ni los carteles. Cada tramo de campo tiene su carácter (prado, bosque, cultivo). El camino sale de un túnel excavado en una ladera con pinos. El penúltimo tramo atraviesa un pueblo (señal S-500 «VILLARRANCA», casas encaladas con tejado de teja, una iglesia con campanario, huertos y farolas espaciadas). Los fondos de campo, pueblo y ciudad se funden en 220 px, los caracteres de los tramos de campo se mezclan en 160 px junto a cada límite, los árboles escasean al acercarse al pueblo y las casas continúan en la entrada de la ciudad, cuyos edificios empiezan bajos. La ciudad se anuncia con un cartel de orientación azul sobre la calzada (identificador «T-5», destino «Ciudad» y flechas de carril). La calzada se ensancha de forma gradual al entrar en la ciudad, donde los edificios siguen la calle sin invadir la acera y las farolas se reparten a intervalos regulares. Un paso de peatones por tramo urbano y línea de meta al final. Tonos apagados.
