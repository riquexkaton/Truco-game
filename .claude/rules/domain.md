---
paths:
  - 'src/domain/**'
---

# Dominio

- Funciones puras e inmutables: `(state, input) => newState`. Sin librerías, DOM, timers, `Date` ni `Math.random`.
- Todo azar entra como `Random`. En los tests se usa `scripted-random.ts` y se verifica cuántas tiradas consume cada decisión de la IA.
- Los nombres siguen el glosario de `docs/architecture.md`. Los literales del juego quedan en español (`'perico'`, `'pacto'`, `'golpe'`).
- Cada regla nueva entra con su test al lado (`*.test.ts`). La cobertura mínima es 90 % (ramas 85 %).
- El valor del Pacto del jugador nunca se expone antes del final de la ronda: se puede cantar sin tenerlo.
