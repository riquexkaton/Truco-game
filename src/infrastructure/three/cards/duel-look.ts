import type { DuelResult } from '@domain/duel/duel';
import type { PerSide, Side } from '@domain/shared/side';

import { easeOutCubic, lerp } from '@infrastructure/three/cards/tween-math';

export type CardLook = 'won' | 'lost' | 'even';

interface LookLight {
  readonly shade: number;
  readonly grey: number;
  readonly sepia: number;
  readonly glow: number;
  readonly pool: number;
}

export type LookTrait = keyof LookLight;

export type TintTrait = Exclude<LookTrait, 'pool'>;

export const TINT_TRAITS: readonly TintTrait[] = ['shade', 'grey', 'sepia', 'glow'];

const MARK_SECONDS = 0.4;

export const WARM_LIGHT = { r: 1, g: 0.667, b: 0.314 } as const;

const LOOK_LIGHTS: Readonly<Record<CardLook, LookLight>> = {
  won: { shade: 1.3, grey: -0.12, sepia: 0.12, glow: 0.24, pool: 0.8 },
  lost: { shade: 0.34, grey: 0.8, sepia: 0, glow: 0, pool: 0 },
  even: { shade: 0.7, grey: 0.15, sepia: 0, glow: 0, pool: 0 },
};

const UNLIT: LookLight = { shade: 1, grey: 0, sepia: 0, glow: 0, pool: 0 };

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

export const traitAt = (look: CardLook, trait: LookTrait, progress: number): number =>
  lerp(UNLIT[trait], LOOK_LIGHTS[look][trait], easeOutCubic(progress));

export const shownAttack = (printed: number, effective: number): number | null =>
  printed === effective ? null : effective;
