# A Ver si Arranca

App para preparar el examen teórico del permiso B en España. Primera plataforma: Android (Expo + React Native + TypeScript).

Estado: prototipo navegable con contenido de demostración. La especificación está en `.kiro/specs/a-ver-si-arranca-base/`.

## Probar en un móvil Android

1. Instala **Expo Go** desde Google Play. El proyecto usa la SDK 58 de Expo: si Expo Go avisa de que el proyecto no es compatible, actualízalo.
2. En un ordenador con Node.js 22 o superior:

   ```bash
   git clone https://github.com/xRept1le/a-ver-si-arranca.git
   cd a-ver-si-arranca
   npm install
   npx expo start
   ```

3. Abre Expo Go y escanea el código QR que aparece en la terminal. El móvil y el ordenador deben estar en la misma red Wi-Fi. Si la red no lo permite, usa `npx expo start --tunnel`.

Los datos se guardan en el móvil (AsyncStorage). Para empezar de cero, borra los datos de Expo Go desde los ajustes de Android.

## Comprobaciones

```bash
npm run typecheck   # TypeScript
npm test            # lógica de dominio (Jest)
npx expo export --platform android   # compila el bundle de Android
```

`e2e/` contiene el recorrido de la comprobación final que se ejecutó sobre la versión web exportada con Playwright.

## Estructura

```
src/
├─ app/           Pantallas (Expo Router). (tabs)/ = Inicio, Temario, Simulador, Progreso
├─ content/       Contenido de demostración, separado de la interfaz
│  ├─ demo/       Temas, niveles, temario y preguntas (JSON)
│  └─ senales/    Catálogo de señales (datos.ts e imagenes.ts son generados)
├─ domain/        Reglas puras: niveles, Mis errores, progreso, simulacro (+ pruebas)
├─ store/         Estado persistido en el dispositivo (Zustand + AsyncStorage)
└─ ui/            Tema visual y componentes
```

## Contenido de demostración

Todas las preguntas y los textos del temario son de demostración y están pendientes de revisión. No proceden de fuentes oficiales ni reproducen el formato del examen de la DGT. El simulacro (6 preguntas, 3 minutos, 1 fallo como máximo) es solo una demostración.

## Catálogo de señales

En Temario → «Señales y marcas viales» → «Catálogo de señales» están las 412 señales y pictogramas del «Catálogo de señales de circulación» (MOPT), agrupados por familia y tipo. Cada señal tiene código, imagen y nombre; al pulsarla se abre su descripción.

- Fuente: los dos PDF de la raíz (`1110950_1-1-45.pdf` y `1110950_1-46-99.pdf`), de [1110950_1.pdf](https://www.transportes.gob.es/recursos_mfom/comodin/recursos/1110950_1.pdf). Se omiten las páginas 1–8 de la primera parte.
- Las imágenes son recortes del PDF (`assets/senales/*.webp`). Los textos se transcribieron página a página. Todo está pendiente de revisión, y la edición del catálogo es antigua.
- Para corregir una señal, edita `herramientas/senales/trans.py` y regenera (Python 3 con `pymupdf`, `pillow`, `numpy` y `scipy`):

```bash
python herramientas/senales/recortar.py   # valida la transcripción y recorta las imágenes
python herramientas/senales/generar.py    # escribe src/content/senales/datos.ts e imagenes.ts
```

`detectar.py` solo hace falta si cambian los PDF: vuelve a calcular las cajas de las imágenes (`detect.json`).
