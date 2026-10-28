import type { CardPose } from '@infrastructure/three/cards/card-state';
import type { TableCard } from '@infrastructure/three/cards/table-card';
import {
  advanceProgress,
  approach,
  arcHeight,
  easeInOutCubic,
  lerp,
} from '@infrastructure/three/cards/tween-math';

export interface CardMove {
  readonly pose: CardPose;
  readonly duration: number;
  readonly lift: number;
}

const SETTLED = 0.0005;
const HOVER_RATE = 12;
const TILT_RATE = 10;

const finishTween = (card: TableCard): void => {
  const { tween } = card;
  card.tween = null;
  tween?.resolve();
};

const applyPose = (card: TableCard): void => {
  const { hover, tilt, position } = card;
  card.group.position.set(position.x, position.y + hover * 0.12, position.z - hover * 0.08);
  card.group.rotation.set(
    card.rx + hover * 0.18 - tilt.y * 0.55 * hover,
    tilt.x * 0.55 * hover,
    card.rz * (1 - hover),
  );
  card.group.scale.setScalar(1 + hover * 0.08);
};

const stepTween = (card: TableCard, deltaSeconds: number): void => {
  const { tween } = card;
  if (tween === null) return;
  tween.progress = advanceProgress(tween.progress, deltaSeconds, tween.duration);
  const eased = easeInOutCubic(tween.progress);
  card.position.lerpVectors(tween.from.position, tween.to.position, eased);
  card.position.y += arcHeight(eased, tween.lift);
  card.rx = lerp(tween.from.rx, tween.to.rx, eased);
  card.rz = lerp(tween.from.rz, tween.to.rz, eased);
  if (tween.progress >= 1) finishTween(card);
};

const stepHover = (card: TableCard, deltaSeconds: number): void => {
  card.hover = approach(card.hover, card.hoverTarget, deltaSeconds * HOVER_RATE);
  card.tilt.lerp(card.tiltTarget, Math.min(1, deltaSeconds * TILT_RATE));
  card.glareMaterial.opacity = card.hover * 0.28;
  if (card.hover > 0.001) {
    card.glareMap.offset.set(0.5 - 0.5 * (card.tilt.x + 0.5), 0.5 - 0.5 * (card.tilt.y + 0.5));
  }
};

export const isCardMoving = (card: TableCard): boolean =>
  card.tween !== null ||
  Math.abs(card.hover - card.hoverTarget) > SETTLED ||
  card.tilt.distanceTo(card.tiltTarget) > SETTLED;

export const placeCardAt = (card: TableCard, pose: CardPose): void => {
  finishTween(card);
  card.position.copy(pose.position);
  card.rx = pose.rx;
  card.rz = pose.rz;
  applyPose(card);
};

export const moveCard = (card: TableCard, move: CardMove): Promise<void> =>
  new Promise<void>((resolve) => {
    finishTween(card);
    card.tween = {
      from: { position: card.position.clone(), rx: card.rx, rz: card.rz },
      to: { ...move.pose, position: move.pose.position.clone() },
      duration: move.duration,
      lift: move.lift,
      resolve,
      progress: 0,
    };
  });

export const calmCard = (card: TableCard): void => {
  card.hoverTarget = 0;
  card.tiltTarget.set(0, 0);
};

export const updateCard = (card: TableCard, deltaSeconds: number): void => {
  stepTween(card, deltaSeconds);
  stepHover(card, deltaSeconds);
  applyPose(card);
};
