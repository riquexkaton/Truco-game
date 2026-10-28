---
paths:
  - 'src/application/**'
---

# Application

- Orquesta rondas y turnos con las transiciones del dominio. Las dependencias entran por `createGame(ports)`: nada de singletons ni estado de módulo.
- Hacia la UI salen datos semánticos (`GameEvent`, `Question`), nunca textos. El copy vive en `src/ui/copy/`.
- Los tiempos son constantes con nombre en `timings.ts`. Las esperas pasan por `Scheduler`.
- La UI solo lee el store (`@preact/signals-core`) e invoca `GameCommands`. Cada comando es un no-op si no está permitido.
- Los tests usan `src/application/testing/` (FakeTable, FakeHud, VirtualScheduler) y validan comportamiento, no llamadas internas.
