import { drawEffect } from '@domain/match/effect-store';
import { changeLife } from '@domain/match/life-change';
import type { MatchState } from '@domain/match/match-state';
import { RITUAL_DAMAGE } from '@domain/ritual/ritual';
import type { Random } from '@domain/shared/random';
import type { Side } from '@domain/shared/side';
import { opponent, withSide } from '@domain/shared/side';

export const singRitual = (state: MatchState, side: Side, random: Random): MatchState => {
  const sung = changeLife(
    {
      ...state,
      ritual: { sung: true, available: withSide(state.ritual.available, side, false) },
    },
    { side: opponent(side), amount: -RITUAL_DAMAGE },
  );
  return sung.over ? sung : drawEffect(sung, side, random);
};
