// Recorrido de la comprobación final sobre la versión web exportada (dist/).
// No forma parte de la app. `node e2e/generar.js salida.js` sustituye
// __RESPUESTAS__ por el mapa id → correcta de src/content/demo y el resultado
// se ejecuta con la herramienta Playwright (browser_run_code), que sirve dist/
// con page.route en el origen ficticio http://ava.test.
async (pagina, log) => {
  let page = await pagina.context().newPage();
  await pagina.close({ runBeforeUnload: false });
  await page.setViewportSize({ width: 412, height: 892 });
  const R = __RESPUESTAS__;
  const D = '/projects/sandbox/a-ver-si-arranca/dist';
  const ORIGEN = 'http://ava.test';
  const ok = (cond, msg) => {
    if (!cond) throw new Error('FALLO: ' + msg);
    log.push('✓ ' + msg);
  };
  const id = (t) => page.getByTestId(t);
  const vis = (t) => page.locator(`[data-testid="${t}"]:visible`).last();
  const visible = (t) => vis(t).isVisible();
  const esperar = (t, ms = 15000) => vis(t).waitFor({ state: 'visible', timeout: ms });
  const pulsar = (t) => vis(t).click();
  const atras = () => pulsar('boton-atras');
  // El estado de cada nivel no se muestra como texto: va al final de su etiqueta accesible.
  const estado = async (n) => (await vis('nivel-' + n).getAttribute('aria-label')).split('. ').pop();
  const etiqueta = (t) => vis(t).getAttribute('aria-label');
  const centroY = async (t) => {
    const c = await vis(t).boundingBox();
    return c.y + c.height / 2;
  };
  // Espera a que el coche quede parado justo antes del nivel indicado.
  const cocheAntesDe = async (n, ms = 9000) => {
    const limite = Date.now() + ms;
    while (Date.now() < limite) {
      const dy = (await centroY('nivel-' + n)) - (await centroY('coche'));
      if (dy > 10 && dy < 110) return true;
      await page.waitForTimeout(300);
    }
    return false;
  };
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  const FOTOS = '/projects/sandbox/.kiro/artifacts/screenshots/';

  await page.context().unrouteAll({ behavior: 'ignoreErrors' });
  await page.context().route(ORIGEN + '/**', async (route) => {
    const p = decodeURIComponent(route.request().url().replace(ORIGEN, '').split('?')[0].split('#')[0]);
    const archivo = /^\/(_expo|assets)\//.test(p) || /\.(ico|png|js|json|ttf|css|map)$/.test(p);
    await route.fulfill({ path: D + (archivo ? p : '/index.html') });
  });
  await page.clock.install();
  await page.goto(ORIGEN + '/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await esperar('tarjeta-continuar', 20000);

  const preguntaId = async () =>
    (await page.locator('[data-testid^="pregunta-"]:visible').last().getAttribute('data-testid')).replace('pregunta-', '');
  const responder = async (fallar) => {
    const p = await preguntaId();
    const c = R[p];
    await pulsar('opcion-' + (fallar ? (c + 1) % 3 : c));
    await pulsar('comprobar');
    await esperar(fallar ? 'resultado-fallo' : 'resultado-acierto');
    return p;
  };
  const sesion = async (fallarEn) => {
    const falladas = [];
    for (let i = 0; ; i++) {
      const f = fallarEn.includes(i);
      const p = await responder(f);
      if (f) falladas.push(p);
      const texto = await vis('continuar').innerText();
      await pulsar('continuar');
      if (texto.includes('Ver resumen')) break;
    }
    await esperar('resumen');
    return falladas;
  };

  // Estado inicial
  ok((await estado('conductor-1')) === 'Empezar', 'Inicio: el camino empieza por el nivel 1 del tema 1');
  ok((await estado('senales-1')) === 'Bloqueado', 'Inicio: el siguiente nivel está bloqueado');
  ok(
    (await etiqueta('tramo-conductor')).startsWith('Tramo 1') &&
      (await etiqueta('tramo-via')).startsWith('Tramo 2') &&
      (await etiqueta('tramo-senales')).startsWith('Tramo 3'),
    'Camino: los temas 1 y 2 van antes de Señales',
  );
  ok((await estado('conductor-2')) === 'Próximamente' && (await estado('via-1')) === 'Próximamente', 'Camino: los niveles sin preguntas están en preparación');
  ok(
    (await etiqueta('tramo-maniobras')).startsWith('Tramo 6') && (await etiqueta('tramo-eficiente')).startsWith('Tramo 15'),
    'Camino: incluye los 15 capítulos del temario',
  );
  ok(
    (await page.locator('[data-testid^="nivel-"]').count()) === 75 &&
      (await estado('eficiente-5')) === 'Próximamente' &&
      (await estado('senales-5')) === 'Próximamente',
    'Camino: cinco niveles por tramo (75), los que no tienen preguntas en preparación',
  );
  ok((await centroY('coche')) < (await centroY('nivel-conductor-1')), 'Coche: sin niveles completados, espera al principio de la carretera');
  await pulsar('nivel-via-2');
  await esperar('dialogo');
  ok((await vis('dialogo').innerText()).includes('El conductor y el permiso B · Nivel 1'), 'Camino: un nivel en preparación remite al nivel disponible');
  await pulsar('dialogo-cancelar');
  await pulsar('tab-progreso');
  await esperar('progreso-vacio');
  ok(!(await page.getByText('%').count()), 'Progreso sin actividad: estado inicial sin porcentajes');
  await pulsar('tab-inicio');
  await pulsar('nivel-senales-2');
  await esperar('dialogo');
  ok((await vis('dialogo').innerText()).includes('El conductor y el permiso B · Nivel 1'), 'Nivel bloqueado indica qué nivel falta');
  await pulsar('dialogo-cancelar');

  // Lección desde Inicio
  await pulsar('continuar-leccion');
  await esperar('sesion');
  ok(!(await visible('tab-inicio')), 'Lección: barra de pestañas oculta');
  ok(await vis('comprobar').isDisabled(), 'Lección: «Comprobar» desactivado sin opción elegida');
  ok((await preguntaId()).startsWith('con1-'), 'Lección: el nivel 1 del tema 1 pregunta sobre el permiso B');
  await page.screenshot({ path: FOTOS + 'conductor-nivel1.png' });
  const primera = await responder(true);
  ok((await vis('explicacion').innerText()).includes('Respuesta correcta'), 'Fallo: muestra resultado, respuesta correcta y explicación');
  ok((await vis('estado-opcion-' + R[primera]).innerText()).toLowerCase().includes('respuesta correcta'), 'Fallo: la opción correcta queda señalada');
  ok((await vis('celda-0').getAttribute('data-testid')) === 'celda-0' && (await page.locator('[data-testid^="celda-"]:visible').count()) === 15, 'Lección: 15 recuadros de preguntas');
  ok(await visible('marco-imagen'), 'Lección: recuadro de imagen sobre las opciones');
  await pulsar('ver-temario');
  await esperar('pantalla-capitulo');
  ok((await page.locator('[data-testid^="apartado-"]:visible').count()) > 0, 'Fallo: «Ver en el temario» abre el capítulo');
  await atras();
  await esperar('continuar');
  ok((await vis('contador').innerText()) === '1/15', 'Al volver del temario la lección sigue en la misma pregunta');

  // Cerrar y reabrir (se cierra la pestaña a mitad de lección y se abre otra)
  const nueva = await page.context().newPage();
  await page.close({ runBeforeUnload: false });
  page = nueva;
  await page.setViewportSize({ width: 412, height: 892 });
  page.on('pageerror', (e) => errores.push(String(e)));
  await page.goto(ORIGEN + '/');
  await esperar('tarjeta-continuar', 20000);
  await pulsar('abrir-errores');
  await esperar('lista-pendientes');
  ok(await visible('error-' + primera), 'Cerrar y reabrir: la pregunta fallada sigue en Pendientes');
  await atras();

  // Completar un nivel y desbloquear el siguiente
  await pulsar('continuar-leccion');
  await esperar('sesion');
  const falladasN1 = await sesion([0]);
  ok((await vis('resumen-titulo').innerText()) === 'Nivel completado', 'Nivel con 1 fallo: completado');
  ok((await id('confeti').count()) === 1, 'Nivel completado: lanza confeti');
  await page.waitForTimeout(900);
  await page.screenshot({ path: FOTOS + 'confeti.png' });
  ok(await visible('desbloqueado'), 'Resumen: muestra el nivel desbloqueado');
  await pulsar('volver-inicio');
  await esperar('tarjeta-continuar');
  ok((await estado('conductor-1')).startsWith('Completado'), 'Inicio: nivel 1 completado');
  ok((await estado('senales-1')) === 'Empezar', 'Inicio: el siguiente nivel con preguntas queda desbloqueado');
  ok(await cocheAntesDe('senales-1'), 'Coche: tras completar un nivel avanza hasta el siguiente, atravesando los túneles');
  ok(
    (await page.locator('[data-testid="coche"]').last().evaluate((el) => getComputedStyle(el).opacity)) === '1',
    'Coche: visible al salir del último túnel',
  );
  await vis('nivel-senales-1').scrollIntoViewIfNeeded();
  await page.screenshot({ path: FOTOS + 'coche.png' });

  // Repaso: acertar → Corregidas
  await pulsar('abrir-errores');
  await esperar('lista-pendientes');
  const pendientes = await page.locator('[data-testid^="error-"]:visible').count();
  await pulsar('repasar-errores');
  await esperar('sesion');
  ok(!(await visible('tab-inicio')), 'Repaso: barra de pestañas oculta');
  for (let i = 0; i < pendientes; i++) {
    await responder(false);
    await pulsar('continuar');
  }
  await esperar('resumen');
  await pulsar('volver-errores');
  await esperar('pantalla-errores');
  await pulsar('segmento-corregidas');
  await esperar('lista-corregidas');
  ok(await visible('error-' + falladasN1[0]), 'Acertada en el repaso: aparece en Corregidas');

  // Volver a fallarla en otra sesión → Pendientes
  await atras();
  await esperar('tarjeta-continuar');
  await pulsar('nivel-conductor-1');
  await esperar('sesion');
  const refallo = await responder(true);
  ok(refallo === falladasN1[0], 'Se repite el nivel completado y se vuelve a fallar la misma pregunta');
  await atras();
  await esperar('dialogo');
  await pulsar('dialogo-confirmar');
  await esperar('tarjeta-continuar');
  ok((await estado('conductor-1')).startsWith('Completado'), 'Salir con confirmación; repetir no bloquea el nivel');
  await pulsar('abrir-errores');
  await esperar('lista-pendientes');
  ok(await visible('error-' + refallo), 'Corregida que se vuelve a fallar: regresa a Pendientes');
  await atras();

  // Temario
  await pulsar('tab-temario');
  await esperar('pantalla-temario');
  await pulsar('abrir-catalogo-temario');
  await esperar('pantalla-catalogo');
  ok(true, 'Temario: el banner del índice abre el catálogo de señales');
  await atras();
  await esperar('pantalla-temario');
  await pulsar('capitulo-prioridad');
  await esperar('practicar-tema');
  ok((await vis('practicar-detalle').innerText()).includes('Señales · Nivel 1'), 'Temario: tema bloqueado indica el nivel que falta');
  ok((await vis('apartado-norma-general').innerText()).length > 200, 'Temario: el capítulo de demostración se puede leer');
  await atras();
  await pulsar('capitulo-senales');
  await esperar('practicar-tema');

  // Catálogo de señales
  await page.screenshot({ path: FOTOS + 'capitulo-senales-banner.png' });
  await pulsar('abrir-catalogo');
  await esperar('pantalla-catalogo');
  ok((await vis('familia-peligro').innerText()).includes('51 señales'), 'Catálogo: familia de peligro con 51 señales');
  ok((await vis('tipo-pictogramas').innerText()).includes('69 señales'), 'Catálogo: pictogramas con 69 entradas');
  ok(await visible('catalogo-fuente'), 'Catálogo: cita la fuente');
  await page.screenshot({ path: FOTOS + 'catalogo-indice.png' });
  await pulsar('tipo-peligro');
  await esperar('senal-p-1');
  await page.waitForFunction(() => [...document.querySelectorAll('img')].some((i) => i.src.includes('p-1') && i.naturalWidth > 0));
  ok(true, 'Catálogo: la rejilla carga las imágenes de las señales');
  await page.screenshot({ path: FOTOS + 'catalogo-peligro.png' });
  await pulsar('senal-p-1');
  await esperar('ficha-senal');
  ok((await vis('ficha-nombre').innerText()) === 'Intersección con prioridad', 'Catálogo: la ficha muestra nombre y descripción');
  await pulsar('ficha-siguiente');
  ok((await vis('ficha-codigo').innerText()) === 'P-1a', 'Catálogo: «Siguiente» pasa a la señal siguiente');
  await page.screenshot({ path: FOTOS + 'catalogo-ficha.png' });
  await vis('ficha-senal').locator('[data-testid="boton-atras"]').click();
  await vis('ficha-senal').waitFor({ state: 'hidden' });
  await atras();
  await esperar('pantalla-catalogo');
  await atras();
  await esperar('practicar-tema');
  await pulsar('practicar-tema');
  await esperar('sesion');
  ok((await preguntaId()) === 'sen1-01', 'Temario: «Practicar este tema» abre la lección disponible');

  // Nivel no superado
  await sesion([0, 1, 2, 3]);
  ok((await vis('resumen-titulo').innerText()) === 'Nivel no superado', 'Nivel con 4 fallos: no superado');
  ok((await id('confeti').count()) === 0, 'Nivel no superado: sin confeti');
  await pulsar('volver-inicio');
  await esperar('tarjeta-continuar');
  ok((await estado('senales-1')) === 'Empezar', 'Nivel no superado: sigue disponible');
  ok((await estado('senales-2')) === 'Bloqueado', 'Nivel no superado: no desbloquea el siguiente');
  await page.goto(ORIGEN + '/leccion/prioridad-1');
  await esperar('leccion-bloqueada', 20000);
  ok((await vis('leccion-bloqueada').innerText()).includes('Señales · Nivel 1'), 'Lección bloqueada abierta por URL: indica el nivel que falta');
  await page.goto(ORIGEN + '/');
  await esperar('tarjeta-continuar', 20000);

  // Simulacro entregado
  await pulsar('tab-simulador');
  await esperar('empezar-simulacro');
  ok((await vis('pantalla-simulador').innerText()).includes('30:00 minutos'), 'Simulador: 30 minutos en total');
  await pulsar('empezar-simulacro');
  await esperar('pantalla-simulacro');
  ok(!(await visible('tab-inicio')), 'Simulacro: barra de pestañas oculta');
  for (let i = 0; i < 30; i++) {
    await pulsar('opcion-' + ((R[await preguntaId()] + 1) % 3));
    if (i < 29) await pulsar('siguiente');
  }
  await pulsar('ir-pregunta-0');
  const c0 = R[await preguntaId()];
  await pulsar('opcion-' + c0);
  ok((await vis('opcion-' + c0).getAttribute('aria-checked')) === 'true', 'Simulacro: se puede cambiar una respuesta antes de entregar');
  await pulsar('entregar');
  await esperar('dialogo');
  await pulsar('dialogo-confirmar');
  await esperar('pantalla-resultado');
  ok((await vis('resultado-cifras').innerText()).startsWith('1 de 30'), 'Simulacro entregado: corrige con la respuesta cambiada (1/30)');
  ok(!(await visible('tiempo-agotado')), 'Simulacro entregado: no marca tiempo agotado');

  // Simulacro con tiempo agotado
  await atras();
  await esperar('empezar-simulacro');
  await pulsar('empezar-simulacro');
  await esperar('pantalla-simulacro');
  await pulsar('opcion-' + R[await preguntaId()]);
  await page.clock.fastForward('29:00');
  await page.waitForTimeout(400);
  ok(!(await visible('tiempo-agotado')) && (await visible('pantalla-simulacro')), 'Simulacro: a los 29 minutos sigue en curso');
  await page.clock.fastForward('01:05');
  await esperar('tiempo-agotado');
  ok(await visible('tiempo-agotado'), 'Tiempo agotado: se corrige automáticamente');
  ok((await vis('resultado-cifras').innerText()).startsWith('1 de 30'), 'Tiempo agotado: las no respondidas cuentan como fallo');

  // Progreso
  await pulsar('ver-progreso');
  await esperar('pantalla-progreso');
  ok((await id('tab-inicio').count()) === 1, 'Ver en Progreso vuelve a las pestañas existentes, sin duplicarlas');
  ok(await visible('historial-1'), 'Progreso: historial con los dos simulacros');
  ok((await vis('historial-0').innerText()).includes('Tiempo agotado'), 'Progreso: el último simulacro figura como tiempo agotado');
  ok((await vis('lecciones-completadas').innerText()) === '1 de 13', 'Progreso: 1 lección completada de 13');
  const aciertos = Number((await vis('aciertos-senales').innerText()).split(' ')[0]);
  const fallos = Number((await vis('fallos-senales').innerText()).split(' ')[0]);
  ok(aciertos > 0 && fallos > 0, `Progreso: Señales con ${aciertos} aciertos y ${fallos} fallos`);

  // Ajustes
  await pulsar('tab-inicio');
  await pulsar('abrir-ajustes');
  await esperar('pantalla-ajustes');
  ok(await visible('aviso-notificaciones'), 'Ajustes: avisa de que el envío de notificaciones está pendiente');
  await pulsar('interruptor-recordatorios');
  await pulsar('hora-mas');
  await pulsar('minuto-mas');
  await page.reload();
  await esperar('pantalla-ajustes', 20000);
  ok((await vis('estado-recordatorios').innerText()) === 'Activado', 'Ajustes: el interruptor se conserva al recargar');
  ok((await vis('hora-guardada').innerText()) === 'Hora guardada: 20:15', 'Ajustes: la hora se conserva al recargar');
  await page.goto(ORIGEN + '/progreso');
  await esperar('pantalla-progreso', 20000);
  ok(await visible('historial-1'), 'Tras recargar, Progreso conserva el historial');

  ok(errores.length === 0, 'Sin errores de JavaScript' + (errores.length ? ': ' + errores.join(' | ') : ''));
  return log.join('\n');
}
