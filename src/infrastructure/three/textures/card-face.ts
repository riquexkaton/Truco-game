import { attackOf, hasSeal, isWildcardActive } from '@domain/cards/attack';
import type { Card, CardId } from '@domain/cards/card';
import type { FactionId } from '@domain/cards/faction';
import { FACTIONS } from '@domain/cards/faction';

import { DORMANT_GREY } from '@infrastructure/three/textures/palette';

export interface CardFace {
  readonly card: Card;
  readonly attack: number;
  readonly isActive: boolean;
  readonly isDormant: boolean;
  readonly isSealed: boolean;
  readonly accent: string;
  readonly label: string;
  readonly stampNote: string | null;
  readonly bandAlpha: number;
  readonly artFilter: string;
}

const wildcardLabel = (card: Card, isActive: boolean): string => {
  const kind = card.wildcard?.kind === 'perica' ? 'PERICA' : 'PERICO';
  if (!isActive) return kind;
  return `${kind} ${kind === 'PERICA' ? 'ACTIVA' : 'ACTIVO'}`;
};

const labelOf = (card: Card, isActive: boolean): string => {
  if (card.legendary) return 'LEGENDARIA';
  return card.wildcard === null ? FACTIONS[card.faction].shortName : wildcardLabel(card, isActive);
};

const stampNoteOf = (card: Card, isActive: boolean): string | null => {
  if (card.wildcard === null) return null;
  return isActive ? `BASE ${String(card.attack)}` : 'INACTIVO';
};

export const cardFace = (card: Card, vira: FactionId): CardFace => {
  const isActive = isWildcardActive(card, vira);
  const isDormant = card.wildcard !== null && !isActive;
  return {
    card,
    attack: attackOf(card, vira),
    isActive,
    isDormant,
    isSealed: hasSeal(card, vira),
    accent: isDormant ? DORMANT_GREY : FACTIONS[card.faction].color,
    label: labelOf(card, isActive),
    stampNote: stampNoteOf(card, isActive),
    bandAlpha: isDormant ? 0.25 : 0.55,
    artFilter: isDormant ? 'grayscale(0.85)' : 'saturate(0.88)',
  };
};

export const faceKey = (cardId: CardId, isActive: boolean): string =>
  `${cardId}:${isActive ? 'active' : 'plain'}`;
