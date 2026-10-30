import type { PerSide } from '@domain/shared/side';

import type { CardLook } from '@infrastructure/three/cards/duel-look';

export type DuelFxKind = 'smoke' | 'embers';

export const FX_SECONDS = 2.8;

export const SMOKE_TIMING = { fadeIn: 0.2, fadeOutFrom: 0.9, emitFor: 1.3, rise: 1.1 } as const;

const FX_OF_LOOK: Readonly<Record<CardLook, DuelFxKind | null>> = {
  won: 'embers',
  lost: 'smoke',
  even: null,
};

export const duelFx = (
  looks: PerSide<CardLook>,
  isReduced: boolean,
): PerSide<DuelFxKind | null> => ({
  player: isReduced ? null : FX_OF_LOOK[looks.player],
  rival: isReduced ? null : FX_OF_LOOK[looks.rival],
});

export const fxProgress = (age: number): number => Math.min(1, Math.max(0, age / FX_SECONDS));

export const isFxOver = (age: number): boolean => fxProgress(age) >= 1;
