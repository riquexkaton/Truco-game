import type { Card, CardId, WildcardKind } from '@domain/cards/card';
import type { FactionId } from '@domain/cards/faction';
import { FACTION_IDS } from '@domain/cards/faction';
import type { FactionRoster } from '@domain/cards/roster';
import { ROSTER } from '@domain/cards/roster';

const WILDCARD_ATTACK: Readonly<Record<WildcardKind, { base: number; active: number }>> = {
  perico: { base: 6, active: 15 },
  perica: { base: 5, active: 14 },
};

interface CardSeed {
  readonly faction: FactionId;
  readonly entry: readonly [id: string, name: string, ...attack: number[]];
}

const plainCard = (seed: CardSeed, attack: number, isLegendary: boolean): Card => ({
  id: seed.entry[0],
  name: seed.entry[1],
  faction: seed.faction,
  attack,
  legendary: isLegendary,
  wildcard: null,
});

const wildcardCard = (seed: CardSeed, kind: WildcardKind): Card => ({
  ...plainCard(seed, WILDCARD_ATTACK[kind].base, false),
  wildcard: { kind, activeAttack: WILDCARD_ATTACK[kind].active },
});

const factionCards = (faction: FactionId, roster: FactionRoster): Card[] => [
  plainCard({ faction, entry: roster.legend }, roster.legend[2], true),
  wildcardCard({ faction, entry: roster.perico }, 'perico'),
  wildcardCard({ faction, entry: roster.perica }, 'perica'),
  ...roster.normals.map((entry) => plainCard({ faction, entry }, entry[2], false)),
];

export const DECK: readonly Card[] = FACTION_IDS.flatMap((faction) =>
  factionCards(faction, ROSTER[faction]),
);

export const CARD_IDS: readonly CardId[] = DECK.map((card) => card.id);

const CARDS_BY_ID: ReadonlyMap<CardId, Card> = new Map(DECK.map((card) => [card.id, card]));

export const cardById = (id: CardId): Card => {
  const card = CARDS_BY_ID.get(id);
  if (card === undefined) {
    throw new RangeError(`Unknown card: ${id}`);
  }
  return card;
};

export const cardsByIds = (ids: readonly CardId[]): Card[] => ids.map((id) => cardById(id));
