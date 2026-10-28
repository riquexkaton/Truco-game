import { STAKES } from '@domain/challenge/challenge';
import type { MatchState } from '@domain/match/match-state';
import { hasPlaced } from '@domain/match/queries';

import type { GameStore } from '@application/store/game-store';

import { challengeItemCopy, pactItemCopy, RITUAL_ITEM } from '@ui/copy/action-copy';
import type { ActionBarModel } from '@ui/organisms/action-model';

const isPactOpen = (state: MatchState | null): boolean =>
  state === null || (state.duel === 0 && !state.pact.done && !hasPlaced(state, 'player'));

const isPactVisible = (store: GameStore): boolean =>
  store.pendingPactAmount.value !== null || store.ritualSung.value || isPactOpen(store.match.value);

const raisedStake = (stake: number): number | null => (stake > STAKES[0] ? stake : null);

export const actionBarModel = (store: GameStore): ActionBarModel => {
  const pendingAmount = store.pendingPactAmount.value;
  const challenge = store.challenge.value;
  return {
    canFold: store.canFold.value,
    isTurn: store.canFold.value,
    challenge: {
      copy: challengeItemCopy(challenge),
      isEnabled: store.canChallenge.value,
      isVisible: true,
    },
    pact: {
      copy: pactItemCopy({ ritualSung: store.ritualSung.value, pendingAmount }),
      isEnabled: store.canCallPact.value,
      isVisible: isPactVisible(store),
    },
    ritual: {
      copy: RITUAL_ITEM,
      isEnabled: store.canSingRitual.value,
      isVisible: store.ritualReady.value,
    },
    pactAmount: pendingAmount,
    roundStake: raisedStake(challenge.stake),
  };
};
