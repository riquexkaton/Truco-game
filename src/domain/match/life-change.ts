import type { LifeChange } from '@domain/life/life';
import { applyLifeChange, isDefeated } from '@domain/life/life';
import type { MatchState } from '@domain/match/match-state';

export const changeLife = (state: MatchState, change: LifeChange): MatchState => {
  const { lives } = applyLifeChange(state.lives, change);
  return { ...state, lives, over: state.over || isDefeated(lives) };
};
