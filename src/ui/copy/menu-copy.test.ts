import { describe, expect, it } from 'vitest';

import { DECK } from '@domain/cards/deck';
import { FACTION_IDS } from '@domain/cards/faction';
import { MAX_LIFE } from '@domain/life/life';

import { TITLE_CARDS } from '@ui/copy/menu-copy';

const cardCopy = (id: string) => TITLE_CARDS.find((card) => card.id === id);

describe('menu copy', () => {
  it('deals the four title cards in order', () => {
    expect(TITLE_CARDS.map((card) => card.label)).toEqual(['JUGAR', 'REGLAS', 'MAZO', 'AJUSTES']);
  });

  it('describes a match with the real starting life', () => {
    expect(MAX_LIFE).toBe(20);
    expect(cardCopy('play')?.description).toBe(
      'Enfrenta a la IA: gana dos de tres duelos por ronda y baja al rival de 20 a 0 de vida.',
    );
  });

  it('counts the real deck and its factions', () => {
    expect(DECK).toHaveLength(40);
    expect(FACTION_IDS).toHaveLength(4);
    expect(cardCopy('deck')).toMatchObject({
      chip: '40 cartas',
      description:
        'Las 40 cartas de las cuatro facciones y los efectos que ganas con las cartas con sello.',
    });
  });
});
