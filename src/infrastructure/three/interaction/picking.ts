import type { PerspectiveCamera } from 'three';
import { Raycaster, Vector2 } from 'three';

import type { CardId } from '@domain/cards/card';

import type { PlayedCardPick } from '@application/ports/table-listener';

import type { TableCard } from '@infrastructure/three/cards/table-card';

type PickTarget =
  | { readonly kind: 'hand'; readonly cardId: CardId }
  | { readonly kind: 'table'; readonly pick: PlayedCardPick };

export interface PickCandidate {
  readonly target: PickTarget;
  readonly card: TableCard;
}

export interface PickHit {
  readonly candidate: PickCandidate;
  readonly uv: Vector2 | undefined;
}

export interface PickingOptions {
  readonly canvas: HTMLCanvasElement;
  readonly camera: PerspectiveCamera;
  readonly candidates: () => readonly PickCandidate[];
  readonly onMove: (hit: PickHit | null, event: PointerEvent) => void;
  readonly onSelect: (hit: PickHit) => void;
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

export const attachPicking = (options: PickingOptions): (() => void) => {
  const { canvas } = options;
  const move = (event: PointerEvent): void => {
    options.onMove(pickAt(options, event), event);
  };
  const leave = (event: PointerEvent): void => {
    options.onMove(null, event);
  };
  const click = (event: MouseEvent): void => {
    const hit = pickAt(options, event);
    if (hit !== null) options.onSelect(hit);
  };
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerleave', leave);
  canvas.addEventListener('click', click);
  return () => {
    canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerleave', leave);
    canvas.removeEventListener('click', click);
  };
};
