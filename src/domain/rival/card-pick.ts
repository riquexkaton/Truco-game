import { attackOf } from '@domain/cards/attack';
import type { Card, CardId } from '@domain/cards/card';
import { winsOf } from '@domain/duel/duel';
import type { MatchState } from '@domain/match/match-state';
import { handAttack, handCards, playedAttack, slotOf } from '@domain/match/queries';
import { itemAt } from '@domain/shared/random';
import type { Side } from '@domain/shared/side';

const ascendingBy = (cards: readonly Card[], score: (card: Card) => number): Card[] =>
  cards.toSorted((first, second) => score(first) - score(second));

const byEffectiveAttack = (state: MatchState, side: Side): Card[] =>
  ascendingBy(handCards(state, side), (card) => handAttack(state, side, card));

export const timeoutCard = (state: MatchState, side: Side): CardId =>
  itemAt(byEffectiveAttack(state, side), 0).id;

export const plunderGive = (state: MatchState, side: Side): CardId =>
  itemAt(
    ascendingBy(handCards(state, side), (card) => attackOf(card, state.vira)),
    0,
  ).id;

const answerPick = (state: MatchState, sorted: readonly Card[], toBeat: number): Card =>
  sorted.find((card) => handAttack(state, 'rival', card) > toBeat) ?? itemAt(sorted, 0);

const leadPick = (state: MatchState, sorted: readonly Card[]): Card => {
  const wins = winsOf(state.results);
  if (wins.rival > wins.player) return itemAt(sorted, 0);
  if (wins.player > wins.rival) return itemAt(sorted, sorted.length - 1);
  return itemAt(sorted, Math.floor((sorted.length - 1) / 2));
};

export const rivalCardPick = (state: MatchState): CardId => {
  const sorted = byEffectiveAttack(state, 'rival');
  const playerSlot = slotOf(state, 'player');
  const pick =
    playerSlot === null
      ? leadPick(state, sorted)
      : answerPick(state, sorted, playedAttack(state, playerSlot));
  return pick.id;
};
