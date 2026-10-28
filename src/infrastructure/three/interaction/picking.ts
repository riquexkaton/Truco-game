import type { PerspectiveCamera } from 'three';
import { Raycaster, Vector2 } from 'three';

import type { CardId } from '@domain/cards/card';

import { calmCard } from '@infrastructure/three/cards/card-motion';
import type { TableCard } from '@infrastructure/three/cards/table-card';

export interface PickCandidate {
  readonly cardId: CardId;
  readonly card: TableCard;
}

export interface PickingOptions {
  readonly canvas: HTMLCanvasElement;
  readonly camera: PerspectiveCamera;
  readonly reducedMotion: boolean;
  readonly candidates: () => readonly PickCandidate[];
  readonly isActive: () => boolean;
  readonly onPick: (cardId: CardId) => void;
}

export interface Picking {
  readonly release: () => void;
  readonly detach: () => void;
}

interface PickHit {
  readonly candidate: PickCandidate;
  readonly uv: Vector2 | undefined;
}

interface HoverState {
  hovered: TableCard | null;
}

const raycaster = new Raycaster();
const pointer = new Vector2();

const pickAt = (options: PickingOptions, event: MouseEvent): PickHit | null => {
  const bounds = options.canvas.getBoundingClientRect();
  pointer.set(
    ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
    -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
  );
  raycaster.setFromCamera(pointer, options.camera);
  const candidates = options.candidates();
  const meshes = candidates.flatMap(({ card }) => [card.front, card.back]);
  const hit = raycaster.intersectObjects(meshes, false)[0];
  if (hit === undefined) return null;
  const candidate = candidates.find(
    ({ card }) => card.front === hit.object || card.back === hit.object,
  );
  return candidate === undefined ? null : { candidate, uv: hit.uv };
};

const hover = (state: HoverState, card: TableCard | null): void => {
  if (card === state.hovered) return;
  if (state.hovered !== null) calmCard(state.hovered);
  state.hovered = card;
  if (card !== null) card.hoverTarget = 1;
};

const canTilt = (options: PickingOptions, event: PointerEvent): boolean =>
  !options.reducedMotion && event.pointerType !== 'touch';

const onPointerMove = (options: PickingOptions, state: HoverState, event: PointerEvent): void => {
  const hit = options.isActive() ? pickAt(options, event) : null;
  hover(state, hit?.candidate.card ?? null);
  if (hit?.uv !== undefined && canTilt(options, event)) {
    hit.candidate.card.tiltTarget.set(hit.uv.x - 0.5, hit.uv.y - 0.5);
  }
  options.canvas.style.cursor = hit === null ? '' : 'pointer';
};

const onClick = (options: PickingOptions, event: MouseEvent): void => {
  const hit = options.isActive() ? pickAt(options, event) : null;
  if (hit === null) return;
  hit.candidate.card.tiltTarget.set(0, 0);
  options.onPick(hit.candidate.cardId);
};

export const attachPicking = (options: PickingOptions): Picking => {
  const state: HoverState = { hovered: null };
  const { canvas } = options;
  const move = (event: PointerEvent): void => {
    onPointerMove(options, state, event);
  };
  const release = (): void => {
    hover(state, null);
    canvas.style.cursor = '';
  };
  const click = (event: MouseEvent): void => {
    onClick(options, event);
  };
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerleave', release);
  canvas.addEventListener('click', click);
  const detach = (): void => {
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerleave', release);
    canvas.removeEventListener('click', click);
  };
  return { release, detach };
};
