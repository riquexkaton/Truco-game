import { INK, SEAL_GOLD, WASHI } from '@infrastructure/three/textures/palette';
import { degrees, strokeCircle } from '@infrastructure/three/textures/paint-tools';
import type { Shadow, WaxSealSpec } from '@infrastructure/three/textures/seal-mark-specs';

const STAR_PATH = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z';
const STAR_BOX = 24;
const SEAL_LIGHT = '#E2C27A';
const SEAL_TILT = degrees(8);
const HIGHLIGHT = { x: -0.15, y: -0.2, reach: 0.955, stop: 0.7 };
const RING_COLORS = [SEAL_GOLD, WASHI, INK];

export const withShadow = (
  context: CanvasRenderingContext2D,
  shadow: Shadow & { readonly scale: number },
  draw: () => void,
): void => {
  context.save();
  context.shadowColor = shadow.color;
  context.shadowBlur = shadow.blur * shadow.scale;
  context.shadowOffsetY = shadow.y * shadow.scale;
  draw();
  context.restore();
};

const fillDisc = (
  context: CanvasRenderingContext2D,
  radius: number,
  fill: string | CanvasGradient,
) => {
  context.fillStyle = fill;
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
};

const waxGradient = (context: CanvasRenderingContext2D, size: number): CanvasGradient => {
  const x = HIGHLIGHT.x * size;
  const y = HIGHLIGHT.y * size;
  const gradient = context.createRadialGradient(x, y, 0, x, y, HIGHLIGHT.reach * size);
  gradient.addColorStop(0, SEAL_LIGHT);
  gradient.addColorStop(HIGHLIGHT.stop, SEAL_GOLD);
  return gradient;
};

const paintDisc = (context: CanvasRenderingContext2D, seal: WaxSealSpec, scale: number) => {
  const radius = seal.size / 2;
  for (const shadow of [seal.drop, seal.glow]) {
    withShadow(context, { ...shadow, scale }, () => {
      fillDisc(context, radius, SEAL_GOLD);
    });
  }
  fillDisc(context, radius, waxGradient(context, seal.size));
};

const paintRings = (context: CanvasRenderingContext2D, seal: WaxSealSpec) => {
  const radius = seal.size / 2;
  let inner = 0;
  for (const [index, edge] of seal.rings.entries()) {
    const width = edge - inner;
    const color = RING_COLORS[index] ?? INK;
    strokeCircle(context, { radius: radius - inner - width / 2, color, width });
    inner = edge;
  }
};

const paintStar = (context: CanvasRenderingContext2D, size: number) => {
  context.translate(-size / 2, -size / 2);
  context.scale(size / STAR_BOX, size / STAR_BOX);
  context.fillStyle = INK;
  context.fill(new Path2D(STAR_PATH));
};

export const paintWaxSeal = (
  context: CanvasRenderingContext2D,
  seal: WaxSealSpec,
  scale: number,
): void => {
  const center = seal.size / 2 - seal.overhang;
  context.save();
  context.translate(center, center);
  context.rotate(SEAL_TILT);
  paintDisc(context, seal, scale);
  paintRings(context, seal);
  paintStar(context, seal.star);
  context.restore();
};
