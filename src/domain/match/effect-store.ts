import { MAX_STORED_EFFECTS } from '@domain/effects/effect';
import { drawFromPile } from '@domain/effects/effect-pile';
import type { MatchState } from '@domain/match/match-state';
import type { Random } from '@domain/shared/random';
import { itemAt } from '@domain/shared/random';
import type { Side } from '@domain/shared/side';
import { withSide } from '@domain/shared/side';

export const drawEffect = (state: MatchState, side: Side, random: Random): MatchState => {
  const { effects } = state;
  const { pile, effect } = drawFromPile(effects, random);
  const stored = effect === null ? effects.stored[side] : [...effects.stored[side], effect];
  return {
    ...state,
    effects: { ...pile, stored: withSide(effects.stored, side, stored) },
  };
};

export const requiresDiscard = (state: MatchState, side: Side): boolean =>
  state.effects.stored[side].length > MAX_STORED_EFFECTS;

export interface EffectDiscard {
  readonly side: Side;
  readonly index: number;
}

export const discardEffect = (state: MatchState, { side, index }: EffectDiscard): MatchState => {
  const { effects } = state;
  const discarded = itemAt(effects.stored[side], index);
  return {
    ...state,
    effects: {
      ...effects,
      stored: withSide(effects.stored, side, effects.stored[side].toSpliced(index, 1)),
      discard: [...effects.discard, discarded],
    },
  };
};
