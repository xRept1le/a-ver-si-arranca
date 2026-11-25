# Tareas · Base navegable de «A Ver si Arranca»

No se empieza ninguna tarea hasta que apruebes el esquema de Inicio y la navegación.

- [ ] 1. Inicializar el proyecto
  - Crear `a-ver-si-arranca/` con `create-expo-app` (plantilla TypeScript con Expo Router) y dejar solo lo necesario.
  - Instalar las dependencias de `design.md` con `npx expo install`.
  - Configurar el modo oscuro en `app.json`, el nombre «A Ver si Arranca» y el paquete Android.
  - Aceptación: `tsc --noEmit` y `npx expo-doctor` terminan sin errores.

- [ ] 2. Tema visual y componentes base
  - Tokens de color y tipografía; Botón, Tarjeta, Opción de respuesta, Nodo de nivel, Etiqueta de estado y Aviso de demostración.
  - Aceptación: cada estado (acierto, fallo, bloqueado, seleccionado) lleva icono y texto; los controles miden ≥ 48 dp.

- [ ] 3. Contenido de demostración
  - Índice de capítulos, capítulo «Prioridad de paso», 6 niveles, preguntas y banco del simulacro en `src/content`.
  - Aceptación: ningún componente de `app/` contiene textos de preguntas; todas las preguntas tienen `revisado: false`.

- [ ] 4. Lógica de dominio y store persistido
  - Funciones puras: estado de cada nivel, nivel actual, transiciones de errores, cifras de Progreso y corrección del simulacro.
  - Store Zustand con `persist` (AsyncStorage), versión 1 y recuperación ante datos dañados.
  - Aceptación: las pruebas unitarias de `src/domain` pasan.

- [ ] 5. Navegación
  - Stack raíz, 4 pestañas, pantallas secundarias y pantallas a pantalla completa.
  - Aceptación: la barra de pestañas no aparece en Lección, Repaso ni Simulacro; Ajustes y Mis errores tienen botón de volver.

- [ ] 6. Inicio
  - «Continuar», acceso a Mis errores, icono de Ajustes y camino de niveles por tema.
  - Aceptación: con estado inicial solo el nivel 1 está disponible; tras completarlo, el nivel 2 pasa a disponible y «Continuar» apunta a él.

- [ ] 7. Lección y resumen
  - Elegir, Comprobar, resultado, explicación, enlace al temario, escena cenital y resumen.
  - Aceptación: «Comprobar» está desactivado sin opción elegida; un fallo aparece en Mis errores › Pendientes al terminar.

- [ ] 8. Temario
  - Índice, lectura del capítulo y «Practicar este tema» con aviso de bloqueo.
  - Aceptación: desde un tema bloqueado se ve el nombre del nivel que falta; desde uno disponible se abre la lección.

- [ ] 9. Simulador
  - Preparación, simulacro con temporizador y rejilla, entrega con confirmación, entrega por tiempo y resultado.
  - Aceptación: al agotarse el tiempo se corrige solo y las preguntas sin responder cuentan como fallo; el resultado aparece en Progreso.

- [ ] 10. Mis errores y repaso
  - Segmentos Pendientes y Corregidas, estados vacíos y repaso.
  - Aceptación: acertar en el repaso mueve la pregunta a Corregidas; volver a fallarla en otra sesión la devuelve a Pendientes.

- [ ] 11. Progreso
  - Lecciones completadas, aciertos y fallos por tema, historial y estado inicial.
  - Aceptación: sin actividad no se muestra ningún porcentaje ni cifra distinta de cero.

- [ ] 12. Ajustes
  - Interruptor, selector de hora, aviso de notificaciones pendientes y borrar progreso.
  - Aceptación: tras recargar la app se conservan el interruptor y la hora.

- [ ] 13. Comprobación final
  - Lint, tipos, pruebas unitarias, export de Android y recorrido con Playwright en web:
    1. Abrir una lección desde Inicio y desde Temario.
    2. Completar un nivel y desbloquear el siguiente.
    3. Fallar una pregunta, recargar la app y encontrarla en Pendientes.
    4. Acertarla en el repaso y verla en Corregidas.
    5. Entregar un simulacro, dejar que otro se agote por tiempo y ver ambos en Progreso.
  - Aceptación: los cinco recorridos pasan; informe con instrucciones para Expo Go y la lista de lo que sigue siendo de demostración.
