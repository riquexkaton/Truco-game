---
name: lighthouse-audit
description: Medir y diagnosticar Lighthouse de Mesa de las Velas (rendimiento, accesibilidad, buenas prácticas, SEO). Usar cuando falle el pre-push, cuando se pida una auditoría o tras cambios en assets, fuentes, carga inicial o pantalla de título.
---

# Auditoría Lighthouse

1. Corré `pnpm lighthouse`: hace el build, sirve `dist/` y ejecuta 3 corridas en móvil. Falla si alguna categoría queda por debajo de 0,9.
2. Los reportes quedan en `.lighthouseci/reports/` (HTML y JSON). Nunca se suben a almacenamiento público.
3. Para diagnosticar, leé del JSON: `audits["largest-contentful-paint-element"]`, `audits["total-blocking-time"]`, `audits["bootup-time"]`, `audits["unused-javascript"]` y `audits["color-contrast"]`.
4. Causas típicas en este proyecto:
   - Algo de `three` entró en el chunk inicial: tiene que cargarse solo con `import()` al pulsar JUGAR.
   - La imagen de fondo de la pantalla de título dejó de ser WebP o perdió `fetchpriority="high"`.
   - Texto pequeño con poco contraste sobre el fondo oscuro.
5. Lighthouse mide la carga. El rendimiento dentro de la partida se revisa jugando con `pnpm dev` y el panel Performance del navegador.
