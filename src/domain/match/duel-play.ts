import { hasSeal } from '@domain/cards/attack';
import { cardById } from '@domain/cards/deck';
import type { DuelResult } from '@domain/duel/duel';
import { compareAttacks, isRoundDecided, nextLead, roundWinnerOf } from '@domain/duel/duel';
import { drawEffect } from '@domain/match/effect-store';
import type { CardChoice } from '@domain/match/gates';
import { canPlaceCard } from '@domain/match/gates';
import type { MatchState, PlayedCard } from '@domain/match/match-state';
import { playedAttack, slotOf } from '@domain/match/queries';
import type { Random } from '@domain/shared/random';
import type { Side } from '@domain/shared/side';
import { withSide } from '@domain/shared/side';

export const startTurn = (state: MatchState): MatchState => ({
  ...state,
  usedEffectThisTurn: false,
});

export const placeCard = (state: MatchState, choice: CardChoice): MatchState => {
  if (!canPlaceCard(state, choice)) {
    throw new Error(`Cannot place ${choice.cardId} for ${choice.side}`);
  }
  const { side, cardId } = choice;
  const placed: PlayedCard = { cardId, cursed: state.curse[side] };
  const { available } = state.ritual;
  return {
    ...state,
    hands: withSide(
      state.hands,
      side,
      state.hands[side].filter((id) => id !== cardId),
    ),
    played: withSide(state.played, side, [...state.played[side], placed]),
    curse: withSide(state.curse, side, false),
    ritual: {
      ...state.ritual,
      available: state.duel === 0 ? withSide(available, side, false) : available,
    },
  };
};

export interface DuelOutcome {
  readonly state: MatchState;
  readonly result: DuelResult;
  readonly effectEarner: Side | null;
}

const requireSlot = (state: MatchState, side: Side): PlayedCard => {
  const slot = slotOf(state, side);
  if (slot === null) {
    throw new Error(`The ${side} has not placed a card in duel ${String(state.duel)}`);
  }
  return slot;
};

const sealedWinner = (state: MatchState, result: DuelResult): Side | null => {
  if (result === 'tie') return null;
  return hasSeal(cardById(requireSlot(state, result).cardId), state.vira) ? result : null;
};

const settleDuel = (state: MatchState, result: DuelResult): MatchState => {
  const results = [...state.results, result];
  const isDecided = isRoundDecided(results);
  return {
    ...state,
    results,
    duel: state.duel + 1,
    lead: nextLead(result, state.lead),
    roundOver: isDecided,
    roundWinner: isDecided ? roundWinnerOf(results) : null,
  };
};

export const resolveDuel = (state: MatchState, random: Random): DuelOutcome => {
  const result = compareAttacks({
    player: playedAttack(state, requireSlot(state, 'player')),
    rival: playedAttack(state, requireSlot(state, 'rival')),
  });
  const effectEarner = sealedWinner(state, result);
  const settled = settleDuel(state, result);
  return {
    state: effectEarner === null ? settled : drawEffect(settled, effectEarner, random),
    result,
    effectEarner,
  };
};
