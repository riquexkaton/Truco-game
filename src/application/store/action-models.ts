import type { ReadonlySignal } from '@preact/signals-core';
import { computed } from '@preact/signals-core';

import type { ChallengeLevel } from '@domain/challenge/challenge';
import { NO_CHALLENGE, STAKES } from '@domain/challenge/challenge';
import type { EffectId } from '@domain/effects/effect';
import type { EffectBlock } from '@domain/match/gates';
import {
  canCallPact,
  canFold,
  canRaiseChallenge,
  canSingRitual,
  canUseEffect,
  effectBlock,
} from '@domain/match/gates';
import type { MatchState } from '@domain/match/match-state';
import { hasPlaced } from '@domain/match/queries';
import type { Side } from '@domain/shared/side';

import type { GameSignals } from '@application/store/game-signals';
import { canPlayerAct } from '@application/store/game-signals';

export interface ChallengeView {
  readonly level: ChallengeLevel;
  readonly holder: Side | null;
  readonly stake: number;
}

export interface ActionModels {
  readonly canPlayCard: ReadonlySignal<boolean>;
  readonly canChallenge: ReadonlySignal<boolean>;
  readonly challenge: ReadonlySignal<ChallengeView>;
  readonly canCallPact: ReadonlySignal<boolean>;
  readonly canSingRitual: ReadonlySignal<boolean>;
  readonly ritualReady: ReadonlySignal<boolean>;
  readonly canFold: ReadonlySignal<boolean>;
  readonly canUseEffect: (effect: EffectId) => boolean;
  readonly effectBlock: (effect: EffectId) => EffectBlock | null;
}

type Gate = (state: MatchState) => boolean;

const NO_CHALLENGE_VIEW: ChallengeView = { ...NO_CHALLENGE, stake: STAKES[0] };

const canPlayerDo = (signals: GameSignals, isAllowed: Gate): boolean => {
  const state = signals.match.value;
  return state !== null && canPlayerAct(signals) && isAllowed(state);
};

const gateModel = (signals: GameSignals, isAllowed: Gate): ReadonlySignal<boolean> =>
  computed(() => canPlayerDo(signals, isAllowed));

const playerEffectBlock = (signals: GameSignals, effect: EffectId): EffectBlock | null => {
  const state = signals.match.value;
  return state === null || !canPlayerAct(signals)
    ? 'turn'
    : effectBlock(state, { side: 'player', effect });
};

const isRitualReady = (state: MatchState | null): boolean =>
  state !== null &&
  state.ritual.available.player &&
  state.duel === 0 &&
  !hasPlaced(state, 'player');

const challengeViewOf = (state: MatchState | null): ChallengeView =>
  state === null ? NO_CHALLENGE_VIEW : { ...state.challenge, stake: state.stake };

export const createActionModels = (signals: GameSignals): ActionModels => ({
  canPlayCard: computed(() => signals.phase.value === 'give' || canPlayerAct(signals)),
  canChallenge: gateModel(signals, (state) => canRaiseChallenge(state, 'player')),
  challenge: computed(() => challengeViewOf(signals.match.value)),
  canCallPact: gateModel(signals, (state) => canCallPact(state, 'player')),
  canSingRitual: gateModel(signals, (state) => canSingRitual(state, 'player')),
  ritualReady: computed(() => isRitualReady(signals.match.value)),
  canFold: gateModel(signals, (state) => canFold(state, 'player')),
  canUseEffect: (effect) =>
    canPlayerDo(signals, (state) => canUseEffect(state, { side: 'player', effect })),
  effectBlock: (effect) => playerEffectBlock(signals, effect),
});
