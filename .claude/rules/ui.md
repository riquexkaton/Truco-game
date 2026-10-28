---
paths:
  - 'src/ui/**'
  - 'src/main.tsx'
---

# UI (Preact + Tailwind 4)

- Atomic design: `atoms/` → `molecules/` → `organisms/`. Los presentacionales reciben props y emiten eventos; solo `containers/` toca el store y los comandos.
- Tailwind primero. Los tokens están en `@theme` de `src/ui/styles/main.css`; usá CSS propio solo para lo que Tailwind no cubre (keyframes, patrones, pseudo-elementos).
- Respetá el sistema visual de `docs/hud.md`: papel washi, tinta, sellos girados −4°, Shippori Mincho 800.
- Accesibilidad obligatoria: nombre accesible en cada control, foco visible, anuncios por la región `aria-live`, semántica de diálogo y variantes `motion-reduce:`.
- El copy en español sale de `src/ui/copy/`. Los efectos guardados del rival se muestran boca abajo, nunca su id.
