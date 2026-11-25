# Tareas · Base navegable de «A Ver si Arranca»

Cada tarea indica los criterios de aceptación (CA) de `requirements.md` que cubre.

- [x] 1. Inicializar Expo (SDK 58) + TypeScript + Expo Router; tema oscuro y componentes base (botón, tarjeta, marca demo). · CA10.1, CA10.3, CA10.4
- [x] 2. Contenido de demostración en `src/content/demo/` (3 temas, 12 niveles de 15 preguntas, temario, escena). · CA3.1, CA4.5, CA4.7
- [x] 3. Lógica pura en `src/domain/` con pruebas Jest: estado de niveles, transiciones de errores, estadísticas, corrección de simulacro. · CA2.2, CA7.3, CA6.1, CA5.3
- [x] 4. Store persistido (Zustand + AsyncStorage, clave `ava:v1`). · CA9.1, CA8.2
- [x] 5. Navegación: pestañas y pantallas fuera de pestañas. · CA1.1–CA1.3
- [x] 6. Inicio: Continuar, camino de niveles, accesos. · CA2.1–CA2.5
- [x] 7. Temario: índice, capítulo legible, «Practicar este tema». · CA3.1–CA3.3
- [x] 8. Lección y repaso: flujo Comprobar, explicación, enlace al temario, resumen. · CA4.1–CA4.8, CA7.2
- [x] 9. Simulador: preparación, simulacro con temporizador, resultado. · CA5.1–CA5.4
- [x] 10. Progreso con estado inicial. · CA6.1–CA6.3
- [x] 11. Mis errores y Ajustes. · CA7.1–CA7.3, CA8.1–CA8.3
- [x] 12. Comprobación final: `tsc`, Jest (18 pruebas), bundle de Android y recorrido web con Playwright (46 comprobaciones, `e2e/`).
- [x] 13. Instrucciones para abrir en Android con Expo Go (README).

## Decisiones tomadas durante la implementación

- Cada respuesta de lección o repaso se guarda al pulsar «Comprobar». Así un fallo llega a Mis errores aunque se cierre la app a mitad de la lección. El nivel solo cuenta como completado al terminar las 30 preguntas.
- Un acierto fuera del repaso no mueve una pregunta a Corregidas; solo el repaso lo hace.
- La consulta del temario desde una pregunta se abre por encima de la lección (`/lectura/[capitulo]`), sin perder la pregunta en curso.
- Una lección bloqueada abierta por enlace directo muestra qué nivel falta en lugar de las preguntas.

## Pendiente fuera de esta fase

- Prueba en un dispositivo Android real (a cargo del usuario).
- Revisión del contenido por un experto y textos de los capítulos que solo tienen índice.
- Envío real de recordatorios (expo-notifications).
