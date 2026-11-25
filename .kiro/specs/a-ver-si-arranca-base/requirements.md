# Requisitos · Base navegable de «A Ver si Arranca»

Estado: aprobada el 25-11-2026 con estas decisiones:
- Un nivel tiene 15 preguntas (cambio del 25-11-2026; antes 30) y se completa con 3 fallos como máximo.
- Al corregir una pregunta de lección o repaso: la opción elegida se marca en verde si es correcta y en naranja si es incorrecta; la correcta se marca en verde. Siempre con icono y texto. Fuera de la corrección, el azul es el único acento.
- Demo: nivel 1 de «El conductor y el permiso B» + 3 temas × 4 niveles (13 niveles); simulacro de 30 preguntas y 30 minutos (máximo 3 fallos).
- Comprobación con `tsc`, Jest y recorrido web con Playwright; prueba en Android real a cargo del usuario.
Plataforma: Android (Expo + React Native + TypeScript).
Todo el contenido de preguntas y temario de esta fase es **de demostración, pendiente de revisión**.

## Alcance

Incluido: navegación completa, camino de niveles, temario con un capítulo legible, lecciones, simulacro de demostración, progreso, Mis errores, ajustes de recordatorio y persistencia local.

Excluido: cuentas, servidor, anuncios, pagos, banco definitivo de preguntas, modo visual de examen, tests oficiales, rachas, XP, logros, clasificación y envío real de notificaciones.

## Estados

### Nivel
| Estado | Cuándo | Cómo se ve (además del color) |
|---|---|---|
| Completado | Se han respondido las 15 preguntas con 3 fallos como máximo, al menos una vez | Icono ✓ y texto «Completado». Se puede repetir |
| Disponible (actual) | Primer nivel no completado | Nodo azul, más grande, texto «Empezar» |
| Bloqueado | Su nivel anterior no está completado | Icono de candado y texto «Bloqueado». No navega |

Regla de desbloqueo: completar el nivel N deja disponible el nivel N+1 (orden global del camino, cruzando temas). Un intento con 4 fallos o más termina como «No superado»: el nivel sigue disponible y los fallos se guardan igualmente en Mis errores. Repetir un nivel completado nunca lo vuelve a bloquear ni cambia el estado de los demás.

### Pregunta (dentro de una lección o repaso)
`sin responder` → `seleccionada` (botón «Comprobar» activo) → `comprobada: acierto` | `comprobada: fallo` → «Continuar».
Al comprobar se muestra: resultado (icono + texto «Correcto» / «Incorrecto»), respuesta correcta marcada, explicación breve si hay fallo y enlace «Ver en el temario».

### Pregunta (simulacro)
`sin responder` ↔ `respondida` (se puede cambiar libremente) → `corregida` al entregar o al agotarse el tiempo. Las no respondidas cuentan como fallo.

### Error (Mis errores)
| Desde | Evento | Hacia |
|---|---|---|
| — | Fallo en lección, repaso o simulacro | Pendiente |
| Pendiente | Acierto en el repaso | Corregida |
| Pendiente | Nuevo fallo | Pendiente (suma un fallo) |
| Corregida | Fallo en una sesión posterior (lección, repaso o simulacro) | Pendiente |

## Requisitos y criterios de aceptación

**R1. Navegación.** Cuatro pestañas inferiores: Inicio, Temario, Simulador, Progreso. Mis errores y Ajustes son pantallas secundarias con botón atrás.
- CA1.1 Las cuatro pestañas están visibles en las pantallas principales.
- CA1.2 Durante una lección, un repaso o un simulacro la barra de pestañas no se muestra.
- CA1.3 Salir de una lección o simulacro en curso pide confirmación.

**R2. Inicio.**
- CA2.1 La tarjeta «Continuar» aparece en la primera vista sin desplazarse y muestra tema, nivel y duración estimada.
- CA2.2 Debajo hay un camino vertical de niveles agrupados por tema con los tres estados de la tabla. El camino tiene forma de carretera con curvas: sale de un túnel y cruza un bioma distinto por tramo (15). Entre dos tramos la carretera atraviesa un túnel bajo una cordillera, que marca dónde acaba un bioma y empieza el siguiente. Un coche azul claro espera al principio de la carretera y, cada vez que se completa un nivel, avanza hasta el siguiente. Los niveles son lo que destaca: el paisaje es discreto, sin patrones repetidos, y el único texto es el título de cada tramo y «Empezar» en el nivel actual.
- CA2.3 Tocar un nivel completado o disponible abre su lección; uno bloqueado muestra qué nivel falta.
- CA2.4 Hay acceso directo a Mis errores (con número de pendientes) e icono de Ajustes.
- CA2.5 Si todos los niveles están completados, «Continuar» propone repasar errores o un simulacro.
- CA2.6 El camino tiene un tramo por cada capítulo del temario (15), en su orden. Cada tramo muestra 5 niveles (75 en total). Los capítulos sin preguntas aparecen con 5 niveles «Próximamente» y los temas con preguntas se completan con niveles «Próximamente» hasta 5: no entran en la regla de desbloqueo y, al pulsarlos, se indica el nivel disponible.

**R3. Temario.**
- CA3.1 Índice de capítulos del permiso B marcado como provisional; solo el capítulo de demostración se puede abrir; el resto indica «Próximamente».
- CA3.2 El capítulo de demostración se lee por apartados con anclas.
- CA3.3 «Practicar este tema» abre la lección asociada si está disponible o completada; si está bloqueada, indica qué nivel falta.
- CA3.4 El capítulo «Señales y marcas viales» y el índice del Temario dan acceso, con un banner destacado, a un catálogo con todas las señales del dosier del usuario (`1110950_1.pdf`, sin las páginas 1–8 de la parte 1-45). Las señales se agrupan por familia y tipo, en el orden del dosier. Cada una muestra código, imagen y nombre, y al pulsarla se abre su descripción. El catálogo cita la fuente y está marcado como pendiente de revisión.

**R4. Lección.**
- CA4.0 Al completar un nivel se lanza un confeti sobre el resumen (no si el nivel no se supera, ni si el sistema pide reducir el movimiento).
- CA4.1 Preguntas de tres opciones, sin límite de tiempo. Arriba hay un recuadro numerado por pregunta, como en el simulador, que marca la actual y el resultado de las ya respondidas (✓ verde, ✕ naranja).
- CA4.2 «Comprobar» solo se activa con una opción elegida.
- CA4.3 Tras comprobar se cumple lo descrito en «Pregunta (lección)».
- CA4.4 «Ver en el temario» abre el apartado relacionado.
- CA4.5 Sobre las opciones hay un recuadro horizontal (16:9) para la imagen de la pregunta. Mientras no haya imagen muestra un hueco reservado. Al menos una pregunta incluye en él una escena cenital estática.
- CA4.6 Al terminar se muestra un resumen (aciertos, fallos, «Nivel completado» o «No superado: máximo 3 fallos») y los fallos se guardan en Mis errores.
- CA4.7 Cada nivel tiene 15 preguntas.
- CA4.8 Al comprobar: opción elegida correcta en verde; elegida incorrecta en naranja y la correcta en verde, con texto «Tu respuesta · correcta/incorrecta» o «Respuesta correcta».

**R5. Simulador.**
- CA5.1 Pantalla de preparación con número de preguntas, tiempo y la etiqueta «Simulacro de demostración».
- CA5.2 Se puede navegar entre preguntas y cambiar respuestas antes de entregar.
- CA5.3 «Entregar» pide confirmación y corrige; al agotarse el tiempo corrige automáticamente e indica «Tiempo agotado».
- CA5.4 El resultado se guarda en el historial y los fallos van a Mis errores.

**R6. Progreso.**
- CA6.1 Muestra lecciones completadas, aciertos y fallos por tema e historial de simulacros, calculados a partir de la actividad registrada.
- CA6.2 Sin actividad, muestra un estado inicial sin porcentajes ni cifras inventadas.
- CA6.3 Incluye acceso a Mis errores.

**R7. Mis errores.**
- CA7.1 Dos secciones: Pendientes y Corregidas, con estado vacío propio.
- CA7.2 «Repasar errores» inicia una práctica con todas las pendientes; desactivado si no hay.
- CA7.3 Las transiciones cumplen la tabla «Error».

**R8. Ajustes.**
- CA8.1 Interruptor de recordatorios y selector de hora (activo solo con el interruptor encendido).
- CA8.2 Se guardan localmente.
- CA8.3 Texto visible: «El envío de notificaciones está pendiente de implementación».

**R9. Persistencia.**
- CA9.1 Progreso, resultados, errores y ajustes siguen ahí tras cerrar y reabrir la app.

**R10. Diseño y accesibilidad.**
- CA10.1 Tema oscuro con negros y grises; azul como único acento (acciones, selección, nivel actual).
- CA10.2 Acierto, fallo y bloqueo se distinguen con icono o texto además del color.
- CA10.3 Se respetan las áreas seguras de Android; objetivos táctiles de al menos 48 dp.
- CA10.4 Todo el contenido de demostración lleva la marca «Demo · pendiente de revisión».
