import {
  acceptedChallenge,
  declineDamage,
  FOLD_DAMAGE,
  nextLevel,
  STAKES,
} from '@domain/challenge/challenge';
import { changeLife } from '@domain/match/life-change';
import type { MatchState } from '@domain/match/match-state';
import type { Side } from '@domain/shared/side';
import { opponent } from '@domain/shared/side';

export interface Retirement {
  readonly side: Side;
  readonly damage: number;
}

export const retire = (state: MatchState, { side, damage }: Retirement): MatchState =>
  changeLife(
    { ...state, roundOver: true, retired: true, roundWinner: opponent(side) },
    { side, amount: -damage },
  );

export const fold = (state: MatchState, side: Side): MatchState =>
  retire(state, { side, damage: FOLD_DAMAGE });

export const acceptChallenge = (state: MatchState, acceptor: Side): MatchState => {
  const challenge = acceptedChallenge(state.challenge, acceptor);
  return { ...state, challenge, stake: STAKES[challenge.level] };
};

export const counterChallenge = (state: MatchState): MatchState => ({
  ...state,
  challenge: { level: 1, holder: null },
  stake: STAKES[1],
});

export const declineChallenge = (state: MatchState, decliner: Side): MatchState =>
  retire(state, { side: decliner, damage: declineDamage(nextLevel(state.challenge)) });
