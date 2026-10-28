import type { Card } from '@domain/cards/card';

export const RITUAL_DAMAGE = 3;

export const hasRitual = (cards: readonly Card[]): boolean => {
  const [first] = cards;
  return first !== undefined && cards.every((card) => card.faction === first.faction);
};
