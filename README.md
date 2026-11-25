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
│  └─ demo/       Temas, niveles, temario y preguntas (JSON)
├─ domain/        Reglas puras: niveles, Mis errores, progreso, simulacro (+ pruebas)
├─ store/         Estado persistido en el dispositivo (Zustand + AsyncStorage)
└─ ui/            Tema visual y componentes
```

## Contenido de demostración

Todas las preguntas y el temario son de demostración y están pendientes de revisión. No proceden de fuentes oficiales ni reproducen el formato del examen de la DGT. El simulacro (6 preguntas, 3 minutos, 1 fallo como máximo) es solo una demostración.
