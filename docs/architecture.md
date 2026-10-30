# Arquitectura

Clean/Hexagonal con carpetas que gritan el dominio (Screaming). La regla de dependencias se verifica con ESLint (`eslint-plugin-boundaries`): si una importación cruza una frontera prohibida, el commit no pasa.

## Capas

```
src/
  domain/          reglas puras del juego. Sin librerías, sin DOM, sin Three, sin tiempo, sin Math.random
  application/     casos de uso: orquesta rondas y turnos. Depende de domain y de sus propios ports
    ports/         contratos que implementan los adaptadores (mesa 3D, HUD, reloj, azar)
    store/         estado observable que lee la UI
    commands/      GameCommands: lo único que la UI y la mesa pueden invocar
  infrastructure/  adaptadores técnicos
    three/         la mesa 3D (Three.js). Implementa TablePort
    browser/       Scheduler, Random, reduced motion, carga de assets
  ui/              HUD en Preact + Tailwind 4 (atomic design + container/presentational). Implementa HudPort
  main.tsx         composition root: único archivo que conoce todas las capas
```

| Desde \ Hacia  | domain | application                 | infrastructure | ui  |
| -------------- | ------ | --------------------------- | -------------- | --- |
| domain         | ✅     | ❌                          | ❌             | ❌  |
| application    | ✅     | ✅                          | ❌             | ❌  |
| infrastructure | ✅     | ✅ (ports, store)           | ✅             | ❌  |
| ui             | ✅     | ✅ (ports, store, comandos) | ❌             | ✅  |

Librerías externas por capa: `domain` ninguna · `application` solo `@preact/signals-core` · `infrastructure/three` solo `three` · `ui` `preact`, `@preact/signals`.

## Dominio (screaming)

```
domain/
  shared/      Side ('player' | 'rival'), opponent(), Random (interfaz), shuffle/pick/chance puros
  cards/       facciones, mazo de 40 (datos), attackOf, effectiveAttack, hasSeal
  duel/        resultado de duelo, estado de la ronda (2 de 3), quién lidera
  challenge/   Desafío/Contra: niveles [2,4,6], canRaise, daño por retirarse (1 / 4) y por irse (1 / 4 / 6)
  pact/        valor del Pacto (envido), apuestas Pacto/Re-pacto/Apuesta, rango, rechazo, ganador
  ritual/      detección (3 de la misma facción), daño 3
  effects/     catálogo (golpe, sanacion, saqueo, maldicion, sello), mazo de 20, robar/rebarajar, máx. 2
  life/        vida 0..20, aplicar cambio y devolver el cambio real
  rival/       IA del rival: fuerza de mano, carta a jugar, responder/lanzar Desafío, Pacto, efecto, descarte
  match/       MatchState inmutable + transiciones puras (nueva partida, nueva ronda)
```

Toda decisión con azar recibe un `Random`. Las funciones del dominio son puras y deterministas.

## Glosario (juego → código)

| Juego                                | Código                                                                        |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| Partida / Ronda / Duelo              | `match` / `round` / `duel`                                                    |
| Jugador / Rival                      | `Side`: `'player'` / `'rival'`                                                |
| Vira                                 | `vira`                                                                        |
| Perico / Perica                      | `wildcard.kind`: `'perico'` / `'perica'`                                      |
| Carta con sello (da efecto al ganar) | `hasSeal(card, vira)`                                                         |
| Desafío / Contra                     | `challenge` nivel 1 / 2                                                       |
| Retirarse / Me voy                   | `retire` / `fold`                                                             |
| Pacto / Re-pacto / Apuesta           | `pact`, `Bet.kind`: `'pacto'` / `'repacto'` / `'apuesta'`                     |
| Ritual                               | `ritual`                                                                      |
| Efectos                              | `EffectId`: `'golpe'` / `'sanacion'` / `'saqueo'` / `'maldicion'` / `'sello'` |

## Application

- `ports/`: `TablePort` (animaciones 3D, todas devuelven `Promise`), `HudPort` (`notify(evento)` y `ask(pregunta)`; `notify` se resuelve cuando el aviso deja de verse, así que un anuncio grande hace esperar al juego hasta que se toca o termina su tiempo de lectura; mientras tanto `signals.announcing` para el reloj del turno), `Scheduler` (`wait(ms)`), `Random`, `TableListener` (la mesa 3D avisa a la UI de una carta jugada tocada, de la carta con sello bajo el ratón y de que se recogió la mesa; lo une `composition/launcher.ts`).
- `store/`: estado observable con `@preact/signals-core` (vida, resultados de duelos, apuesta, Pacto en juego, efectos, maldición/sello, fase, temporizador). La UI solo lee de aquí y llama comandos.
- Casos de uso por carpeta (`round/`, `challenge/`, `pact/`, `effects/`, `turn-timer/`) que reciben sus dependencias por parámetro. Nada de singletons.
- `GameCommands`: `start`, `playCard`, `callChallenge`, `callPact`, `singRitual`, `fold`, `useEffect`, `restart`.

## Infraestructura

- `three/`: un archivo por pieza (renderer, fondo, velas, entorno, monedas, carta, pintores de textura, layouts, picking, loop, adaptador). Se carga con `import()` dinámico al pulsar JUGAR.
- `browser/`: `Scheduler` con `setTimeout` (acorta esperas con reduced motion), `Random` con `Math.random`, carga de imágenes con `createImageBitmap`.
- Música de fondo: `composition/background-music.ts` une `music-track` (un `Audio` en bucle que se crea en el primer gesto y entra con fundido), `music-preference` (`localStorage`) y `page-activity` (primer gesto, visibilidad) en un `MusicControl` que `main.tsx` pasa a `App`. La UI solo lee `isEnabled` y llama a `toggle`. El encendido, el primer gesto y la visibilidad viven en `composition/audio-toggle.ts`, compartido con los efectos.
- Efectos de sonido: `composition/sound-effects.ts` crea `sfx-engine` (Web Audio: un `AudioContext`, buffers decodificados y un `BufferSource` nuevo por sonido, así se superponen) y lo une con `sfx-preference` y `page-activity` en un `SfxControl` aparte. Los sonidos se descargan y decodifican después del primer gesto; si falta uno, no suena. El volumen de cada sonido es dato: sonoridad medida y objetivo en LUFS. Se disparan desde dos sitios: `composition/hud-sounds.ts` envuelve el `HudPort` (llamadas de Pacto o Desafío, turnos, ronda y fin de partida) y la mesa 3D recibe `TableSounds` (`three/table/table-sounds.ts`) para sonar cuando la carta llega a la mano o a la mesa, al recoger, al tomar un efecto y cuando cada moneda toca la mesa.

## UI

- `atoms/` (Hanko, PaperTag, AsideButton…), `molecules/` (AnswerButton, HeadlineSheet, DuelBand, LifeCounter…), `organisms/` (ActionBar, PromptCard, Headline, Mark, Banner, TurnBar, GameOver, TitleScreen…).
- `containers/` conectan el store y los comandos con componentes presentacionales puros (props in, eventos out).
- Estilos: Tailwind 4 primero (`@theme` con los tokens de `docs/hud.md`); CSS propio solo para keyframes, patrones y pseudo-elementos que Tailwind no cubre.
- Accesibilidad: `aria-label`, foco visible, región `aria-live`, `prefers-reduced-motion`.

## Rendimiento

- Pantalla de título ligera; Three.js y las texturas se cargan al pulsar JUGAR (prefetch al pasar el puntero o enfocar el botón).
- Progreso real de carga: `Launcher.launch(canvas, onProgress)`. La composición reporta el `import()` de la mesa (25 %) y `createThreeTable` cuenta el resto de pasos (fuentes, cada fondo y moneda, escena armada) con `createLoadProgress`.
- Arte de cartas en WebP con nombre con hash (cache inmutable). Solo se esperan las cartas repartidas; el resto se precarga en idle.
- Sombras: `shadowMap.autoUpdate = false`; se recalculan solo cuando algo se mueve. El render se pausa con la pestaña oculta.
- Fuente auto-alojada (`@fontsource`), sin CSS bloqueante de terceros.

## Reglas deterministas

| Herramienta             | Qué garantiza                                                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `tsc --noEmit` (strict) | tipos                                                                                                                               |
| ESLint                  | fronteras de capas, sin ciclos, archivos ≤ 100 líneas, funciones ≤ 30, complejidad ≤ 8, sin comentarios, sin `eslint-disable`, a11y |
| Vitest                  | reglas del dominio y casos de uso; cobertura mínima en `domain` y `application`                                                     |
| Knip                    | sin archivos, exports ni dependencias muertas                                                                                       |
| Husky                   | pre-commit: tipos + lint + tests · commit-msg: Conventional Commits · pre-push: Lighthouse ≥ 90                                     |
