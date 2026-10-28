import { describe, expect, it } from 'vitest';

import { CARD_IDS, cardById, cardsByIds, DECK } from '@domain/cards/deck';
import { FACTION_IDS, FACTIONS } from '@domain/cards/faction';

const LEGACY_IDS = [
  'baltasar',
  'gaspar',
  'brunilda',
  'garin',
  'ferran',
  'morgana',
  'osric',
  'vidal',
  'rui',
  'teo',
  'oriana',
  'fermin',
  'rosalba',
  'elio',
  'saul',
  'tobias',
  'nilo',
  'bruno',
  'iraia',
  'paula',
  'brigida',
  'anselmo',
  'ursula',
  'isolda',
  'elvira',
  'ines',
  'noemi',
  'ada',
  'irene',
  'lucia',
  'alba',
  'melquiades',
  'barbara',
  'rafael',
  'celia',
  'matias',
  'elena',
  'leonor',
  'claudio',
  'amaia',
];

describe('the game deck', () => {
  it('has the 40 legacy cards in legacy order so card art still matches', () => {
    expect(CARD_IDS).toEqual(LEGACY_IDS);
  });

  it.each(FACTION_IDS)('gives %s ten cards with one legend, one perico and one perica', (id) => {
    const cards = DECK.filter((card) => card.faction === id);
    expect(cards).toHaveLength(10);
    expect(cards.filter((card) => card.legendary)).toHaveLength(1);
    expect(cards.filter((card) => card.wildcard?.kind === 'perico')).toHaveLength(1);
    expect(cards.filter((card) => card.wildcard?.kind === 'perica')).toHaveLength(1);
  });

  it('prints perico as 6 (15 active) and perica as 5 (14 active)', () => {
    expect(cardById('gaspar')).toMatchObject({
      attack: 6,
      wildcard: { kind: 'perico', activeAttack: 15 },
    });
    expect(cardById('brunilda')).toMatchObject({
      attack: 5,
      wildcard: { kind: 'perica', activeAttack: 14 },
    });
  });

  it('makes Baltasar the strongest fixed card', () => {
    expect(cardById('baltasar')).toMatchObject({ attack: 12, legendary: true });
    const fixed = DECK.filter((card) => card.wildcard === null).map((card) => card.attack);
    expect(Math.max(...fixed)).toBe(12);
  });

  it('keeps names with their accents', () => {
    expect(cardById('brigida').name).toBe('SOR BRÍGIDA');
    expect(cardsByIds(['saul', 'lucia']).map((card) => card.name)).toEqual(['SAÚL', 'LUCÍA']);
  });

  it('rejects unknown ids', () => {
    expect(() => cardById('nobody')).toThrow(RangeError);
  });
});

describe('factions', () => {
  it('keeps the legacy colours, labels and glow', () => {
    expect(FACTIONS.carnero).toEqual({
      id: 'carnero',
      name: 'CARNERO',
      shortName: 'EL CARNERO',
      color: '#2C4E7A',
      glow: 0x6f_9a_d6,
    });
    expect(FACTION_IDS.map((id) => FACTIONS[id].color)).toEqual([
      '#2C4E7A',
      '#4E6B2E',
      '#8E2A2A',
      '#A8701A',
    ]);
  });
});
