import { itemAt } from '@domain/shared/random';

import type { VineSpec } from '@infrastructure/three/fx/vine-data';
import { dataColor, vineCanvasSize } from '@infrastructure/three/fx/vine-data';
import { paintLeaf } from '@infrastructure/three/fx/vine-leaf-paint';
import type { VinePlan, VinePoint } from '@infrastructure/three/fx/vine-plan';
import { VINE_FIELD } from '@infrastructure/three/fx/vine-plan';
import { VINE_TONES } from '@infrastructure/three/fx/vine-tones';

interface ThreadStroke {
  readonly width: number;
  readonly tone: number;
}

const strokeThread = (
  context: CanvasRenderingContext2D,
  thread: readonly VinePoint[],
  tone: number,
): void => {
  for (let index = 1; index < thread.length; index += 1) {
    const from = itemAt(thread, index - 1);
    const to = itemAt(thread, index);
    const segment = new Path2D();
    segment.moveTo(from.x, from.y);
    segment.lineTo(to.x, to.y);
    context.strokeStyle = dataColor({ tone, grow: from.grow, glint: from.glint });
    context.stroke(segment);
  }
};

const paintThreads = (context: CanvasRenderingContext2D, plan: VinePlan, spec: VineSpec) => {
  const strokes: readonly ThreadStroke[] = [
    { width: spec.core, tone: VINE_TONES.core.at },
    { width: spec.gold, tone: VINE_TONES.gold.at },
  ];
  context.lineCap = 'round';
  for (const { width, tone } of strokes) {
    context.lineWidth = width;
    for (const thread of plan.threads) strokeThread(context, thread, tone);
  }
};

export const paintVines = (context: CanvasRenderingContext2D, plan: VinePlan, spec: VineSpec) => {
  const unit = spec.width / (2 * VINE_FIELD.halfWidth);
  context.translate(spec.width / 2, vineCanvasSize(spec).height / 2);
  context.scale(unit, unit);
  paintThreads(context, plan, spec);
  for (const leaf of plan.leaves) paintLeaf(context, leaf, spec);
};
