import { hasSeal } from '@domain/cards/attack';
import type { CardId } from '@domain/cards/card';
import { cardById } from '@domain/cards/deck';
import type { FactionId } from '@domain/cards/faction';
import type { PerSide } from '@domain/shared/side';

export const isSealedFor = (cardId: CardId, vira: FactionId | null): boolean =>
  vira !== null && hasSeal(cardById(cardId), vira);

export const sealedHandCards = (
  hands: PerSide<readonly CardId[]>,
  vira: FactionId | null,
): CardId[] => hands.player.filter((cardId) => isSealedFor(cardId, vira));
