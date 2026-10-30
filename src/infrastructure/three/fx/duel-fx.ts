import type { Camera, Scene, WebGLRenderer } from 'three';
import { Group } from 'three';

import type { PerSide } from '@domain/shared/side';
import { SIDES } from '@domain/shared/side';

import type { CardLook } from '@infrastructure/three/cards/duel-look';
import { createEmberSlots } from '@infrastructure/three/fx/ember-bursts';
import type { DuelFxKind } from '@infrastructure/three/fx/fx-plan';
import { duelFx, isFxOver } from '@infrastructure/three/fx/fx-plan';
import type { FxSlot, NumberUniform } from '@infrastructure/three/fx/fx-slot';
import { createSmokeSlots } from '@infrastructure/three/fx/smoke-wisps';
import type { TablePoint } from '@infrastructure/three/layout/table-points';
import { CARD_Y, slotPoint } from '@infrastructure/three/layout/table-points';

export interface DuelFx {
  readonly group: Group;
  readonly clock: NumberUniform;
  readonly emberSize: NumberUniform;
  readonly slots: Readonly<Record<DuelFxKind, readonly FxSlot[]>>;
  readonly every: readonly FxSlot[];
  live: number;
}

export interface DuelFxCue {
  readonly duel: number;
  readonly looks: PerSide<CardLook>;
  readonly isReduced: boolean;
  readonly pixelRatio: number;
}

export interface FxView {
  readonly renderer: WebGLRenderer;
  readonly camera: Camera;
}

const FX_LIFT = 0.03;
const EMBER_PIXELS = 14;

export const createDuelFx = (scene: Scene): DuelFx => {
  const group = new Group();
  const clock = { value: 0 };
  const emberSize = { value: EMBER_PIXELS };
  const smoke = createSmokeSlots(group, clock);
  const embers = createEmberSlots(group, { clock, size: emberSize });
  scene.add(group);
  const every = [...smoke, ...embers];
  return { group, clock, emberSize, slots: { smoke, embers }, every, live: 0 };
};

const showAll = (fx: DuelFx, isVisible: boolean): void => {
  for (const slot of fx.every) {
    slot.object.visible = isVisible;
  }
};

export const warmDuelFx = (fx: DuelFx, { renderer, camera }: FxView): void => {
  showAll(fx, true);
  renderer.render(fx.group, camera);
  showAll(fx, false);
};

const stopSlot = (fx: DuelFx, slot: FxSlot): void => {
  if (slot.active) fx.live -= 1;
  slot.active = false;
  slot.object.visible = false;
};

const startSlot = (fx: DuelFx, slot: FxSlot | undefined, point: TablePoint): void => {
  if (slot === undefined) return;
  if (!slot.active) fx.live += 1;
  slot.active = true;
  slot.start.value = fx.clock.value;
  slot.object.position.set(point.x, CARD_Y + FX_LIFT, point.z);
  slot.object.visible = true;
};

export const startDuelFx = (fx: DuelFx, cue: DuelFxCue): void => {
  const kinds = duelFx(cue.looks, cue.isReduced);
  fx.emberSize.value = EMBER_PIXELS * cue.pixelRatio;
  for (const side of SIDES) {
    const kind = kinds[side];
    if (kind !== null) startSlot(fx, fx.slots[kind][cue.duel], slotPoint(side, cue.duel));
  }
};

export const updateDuelFx = (fx: DuelFx, deltaSeconds: number): void => {
  if (fx.live === 0) return;
  fx.clock.value += deltaSeconds;
  for (const slot of fx.every) {
    if (slot.active && isFxOver(fx.clock.value - slot.start.value)) stopSlot(fx, slot);
  }
};

export const clearDuelFx = (fx: DuelFx): void => {
  for (const slot of fx.every) {
    stopSlot(fx, slot);
  }
};
