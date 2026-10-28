# Mesa de las Velas

Juego de cartas dark fantasy inspirado en el truco venezolano, en una mesa 3D a la luz de velas.

## Jugar en local

Necesita Node.js y pnpm.

```bash
pnpm install
pnpm dev
```

Abre http://localhost:5173 y pulsa **JUGAR**.

## Scripts

| Script            | Qué hace                                                 |
| ----------------- | -------------------------------------------------------- |
| `pnpm dev`        | Servidor de desarrollo en http://localhost:5173          |
| `pnpm check`      | Tipos + lint + tests + knip (lo mismo que el pre-commit) |
| `pnpm typecheck`  | `tsc --noEmit` de la app y de la configuración           |
| `pnpm lint`       | ESLint sin advertencias permitidas                       |
| `pnpm lint:fix`   | ESLint con correcciones automáticas                      |
| `pnpm test`       | Vitest con cobertura                                     |
| `pnpm test:watch` | Vitest en modo observación                               |
| `pnpm knip`       | Archivos, exports y dependencias sin usar                |
| `pnpm format`     | Prettier sobre todo el proyecto                          |
| `pnpm build`      | Tipos + build de producción en `dist/`                   |
| `pnpm preview`    | Sirve el build de `dist/`                                |
| `pnpm lighthouse` | Build + Lighthouse CI (≥ 90 en las 4 categorías)         |

## Controles

- Toca una carta de tu mano o usa las teclas **1**, **2** y **3**.
- **Cantar**: abre Ritual, Pacto y Desafío (o Contra). **Escape** lo cierra.
- **Me voy**: abandonas la ronda y pierdes 1 de vida.
- Toca un aviso para cerrarlo.

Las reglas completas están en `docs/reglas.md` y la arquitectura en `docs/architecture.md`.
