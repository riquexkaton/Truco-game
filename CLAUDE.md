# Mesa de las Velas

Juego de cartas 3D contra la IA, inspirado en el truco venezolano. Vite + TypeScript + Preact + Tailwind 4 + Three.js. El texto del juego va en español; el código, en inglés.

## Comandos

- `pnpm dev`: servidor local en http://localhost:5173
- `pnpm check`: tipos + lint + tests + knip. Es lo mismo que exige el pre-commit
- `pnpm lighthouse`: build + Lighthouse CI (≥ 90 en las 4 categorías). Lo corre el pre-push

## No negociable

- Para verificar usá `pnpm typecheck` o `pnpm check`, no el build.
- ESLint manda: fronteras entre capas, archivos ≤ 100 líneas, funciones ≤ 30, sin comentarios. `eslint-disable` está bloqueado: si una regla molesta, se rediseña el código, no la regla.
- Antes de usar una API de three, Preact, Tailwind 4 o Vite, consultá context7: cambian seguido.
- Commits con Conventional Commits (commitlint), sin atribución de IA.

## Dónde está cada cosa

- Arquitectura, capas y glosario juego → código: `docs/architecture.md`
- Reglas del juego: `docs/reglas.md`. Si contradicen al dominio, mandan el código y sus tests
- Sistema visual del HUD: `docs/hud.md`
- Implementación original de referencia: `legacy/index.html`
- Assets que no se usan: `assets-source/unused/`

## Pendiente

- Duelo empatado: el aviso dice «DECIDE EL SIGUIENTE DUELO», pero se juegan los 3 duelos (comportamiento heredado). Falta decidir cuál es el correcto.
- Mano que se ilumina en tu turno · multijugador en línea.
