import type { CardId } from '@domain/cards/card';

import type { GameStore } from '@application/store/game-store';

import { calmCard } from '@infrastructure/three/cards/card-motion';
import { isSealedFor } from '@infrastructure/three/cards/sealed-hand';
import type { TableCard } from '@infrastructure/three/cards/table-card';
import { tableCardOf } from '@infrastructure/three/cards/table-deck';
import type { PickCandidate, PickHit } from '@infrastructure/three/interaction/picking';
import { attachPicking } from '@infrastructure/three/interaction/picking';
import type { SealTarget } from '@infrastructure/three/interaction/seal-track';
import type { Stage } from '@infrastructure/three/stage';

export interface PointerControls {
  readonly canvas: HTMLCanvasElement;
  readonly onPickCard: (cardId: CardId) => void;
}

export interface TablePointer {
  readonly release: () => void;
  readonly detach: () => void;
}

interface PointerContext {
  readonly stage: Stage;
  readonly controls: PointerControls;
  hovered: TableCard | null;
}

const isPlayable = (store: GameStore): boolean =>
  store.canPlayCard.value || store.phase.value === 'give';

const candidatesOf = (stage: Stage): PickCandidate[] => {
  if (stage.isClearing) return [];
  const cardOf = (cardId: CardId) => tableCardOf(stage.deck, cardId);
  const hand = stage.hands.player.map((cardId): PickCandidate => ({
    target: { kind: 'hand', cardId },
    card: cardOf(cardId),
  }));
  const table = stage.played.map((pick): PickCandidate => ({
    target: { kind: 'table', pick },
    card: cardOf(pick.cardId),
  }));
  return [...hand, ...table];
};

const hover = (context: PointerContext, card: TableCard | null): void => {
  if (card === context.hovered) return;
  if (context.hovered !== null) calmCard(context.hovered);
  context.hovered = card;
  if (card !== null) card.hoverTarget = 1;
};

const liftedBy = (stage: Stage, hit: PickHit | null): TableCard | null =>
  hit?.candidate.target.kind === 'hand' && isPlayable(stage.store) ? hit.candidate.card : null;

const tilt = (stage: Stage, hit: PickHit, event: PointerEvent): void => {
  if (hit.uv === undefined || stage.reducedMotion || event.pointerType === 'touch') return;
  hit.candidate.card.tiltTarget.set(hit.uv.x - 0.5, hit.uv.y - 0.5);
};

const sealTargetOf = (stage: Stage, hit: PickHit | null): SealTarget | null => {
  if (hit === null) return null;
  const { target, card } = hit.candidate;
  return target.kind === 'hand' && isSealedFor(target.cardId, stage.vira)
    ? { cardId: target.cardId, card }
    : null;
};

const onMove = (context: PointerContext, hit: PickHit | null, event: PointerEvent): void => {
  const { stage, controls } = context;
  const lifted = liftedBy(stage, hit);
  hover(context, lifted);
  if (lifted !== null && hit !== null) tilt(stage, hit, event);
  const isTable = hit?.candidate.target.kind === 'table';
  controls.canvas.style.cursor = lifted !== null || isTable ? 'pointer' : '';
  stage.sealTrack.target = event.pointerType === 'touch' ? null : sealTargetOf(stage, hit);
};

const onSelect = ({ stage, controls }: PointerContext, hit: PickHit): void => {
  const { target, card } = hit.candidate;
  if (target.kind === 'table') {
    stage.listener.cardInspected(target.pick);
    return;
  }
  if (!isPlayable(stage.store)) return;
  card.tiltTarget.set(0, 0);
  controls.onPickCard(target.cardId);
};

export const attachTablePointer = (stage: Stage, controls: PointerControls): TablePointer => {
  const context: PointerContext = { stage, controls, hovered: null };
  const detach = attachPicking({
    canvas: controls.canvas,
    camera: stage.camera,
    candidates: () => candidatesOf(stage),
    onMove: (hit, event) => {
      onMove(context, hit, event);
    },
    onSelect: (hit) => {
      onSelect(context, hit);
    },
  });
  const release = (): void => {
    hover(context, null);
    controls.canvas.style.cursor = '';
  };
  return { release, detach };
};
