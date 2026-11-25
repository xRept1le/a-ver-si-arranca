import { camino, capitulos, esPrevisto, niveles, REGLAS, temas, todasLasPreguntas } from '@/content';
import { aplicarAErrores, listarErrores } from '../errores';
import { estadosNiveles, nivelActual, nivelQueFalta, nivelSuperado } from '../niveles';
import { porcentaje, resumenProgreso } from '../progreso';
import { corregirSimulacro, formatoTiempo, generarSimulacro } from '../simulacro';
import type { RegistroError, Respuesta } from '../types';

describe('contenido de demostración', () => {
  it('tiene 4 temas, 13 niveles y 15 preguntas por nivel sin repetir preguntas', () => {
    expect(temas).toHaveLength(4);
    expect(niveles).toHaveLength(13);
    for (const n of niveles) expect(n.preguntas).toHaveLength(15);
    const ids = niveles.flatMap((n) => n.preguntas.map((p) => p.id));
    expect(new Set(ids).size).toBe(195);
  });

  it('el camino empieza por el nivel 1 de «El conductor y el permiso B» y sigue el orden del temario', () => {
    expect(niveles[0].id).toBe('conductor-1');
    expect(niveles[1].id).toBe('senales-1');
    expect(camino).toHaveLength(15);
    const primero = camino[0];
    expect(esPrevisto(primero) ? [] : primero.previstos?.map((n) => n.id)).toEqual(['conductor-2', 'conductor-3', 'conductor-4', 'conductor-5']);
    // Cinco niveles por tramo, tengan o no preguntas.
    for (const t of camino) expect(t.niveles.length + (esPrevisto(t) ? 0 : (t.previstos?.length ?? 0))).toBe(5);
  });

  it('las preguntas enlazan con apartados que existen en su capítulo', () => {
    for (const tema of temas) {
      const capitulo = capitulos.find((c) => c.id === tema.capituloId)!;
      const apartados = new Set(capitulo.apartados.map((a) => a.id));
      for (const p of tema.niveles.flatMap((n) => n.preguntas)) expect(apartados.has(p.apartado)).toBe(true);
    }
  });

  it('cada pregunta tiene 3 opciones distintas, una correcta válida y explicación', () => {
    const ids = new Set<string>();
    for (const p of todasLasPreguntas()) {
      expect(ids.has(p.id)).toBe(false);
      ids.add(p.id);
      expect(p.opciones).toHaveLength(3);
      expect(new Set(p.opciones).size).toBe(3);
      expect([0, 1, 2]).toContain(p.correcta);
      expect(p.explicacion.length).toBeGreaterThan(10);
    }
  });

  it('incluye al menos una escena cenital', () => {
    expect(todasLasPreguntas().some((p) => p.escena)).toBe(true);
  });
});

describe('niveles', () => {
  const lista = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];

  it('sin actividad, solo el primero está disponible', () => {
    expect(estadosNiveles(lista, {})).toEqual({ a: 'disponible', b: 'bloqueado', c: 'bloqueado' });
    expect(nivelActual(lista, {})?.id).toBe('a');
  });

  it('completar un nivel desbloquea el siguiente y el completado se puede repetir', () => {
    const c = { a: { veces: 1, ultimaVez: 1 } };
    expect(estadosNiveles(lista, c)).toEqual({ a: 'completado', b: 'disponible', c: 'bloqueado' });
    expect(nivelActual(lista, c)?.id).toBe('b');
  });

  it('indica qué nivel falta para uno bloqueado', () => {
    expect(nivelQueFalta(lista, {}, 'c')?.id).toBe('a');
    expect(nivelQueFalta(lista, {}, 'a')).toBeUndefined();
  });

  it('se supera con 3 fallos como máximo', () => {
    expect(nivelSuperado(3, REGLAS.maxFallosNivel)).toBe(true);
    expect(nivelSuperado(4, REGLAS.maxFallosNivel)).toBe(false);
  });
});

describe('Mis errores', () => {
  const ev = (acierto: boolean, origen: 'leccion' | 'repaso' | 'simulacro', sesionId: string) => ({
    preguntaId: 'p1',
    acierto,
    origen,
    sesionId,
    fecha: 1,
  });

  it('un fallo crea una pendiente', () => {
    const e = aplicarAErrores({}, ev(false, 'leccion', 's1'));
    expect(e.p1.estado).toBe('pendiente');
    expect(e.p1.fallos).toBe(1);
  });

  it('acertar en el repaso la pasa a corregidas', () => {
    let e = aplicarAErrores({}, ev(false, 'leccion', 's1'));
    e = aplicarAErrores(e, ev(true, 'repaso', 's2'));
    expect(e.p1.estado).toBe('corregida');
  });

  it('acertar fuera del repaso no la corrige', () => {
    let e = aplicarAErrores({}, ev(false, 'leccion', 's1'));
    e = aplicarAErrores(e, ev(true, 'leccion', 's2'));
    expect(e.p1.estado).toBe('pendiente');
  });

  it('volver a fallar una corregida en otra sesión la devuelve a pendientes', () => {
    let e = aplicarAErrores({}, ev(false, 'leccion', 's1'));
    e = aplicarAErrores(e, ev(true, 'repaso', 's2'));
    e = aplicarAErrores(e, ev(false, 'simulacro', 's3'));
    expect(e.p1.estado).toBe('pendiente');
    expect(e.p1.fallos).toBe(2);
  });

  it('separa pendientes y corregidas', () => {
    const e: Record<string, RegistroError> = {
      a: { preguntaId: 'a', estado: 'pendiente', fallos: 1, ultimaSesionFallo: 's', actualizado: 1 },
      b: { preguntaId: 'b', estado: 'corregida', fallos: 1, ultimaSesionFallo: 's', actualizado: 2 },
    };
    const { pendientes, corregidas } = listarErrores(e);
    expect(pendientes.map((x) => x.preguntaId)).toEqual(['a']);
    expect(corregidas.map((x) => x.preguntaId)).toEqual(['b']);
  });
});

describe('progreso', () => {
  it('sin actividad no inventa porcentajes', () => {
    const r = resumenProgreso(temas, { respuestas: [], completados: {}, simulacros: [] });
    expect(r.hayActividad).toBe(false);
    expect(r.leccionesCompletadas).toBe(0);
    expect(porcentaje(0, 0)).toBeNull();
  });

  it('cuenta aciertos y fallos por tema a partir de las respuestas', () => {
    const resp = (temaId: string, acierto: boolean): Respuesta => ({
      preguntaId: 'x',
      temaId,
      acierto,
      origen: 'leccion',
      sesionId: 's',
      fecha: 1,
    });
    const r = resumenProgreso(temas, {
      respuestas: [resp('senales', true), resp('senales', false), resp('velocidad', true)],
      completados: { 'senales-1': { veces: 1, ultimaVez: 1 } },
      simulacros: [],
    });
    const senales = r.porTema.find((t) => t.temaId === 'senales')!;
    expect(senales).toMatchObject({ aciertos: 1, fallos: 1, nivelesCompletados: 1 });
    expect(r.leccionesCompletadas).toBe(1);
    expect(porcentaje(1, 2)).toBe(50);
  });
});

describe('simulacro', () => {
  const preguntas = [
    { id: 'a', correcta: 0 },
    { id: 'b', correcta: 1 },
    { id: 'c', correcta: 2 },
  ];

  it('las no respondidas cuentan como fallo', () => {
    const r = corregirSimulacro(preguntas, { a: 0, b: 1 }, 1);
    expect(r.aciertos).toBe(2);
    expect(r.apto).toBe(true);
    expect(r.respuestas[2]).toEqual({ preguntaId: 'c', elegida: null, acierto: false });
  });

  it('con más fallos del máximo no es apto', () => {
    expect(corregirSimulacro(preguntas, { a: 1 }, 1).apto).toBe(false);
  });

  it('elige el número pedido de preguntas por tema sin repetir', () => {
    const bancos = temas.map((t) => t.niveles.flatMap((n) => n.preguntas));
    const s = generarSimulacro(bancos, 2);
    expect(s).toHaveLength(8);
    expect(new Set(s.map((p) => p.id)).size).toBe(8);
  });

  it('formatea el tiempo restante', () => {
    expect(formatoTiempo(180)).toBe('3:00');
    expect(formatoTiempo(59.2)).toBe('1:00');
    expect(formatoTiempo(-3)).toBe('0:00');
  });
});
