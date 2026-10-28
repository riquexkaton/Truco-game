import type { Card } from '@domain/cards/card';
import type { FactionId } from '@domain/cards/faction';
import type { Side } from '@domain/shared/side';

const FIGURE_ATTACK = 10;

const PAIR_BONUS = 20;

export const pactPoints = (card: Card): number => (card.attack >= FIGURE_ATTACK ? 0 : card.attack);

const pairValue = (cards: readonly Card[], faction: FactionId): number => {
  const points = cards
    .filter((card) => card.faction === faction)
    .map((card) => pactPoints(card))
    .toSorted((first, second) => second - first);
  const [best, runnerUp] = points;
  return best === undefined || runnerUp === undefined ? -1 : PAIR_BONUS + best + runnerUp;
};

export const pactValue = (cards: readonly Card[]): number => {
  const bestPair = Math.max(-1, ...cards.map((card) => pairValue(cards, card.faction)));
  return bestPair >= 0 ? bestPair : Math.max(0, ...cards.map((card) => pactPoints(card)));
};

export interface PactValues {
  readonly playerValue: number;
  readonly rivalValue: number;
  readonly roundLead: Side;
}

export const pactWinner = ({ playerValue, rivalValue, roundLead }: PactValues): Side => {
  if (playerValue > rivalValue) return 'player';
  if (rivalValue > playerValue) return 'rival';
  return roundLead;
};
