import type { Card } from '@domain/cards/card';
import type { FactionId } from '@domain/cards/faction';

const CURSE_PENALTY = 4;

export const isWildcardActive = (card: Card, vira: FactionId): boolean =>
  card.wildcard !== null && card.faction === vira;

export const attackOf = (card: Card, vira: FactionId): number =>
  card.wildcard !== null && card.faction === vira ? card.wildcard.activeAttack : card.attack;

export const effectiveAttack = (card: Card, vira: FactionId, isCursed: boolean): number =>
  Math.max(0, attackOf(card, vira) - (isCursed ? CURSE_PENALTY : 0));

export const hasSeal = (card: Card, vira: FactionId): boolean =>
  card.legendary || isWildcardActive(card, vira);
