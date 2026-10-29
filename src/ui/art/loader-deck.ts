import type { CardId } from '@domain/cards/card';
import { cardById } from '@domain/cards/deck';
import { FACTIONS } from '@domain/cards/faction';

import { cardArtUrl } from '@ui/art/art-urls';
import { PLAY_CARD_ID } from '@ui/art/title-deck';

export interface LoaderCard {
  readonly id: CardId;
  readonly name: string;
  readonly attack: number;
  readonly color: string;
  readonly url: string;
}

export interface CardCycle {
  readonly active: LoaderCard;
  readonly previous: LoaderCard | null;
}

const LOADER_CARD_IDS: readonly CardId[] = [
  'baltasar',
  'brunilda',
  'garin',
  'morgana',
  'oriana',
  'rosalba',
  'elio',
  'saul',
  'brigida',
  'ursula',
  'anselmo',
  'isolda',
  'alba',
  'melquiades',
  'celia',
  'barbara',
];

export const OPENING_CARD_INDEX = Math.max(0, LOADER_CARD_IDS.indexOf(PLAY_CARD_ID));

export const LOADER_CARDS: readonly LoaderCard[] = LOADER_CARD_IDS.map((id) => {
  const card = cardById(id);
  return {
    id,
    name: card.name,
    attack: card.attack,
    color: FACTIONS[card.faction].color,
    url: cardArtUrl(id),
  };
});
