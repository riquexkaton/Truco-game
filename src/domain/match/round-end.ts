import { changeLife } from '@domain/match/life-change';
import type { MatchState } from '@domain/match/match-state';
import { opponent } from '@domain/shared/side';

export const revealPact = (state: MatchState): MatchState => {
  const { pending } = state.pact;
  return pending === null
    ? state
    : changeLife(
        { ...state, pact: { ...state.pact, pending: null } },
        { side: opponent(pending.winner), amount: -pending.amount },
      );
};

export const settleRound = (state: MatchState): MatchState => {
  const winner = state.retired ? null : state.roundWinner;
  return winner === null
    ? state
    : changeLife(state, { side: opponent(winner), amount: -state.stake });
};

export const finishRound = (state: MatchState): MatchState => {
  if (state.over) return state;
  const revealed = revealPact(state);
  return revealed.over ? revealed : settleRound(revealed);
};
