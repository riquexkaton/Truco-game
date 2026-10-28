---
name: new-card
description: Agregar o reemplazar una carta del mazo de Mesa de las Velas (datos + arte). Usar cuando se pida una carta nueva, cambiar el ataque o nombre de una carta, o cambiar su ilustración.
---

# Agregar o cambiar una carta

1. **Datos**: editá `src/domain/cards/roster.ts`. Cada facción tiene exactamente 1 legendaria, 1 Perico, 1 Perica y 7 normales (40 cartas en total). El `id` va en minúsculas y sin tildes; el nombre, en mayúsculas.
2. **Tests**: actualizá `src/domain/cards/deck.test.ts` si cambian los conteos o los ataques. Si cambia un ataque, revisá también los tests del Pacto y de la IA del rival que usan esa carta.
3. **Arte**: la imagen va en `src/assets/cards/c_<id>.jpg`, a 512×768. Vite la convierte a WebP con hash; no hace falta registrarla en ningún lado.
4. **Generar el arte**: seguí `docs/arte-cartas.md` (ComfyUI local, estilo tarot, siempre adultos). Si está disponible la skill `mesa-velas-arte-cartas`, usala.
5. **Verificar**: corré `pnpm check` y abrí `pnpm dev` para ver la carta repartida en la mesa.
