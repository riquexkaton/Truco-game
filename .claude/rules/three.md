---
paths:
  - 'src/infrastructure/**'
---

# Mesa 3D y adaptadores del navegador

- `createThreeTable` implementa `TablePort` y se carga con `import()` dinámico: nunca lo importes de forma estática.
- Importá de `three` con nombre (tree-shaking). No crees objetos dentro del loop por frame.
- Las sombras no se actualizan solas: marcá `shadowMap.needsUpdate` solo cuando algo se mueve.
- Solo se espera el arte de las cartas repartidas; el resto se precarga en idle. Las imágenes van por `import.meta.glob` + vite-imagetools (WebP con hash).
- Con reduced motion, el `Scheduler` limita las esperas a 250 ms. Respetalo también en las animaciones nuevas.
