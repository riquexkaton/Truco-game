import type { CardId } from '@domain/cards/card';
import { canRaise } from '@domain/challenge/challenge';
import type { EffectId } from '@domain/effects/effect';
import type { MatchState } from '@domain/match/match-state';
import { hasPlaced } from '@domain/match/queries';
import type { Side } from '@domain/shared/side';
import { opponent } from '@domain/shared/side';

const canAct = (state: MatchState): boolean => !state.over && !state.roundOver;

const isAwaitingCard = (state: MatchState, side: Side): boolean =>
  canAct(state) && !hasPlaced(state, side);

export interface CardChoice {
  readonly side: Side;
  readonly cardId: CardId;
}

export const canPlaceCard = (state: MatchState, { side, cardId }: CardChoice): boolean =>
  isAwaitingCard(state, side) && state.hands[side].includes(cardId);

export const canFold = (state: MatchState, side: Side): boolean => isAwaitingCard(state, side);

export const canRaiseChallenge = (state: MatchState, side: Side): boolean =>
  isAwaitingCard(state, side) && canRaise(state.challenge, side);

const isBeforeFirstCard = (state: MatchState, side: Side): boolean =>
  isAwaitingCard(state, side) && state.duel === 0;

export const canCallPact = (state: MatchState, side: Side): boolean =>
  isBeforeFirstCard(state, side) && !state.pact.done && !state.ritual.sung;

export const canSingRitual = (state: MatchState, side: Side): boolean =>
  isBeforeFirstCard(state, side) && state.ritual.available[side];

export interface EffectChoice {
  readonly side: Side;
  readonly effect: EffectId;
}

export type EffectBlock = 'turn' | 'used' | 'noPlunderTarget';

const hasPlunderTargets = (state: MatchState, side: Side): boolean =>
  state.hands[side].length > 0 && state.hands[opponent(side)].length > 0;

export const effectBlock = (
  state: MatchState,
  { side, effect }: EffectChoice,
): EffectBlock | null => {
  if (!isAwaitingCard(state, side)) return 'turn';
  if (state.usedEffectThisTurn) return 'used';
  return effect === 'saqueo' && !hasPlunderTargets(state, side) ? 'noPlunderTarget' : null;
};

export const canUseEffect = (state: MatchState, choice: EffectChoice): boolean =>
  state.effects.stored[choice.side].includes(choice.effect) && effectBlock(state, choice) === null;
