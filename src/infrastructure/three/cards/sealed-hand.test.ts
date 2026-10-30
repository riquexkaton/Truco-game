import { describe, expect, it } from 'vitest';

import { isSealedFor, sealedHandCards } from '@infrastructure/three/cards/sealed-hand';

const HAND = ['baltasar', 'gaspar', 'brunilda', 'garin', 'oriana'];

describe('which hand cards show the seal marking', () => {
  it('always marks legendaries, whatever the vira', () => {
    for (const vira of ['carnero', 'cayado', 'velo', 'lirio'] as const) {
      expect(isSealedFor('baltasar', vira)).toBe(true);
      expect(isSealedFor('oriana', vira)).toBe(true);
    }
  });

  it('marks Perico and Perica only while the vira makes them active', () => {
    const hands = { player: HAND, rival: [] };
    expect(sealedHandCards(hands, 'carnero')).toEqual(['baltasar', 'gaspar', 'brunilda', 'oriana']);
    expect(sealedHandCards(hands, 'lirio')).toEqual(['baltasar', 'oriana']);
    expect(isSealedFor('melquiades', 'lirio')).toBe(true);
    expect(isSealedFor('barbara', 'velo')).toBe(false);
  });

  it('never marks plain cards', () => {
    expect(isSealedFor('garin', 'carnero')).toBe(false);
    expect(isSealedFor('tobias', 'cayado')).toBe(false);
  });

  it('leaves the rival’s face-down hand unmarked', () => {
    const hands = { player: ['garin'], rival: ['baltasar', 'gaspar'] };
    expect(sealedHandCards(hands, 'carnero')).toEqual([]);
  });

  it('marks nothing before a vira is on the table', () => {
    expect(sealedHandCards({ player: HAND, rival: [] }, null)).toEqual([]);
  });
});
