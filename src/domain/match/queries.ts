import { effectiveAttack } from '@domain/cards/attack';
import type { Card } from '@domain/cards/card';
import { cardById, cardsByIds } from '@domain/cards/deck';
import { survivorOf } from '@domain/life/life';
import type { MatchState, PlayedCard } from '@domain/match/match-state';
import type { Side } from '@domain/shared/side';
import { opponent } from '@domain/shared/side';

export const slotOf = (state: MatchState, side: Side): PlayedCard | null =>
  state.played[side][state.duel] ?? null;

export const hasPlaced = (state: MatchState, side: Side): boolean => slotOf(state, side) !== null;

export const handCards = (state: MatchState, side: Side): Card[] => cardsByIds(state.hands[side]);

export const playedAttack = (state: MatchState, played: PlayedCard): number =>
  effectiveAttack(cardById(played.cardId), state.vira, played.cursed);

export const handAttack = (state: MatchState, side: Side, card: Card): number =>
  effectiveAttack(card, state.vira, state.curse[side]);

export const isDuelReady = (state: MatchState): boolean =>
  hasPlaced(state, 'player') && hasPlaced(state, 'rival');

export const currentTurn = (state: MatchState): Side | null => {
  if (state.over || state.roundOver || isDuelReady(state)) return null;
  return hasPlaced(state, state.lead) ? opponent(state.lead) : state.lead;
};

export const matchWinner = (state: MatchState): Side | null =>
  state.over ? survivorOf(state.lives) : null;
