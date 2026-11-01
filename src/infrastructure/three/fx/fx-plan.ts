import type { PerSide } from '@domain/shared/side';

import type { CardLook } from '@infrastructure/three/cards/duel-look';

export type DuelFxKind = 'smoke' | 'vines';

export const FX_FADE_OUT = 1.4;

export const SMOKE_TIMING = { fadeIn: 0.6, fadeOut: FX_FADE_OUT, rise: 0.7 } as const;

export const STILL_BURNING = -1;

const FX_OF_LOOK: Readonly<Record<CardLook, DuelFxKind | null>> = {
  won: 'vines',
  lost: 'smoke',
  even: null,
};

const KEPT_WHEN_REDUCED: Readonly<Record<DuelFxKind, boolean>> = { smoke: false, vines: true };

const fxOf = (look: CardLook, isReduced: boolean): DuelFxKind | null => {
  const kind = FX_OF_LOOK[look];
  if (kind === null) return null;
  return !isReduced || KEPT_WHEN_REDUCED[kind] ? kind : null;
};

export const duelFx = (
  looks: PerSide<CardLook>,
  isReduced: boolean,
): PerSide<DuelFxKind | null> => ({
  player: fxOf(looks.player, isReduced),
  rival: fxOf(looks.rival, isReduced),
});

export const isFxOver = (snuffedAt: number, clock: number): boolean =>
  snuffedAt !== STILL_BURNING && clock - snuffedAt >= FX_FADE_OUT;
