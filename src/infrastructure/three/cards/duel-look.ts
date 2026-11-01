import type { DuelResult } from '@domain/duel/duel';
import type { PerSide, Side } from '@domain/shared/side';

import { easeOutCubic, lerp } from '@infrastructure/three/cards/tween-math';

export type CardLook = 'won' | 'lost' | 'even';

interface LookLight {
  readonly shade: number;
  readonly grey: number;
}

export type TintTrait = keyof LookLight;

export const TINT_TRAITS: readonly TintTrait[] = ['shade', 'grey'];

const MARK_SECONDS = 0.4;

const UNLIT: LookLight = { shade: 1, grey: 0 };

const LOOK_LIGHTS: Readonly<Record<CardLook, LookLight>> = {
  won: UNLIT,
  lost: { shade: 0.34, grey: 0.8 },
  even: { shade: 0.7, grey: 0.15 },
};

const lookOf = (result: DuelResult, side: Side): CardLook => {
  if (result === 'tie') return 'even';
  return result === side ? 'won' : 'lost';
};

export const duelLooks = (result: DuelResult): PerSide<CardLook> => ({
  player: lookOf(result, 'player'),
  rival: lookOf(result, 'rival'),
});

export const advanceMark = (progress: number, deltaSeconds: number, isReduced: boolean): number =>
  isReduced ? 1 : Math.min(1, progress + deltaSeconds / MARK_SECONDS);

export const traitAt = (look: CardLook, trait: TintTrait, progress: number): number =>
  lerp(UNLIT[trait], LOOK_LIGHTS[look][trait], easeOutCubic(progress));

export const shownAttack = (printed: number, effective: number): number | null =>
  printed === effective ? null : effective;
