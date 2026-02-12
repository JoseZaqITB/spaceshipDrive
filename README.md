# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

# TASKS

- create shadows
- optimize shadows
- adjust stars
- space key for powering
- camera shake
- add a geometry that simulates space deform on the donut surface
- adjust camera far to see more stars

- create the sound effects
- improve spaceship model
- when space is pressup start aceleration from initial value
- randomize star position
- create a speed indicator
- create despegue scene ( with the audio start button)

## How to obtain time duration for get the max velocity

1️⃣ Tu ecuación discreta (la clave)
Tienes:

```
v{n+1} = v*n + (vmax - v_n) * a _Δ
```

donde:

```
a = aceleración

Δ = delta (segundos del frame)

n = frame
```

Esto es una recurrencia exponencial discreta.

2️⃣ Solución cerrada (discreta)

Si partes de v₀ = 0, la solución tras n frames es:

```
v_n = vmax \* (1 - (1 - aΔ)^n)
```

👉 Esto ya incorpora delta, no asumimos tiempo continuo.

3️⃣ Relación entre tiempo real y frames

El tiempo real transcurrido es:

```
t = n \* Δ
```

Despejamos n:

```
n = t / Δ
```

4️⃣ Velocidad en función del tiempo real (con delta)

Sustituimos:

```
v(t) = vmax \* (1 - (1 - aΔ)^(t / Δ))
```

Esto sí representa exactamente lo que pasa en tu loop de frames, incluso si delta cambia.

5️⃣ Tiempo para llegar a un porcentaje de vmax

Queremos:

```
v(t) = p \* vmax
```

Entonces:

```
p = 1 - (1 - aΔ)^(t / Δ)
```

Despejamos t:

```
(1 - aΔ)^(t / Δ) = 1 - p

t / Δ = ln(1 - p) / ln(1 - aΔ)

t = Δ \* ln(1 - p) / ln(1 - aΔ)
```

⚠️ Nota: ambos logaritmos son negativos → el tiempo sale positivo.

6️⃣ Fórmula FINAL (la que necesitas)

```
tiempo = delta _ ln(1 - porcentaje) / ln(1 - aceleracion _ delta)
```

Ejemplo típico:

```js
const p = 0.99;
const t = (delta * Math.log(1 - p)) / Math.log(1 - a * delta);
```
