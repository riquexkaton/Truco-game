import type { Scene } from 'three';
import { Group } from 'three';

import type { PerSide } from '@domain/shared/side';
import { SIDES } from '@domain/shared/side';

import type { CardLook } from '@infrastructure/three/cards/duel-look';
import type { DuelFxKind } from '@infrastructure/three/fx/fx-plan';
import { duelFx, isFxOver, STILL_BURNING } from '@infrastructure/three/fx/fx-plan';
import type { FxSlot, NumberUniform } from '@infrastructure/three/fx/fx-slot';
import { createSmokeSlots } from '@infrastructure/three/fx/smoke-wisps';
import type { VineKit } from '@infrastructure/three/fx/vine-decals';
import { createVineSlots, turnVine } from '@infrastructure/three/fx/vine-decals';
import { vineTurn } from '@infrastructure/three/fx/vine-plan';
import type { TablePoint } from '@infrastructure/three/layout/table-points';
import { slotPoint } from '@infrastructure/three/layout/table-points';

export interface DuelFx {
  readonly group: Group;
  readonly clock: NumberUniform;
  readonly vines: VineKit;
  readonly slots: Readonly<Record<DuelFxKind, readonly FxSlot[]>>;
  readonly every: readonly FxSlot[];
  live: number;
  turns: number;
}

export interface DuelFxCue {
  readonly duel: number;
  readonly looks: PerSide<CardLook>;
  readonly isReduced: boolean;
}

interface FxPlace {
  readonly duel: number;
  readonly point: TablePoint;
}

const TURN_VARIANTS = 4;

export const createDuelFx = (scene: Scene): DuelFx => {
  const group = new Group();
  const clock = { value: 0 };
  const smoke = createSmokeSlots(group, clock);
  const vines = createVineSlots(group, clock);
  scene.add(group);
  return {
    group,
    clock,
    vines: vines.kit,
    slots: { smoke, vines: vines.slots },
    every: [...smoke, ...vines.slots],
    live: 0,
    turns: Math.floor(Math.random() * TURN_VARIANTS),
  };
};

const stopSlot = (fx: DuelFx, slot: FxSlot): void => {
  if (slot.active) fx.live -= 1;
  slot.active = false;
  slot.object.visible = false;
};

const startSlot = (fx: DuelFx, slot: FxSlot, point: TablePoint): void => {
  if (!slot.active) fx.live += 1;
  slot.active = true;
  slot.start.value = fx.clock.value;
  slot.end.value = STILL_BURNING;
  slot.object.position.set(point.x, slot.object.position.y, point.z);
  slot.object.visible = true;
};

const startKind = (fx: DuelFx, kind: DuelFxKind | null, { duel, point }: FxPlace): void => {
  const slot = kind === null ? undefined : fx.slots[kind][duel];
  if (slot === undefined) return;
  startSlot(fx, slot, point);
  if (kind !== 'vines') return;
  turnVine(slot, vineTurn(point.x, fx.turns));
  fx.turns += 1;
};

export const startDuelFx = (fx: DuelFx, cue: DuelFxCue): void => {
  const kinds = duelFx(cue.looks, cue.isReduced);
  fx.vines.still.value = cue.isReduced ? 1 : 0;
  for (const side of SIDES) {
    startKind(fx, kinds[side], { duel: cue.duel, point: slotPoint(side, cue.duel) });
  }
};

export const updateDuelFx = (fx: DuelFx, deltaSeconds: number): void => {
  if (fx.live === 0) return;
  fx.clock.value += deltaSeconds;
  for (const slot of fx.every) {
    if (slot.active && isFxOver(slot.end.value, fx.clock.value)) stopSlot(fx, slot);
  }
};

export const clearDuelFx = (fx: DuelFx): void => {
  for (const slot of fx.every) {
    if (slot.active && slot.end.value === STILL_BURNING) slot.end.value = fx.clock.value;
  }
};
