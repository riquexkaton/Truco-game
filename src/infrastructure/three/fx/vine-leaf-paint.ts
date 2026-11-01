import type { VineData, VineSpec } from '@infrastructure/three/fx/vine-data';
import { dataColor } from '@infrastructure/three/fx/vine-data';
import type { VineLeaf } from '@infrastructure/three/fx/vine-plan';
import { VINE_TIMING } from '@infrastructure/three/fx/vine-plan';
import { VINE_TONES } from '@infrastructure/three/fx/vine-tones';

interface LeafPaths {
  readonly blade: Path2D;
  readonly midrib: Path2D;
}

const LEAF_SLICES = 6;
const LEAF_HALF_WIDTH = 0.26;
const MIDRIB = { from: 0.1, to: 0.84 } as const;

const leafPaths = (): LeafPaths => {
  const blade = new Path2D();
  blade.moveTo(0, 0);
  blade.bezierCurveTo(0.21, -0.32, 0.68, -0.37, 1, 0);
  blade.bezierCurveTo(0.68, 0.37, 0.21, 0.32, 0, 0);
  blade.closePath();
  const midrib = new Path2D();
  midrib.moveTo(MIDRIB.from, 0);
  midrib.lineTo(MIDRIB.to, 0);
  return { blade, midrib };
};

const leafFill = (context: CanvasRenderingContext2D, data: VineData): CanvasGradient => {
  const fill = context.createLinearGradient(0, -LEAF_HALF_WIDTH, 0, LEAF_HALF_WIDTH);
  fill.addColorStop(0, dataColor({ ...data, tone: VINE_TONES.leafLight.at }));
  fill.addColorStop(0.55, dataColor({ ...data, tone: VINE_TONES.leafMid.at }));
  fill.addColorStop(1, dataColor({ ...data, tone: VINE_TONES.leafDark.at }));
  return fill;
};

const clipFrom = (context: CanvasRenderingContext2D, from: number): void => {
  const rest = new Path2D();
  rest.rect(from, -1, 2, 2);
  context.clip(rest);
};

const paintSlice = (context: CanvasRenderingContext2D, paths: LeafPaths, data: VineData) => {
  context.fillStyle = leafFill(context, data);
  context.fill(paths.blade);
  context.strokeStyle = dataColor({ ...data, tone: VINE_TONES.outline.at });
  context.stroke(paths.blade);
  context.strokeStyle = dataColor({ ...data, tone: VINE_TONES.core.at });
  context.stroke(paths.midrib);
};

const paintLeafSlices = (context: CanvasRenderingContext2D, leaf: VineLeaf): void => {
  const paths = leafPaths();
  for (let slice = 0; slice < LEAF_SLICES; slice += 1) {
    const from = slice / LEAF_SLICES;
    context.save();
    clipFrom(context, from);
    paintSlice(context, paths, {
      tone: 0,
      grow: leaf.grow + from * VINE_TIMING.unfurl,
      glint: leaf.glint,
    });
    context.restore();
  }
};

export const paintLeaf = (context: CanvasRenderingContext2D, leaf: VineLeaf, spec: VineSpec) => {
  const length = leaf.length * spec.leaf;
  context.save();
  context.translate(leaf.x, leaf.y);
  context.rotate(leaf.angle);
  context.scale(length, length);
  context.lineWidth = spec.outline / length;
  paintLeafSlices(context, leaf);
  context.restore();
};
