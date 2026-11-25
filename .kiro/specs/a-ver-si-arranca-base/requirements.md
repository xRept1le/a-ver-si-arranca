# Requisitos · Base navegable de «A Ver si Arranca»

Estado: **borrador pendiente de aprobación**. Plataforma inicial: Android.

## Alcance

Incluido: navegación completa, camino de niveles, temario de demostración, lecciones, simulacro de demostración, progreso, Mis errores, ajustes y persistencia local.

Fuera de esta fase: cuentas, servidor, anuncios, pagos, banco definitivo de preguntas, modo visual de examen, tests oficiales, rachas, XP, logros y clasificación. El envío real de notificaciones también queda pendiente.

## Glosario

- **Nivel**: una lección del camino de Inicio, asociada a un tema.
- **Tema**: grupo de niveles; corresponde a un capítulo del temario.
- **Simulacro**: test con tiempo que se corrige al entregarlo o al agotarse el tiempo.
- **Error pendiente / corregido**: estado de una pregunta en Mis errores.
- **Contenido de demostración**: preguntas y textos provisionales, pendientes de revisión.

## Requisitos

### R1 · Navegación
1. La app muestra cuatro pestañas inferiores: Inicio, Temario, Simulador y Progreso.
2. Mis errores y Ajustes se abren como pantallas secundarias, con botón de volver.
3. Durante una lección, un repaso o un simulacro no se ve la barra de pestañas.
4. Al salir de una lección o simulacro a medias, la app pide confirmación y descarta esa sesión.

### R2 · Inicio
1. La primera vista muestra la tarjeta «Continuar» con el próximo nivel, su tema y la duración estimada («≈ N min»).
2. Debajo hay un camino vertical de niveles agrupados por tema.
3. Cada nivel muestra uno de tres estados: completado, disponible o bloqueado. Cada estado tiene icono y texto, además del color.
4. Completar un nivel desbloquea el siguiente. Un nivel completado se puede repetir.
5. Si todos los niveles están completados, «Continuar» lo indica y ofrece repasar errores.
6. Hay acceso directo a Mis errores (con número de pendientes) y un icono de Ajustes.

### R3 · Temario
1. Muestra el índice de capítulos del permiso B, marcado como índice provisional.
2. Un capítulo de demostración se puede abrir y leer por apartados.
3. «Practicar este tema» abre la lección asociada si está disponible o completada.
4. Si está bloqueada, la app muestra qué nivel falta por completar y permite ir a él.
5. Los capítulos sin contenido muestran «Contenido en preparación».

### R4 · Lección
1. Cada pregunta tiene tres opciones y no hay límite de tiempo.
2. El alumno elige una opción y la confirma con «Comprobar». Antes de comprobar puede cambiarla.
3. Al comprobar se muestran el resultado (acierto o fallo), la respuesta correcta y, si hay fallo, una explicación breve con enlace al apartado del temario.
4. Al menos una pregunta incluye una escena cenital estática (cruce visto desde arriba).
5. Al terminar se muestra un resumen (aciertos, fallos y preguntas falladas) y los fallos se guardan en Mis errores.
6. Terminar la lección marca el nivel como completado.

### R5 · Simulador
1. La pantalla de preparación indica número de preguntas, tiempo y criterio, con la etiqueta «Simulacro de demostración».
2. Durante el simulacro se ve un temporizador y se puede navegar entre preguntas y cambiar respuestas.
3. «Entregar» pide confirmación (indicando las preguntas sin responder) y corrige.
4. Al agotarse el tiempo el simulacro se entrega solo; las preguntas sin responder cuentan como fallo.
5. El resultado muestra apto o no apto de demostración, aciertos, fallos y revisión de cada pregunta.
6. El resultado se guarda en el historial y los fallos se añaden a Mis errores.

### R6 · Progreso
1. Muestra lecciones completadas, aciertos y fallos por tema e historial de simulacros.
2. Todas las cifras se calculan a partir de la actividad registrada.
3. Sin actividad, se muestra un estado inicial sin porcentajes ni cifras inventadas.
4. Hay acceso a Mis errores.

### R7 · Mis errores
1. Muestra dos listas: Pendientes y Corregidas, con estado vacío en cada una.
2. «Repasar errores» inicia una práctica con las pendientes. Está desactivado si no hay pendientes.
3. Acertar una pregunta en el repaso la pasa a Corregidas.
4. Fallar una pregunta corregida en otra sesión (lección, simulacro o repaso) la devuelve a Pendientes.

### R8 · Ajustes
1. Interruptor de recordatorios y selector de hora (activo solo con el interruptor encendido).
2. Las preferencias se guardan en el dispositivo.
3. Un aviso indica que el envío de notificaciones está pendiente de implementación.
4. Una opción «Borrar progreso local», con confirmación, permite repetir las pruebas desde cero.

### R9 · Persistencia
1. Progreso, resultados, errores y ajustes siguen disponibles tras cerrar y reabrir la app.
2. Si los datos guardados están dañados o tienen una versión antigua, la app arranca con estado inicial en lugar de cerrarse.

### R10 · Contenido
1. El contenido de demostración vive en archivos de datos separados de la interfaz.
2. Cada pregunta lleva la marca «Demostración · pendiente de revisión» visible en la interfaz.
3. Solo se enlazan fuentes oficiales cuyo enlace concreto se haya comprobado. Si no se puede comprobar, no se enlaza.

### R11 · Diseño y accesibilidad
1. Interfaz en español, oscura y minimalista: negros y grises como base y azul como único acento (acciones, selección y nivel actual).
2. Aciertos, fallos y bloqueos se distinguen con icono y texto, además del color.
3. Se respetan las áreas seguras de Android (barra de estado y navegación por gestos).
4. Los controles táctiles miden al menos 48 × 48 dp y el texto de lectura tiene al menos 16 sp.
5. Los controles tienen etiquetas de accesibilidad para lectores de pantalla.
