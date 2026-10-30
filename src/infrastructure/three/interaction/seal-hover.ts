import type { PerspectiveCamera } from 'three';
import { Box2, Vector2, Vector3 } from 'three';

import type { ScreenRect } from '@application/ports/table-listener';

import type { TableCard } from '@infrastructure/three/cards/table-card';
import type { SealTarget } from '@infrastructure/three/interaction/seal-track';
import { CARD_HEIGHT, CARD_WIDTH } from '@infrastructure/three/layout/table-points';
import type { Stage } from '@infrastructure/three/stage';

const CORNERS = [
  [-1, 1],
  [1, 1],
  [1, -1],
  [-1, -1],
] as const;

const SETTLED_PX = 0.5;
const box = new Box2();
const point = new Vector2();
const corner = new Vector3();

const projectCard = (card: TableCard, camera: PerspectiveCamera): Box2 => {
  box.makeEmpty();
  for (const [x, y] of CORNERS) {
    corner.set((x * CARD_WIDTH) / 2, (y * CARD_HEIGHT) / 2, 0);
    corner.applyMatrix4(card.front.matrixWorld).project(camera);
    point.set(
      ((corner.x + 1) / 2) * globalThis.innerWidth,
      ((1 - corner.y) / 2) * globalThis.innerHeight,
    );
    box.expandByPoint(point);
  }
  return box;
};

const isSettled = (rect: ScreenRect | null, next: Box2): boolean =>
  rect !== null &&
  Math.abs(rect.left - next.min.x) < SETTLED_PX &&
  Math.abs(rect.top - next.min.y) < SETTLED_PX &&
  Math.abs(rect.left + rect.width - next.max.x) < SETTLED_PX &&
  Math.abs(rect.top + rect.height - next.max.y) < SETTLED_PX;

const rectOf = ({ min, max }: Box2): ScreenRect => ({
  left: min.x,
  top: min.y,
  width: max.x - min.x,
  height: max.y - min.y,
});

const heldTarget = (stage: Stage): SealTarget | null => {
  const { target } = stage.sealTrack;
  return target !== null && stage.hands.player.includes(target.cardId) ? target : null;
};

const forget = (stage: Stage): void => {
  const track = stage.sealTrack;
  track.target = null;
  if (track.rect === null) return;
  track.rect = null;
  stage.listener.sealHovered(null);
};

export const trackSealHover = (stage: Stage): void => {
  const target = heldTarget(stage);
  if (target === null) {
    forget(stage);
    return;
  }
  const next = projectCard(target.card, stage.camera);
  if (isSettled(stage.sealTrack.rect, next)) return;
  const rect = rectOf(next);
  stage.sealTrack.rect = rect;
  stage.listener.sealHovered({ cardId: target.cardId, rect });
};
