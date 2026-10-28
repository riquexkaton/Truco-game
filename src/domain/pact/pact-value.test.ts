import { describe, expect, it } from 'vitest';

import { cardById, cardsByIds } from '@domain/cards/deck';
import { pactPoints, pactValue, pactWinner } from '@domain/pact/pact-value';

const valueOf = (...ids: string[]): number => pactValue(cardsByIds(ids));

describe('pactValue (rules examples)', () => {
  it('values Baltasar + Oriana + Sor Irene at 2', () => {
    expect(valueOf('baltasar', 'oriana', 'irene')).toBe(2);
  });

  it('values the figure pair Baltasar + Garín at 20', () => {
    expect(valueOf('baltasar', 'garin')).toBe(20);
  });

  it('values a 5 and a 3 of the same faction at 28', () => {
    expect(valueOf('osric', 'vidal', 'alba')).toBe(28);
  });

  it('reaches the maximum of 37 with a 9 and an 8 of the same faction', () => {
    expect(valueOf('isolda', 'elvira', 'lucia')).toBe(37);
  });

  it('counts the perico as 6 and the perica as 5 regardless of the vira', () => {
    expect(valueOf('gaspar', 'vidal')).toBe(29);
    expect(valueOf('brunilda', 'vidal')).toBe(28);
  });
});

describe('pactValue (counting)', () => {
  it('takes the two best cards when all three share a faction', () => {
    expect(valueOf('ferran', 'morgana', 'teo')).toBe(35);
  });

  it('takes the best single card without a pair', () => {
    expect(valueOf('saul', 'elvira', 'amaia')).toBe(9);
  });

  it('prefers the best pair over any single card', () => {
    expect(valueOf('rui', 'teo', 'saul')).toBe(23);
  });

  it('counts figures as zero', () => {
    expect(pactPoints(cardById('rafael'))).toBe(0);
    expect(pactPoints(cardById('celia'))).toBe(9);
    expect(valueOf('rafael', 'alba', 'elio')).toBe(20);
  });

  it('is zero for an empty hand', () => {
    expect(pactValue([])).toBe(0);
  });
});

describe('pactWinner', () => {
  it('gives the pact to the higher value', () => {
    expect(pactWinner({ playerValue: 28, rivalValue: 7, roundLead: 'rival' })).toBe('player');
    expect(pactWinner({ playerValue: 3, rivalValue: 21, roundLead: 'player' })).toBe('rival');
  });

  it('breaks ties in favour of whoever started the round', () => {
    expect(pactWinner({ playerValue: 25, rivalValue: 25, roundLead: 'rival' })).toBe('rival');
    expect(pactWinner({ playerValue: 25, rivalValue: 25, roundLead: 'player' })).toBe('player');
  });
});
