import { describe, expect, it } from 'vitest';

import { attackOf, effectiveAttack, hasSeal, isWildcardActive } from '@domain/cards/attack';
import { cardById } from '@domain/cards/deck';

describe('attackOf', () => {
  it('activates the perico and perica only with the vira of their faction', () => {
    expect(attackOf(cardById('gaspar'), 'carnero')).toBe(15);
    expect(attackOf(cardById('gaspar'), 'velo')).toBe(6);
    expect(attackOf(cardById('ursula'), 'velo')).toBe(14);
    expect(attackOf(cardById('ursula'), 'lirio')).toBe(5);
  });

  it('keeps the printed attack for every other card', () => {
    expect(attackOf(cardById('baltasar'), 'carnero')).toBe(12);
    expect(attackOf(cardById('teo'), 'carnero')).toBe(1);
  });

  it('reports whether a wildcard is active', () => {
    expect(isWildcardActive(cardById('fermin'), 'cayado')).toBe(true);
    expect(isWildcardActive(cardById('fermin'), 'velo')).toBe(false);
    expect(isWildcardActive(cardById('elio'), 'cayado')).toBe(false);
  });
});

describe('effectiveAttack', () => {
  it('subtracts 4 from a cursed card', () => {
    expect(effectiveAttack(cardById('garin'), 'lirio', true)).toBe(6);
    expect(effectiveAttack(cardById('garin'), 'lirio', false)).toBe(10);
  });

  it('never goes below zero', () => {
    expect(effectiveAttack(cardById('rui'), 'lirio', true)).toBe(0);
  });

  it('curses the active value of a wildcard', () => {
    expect(effectiveAttack(cardById('melquiades'), 'lirio', true)).toBe(11);
  });
});

describe('hasSeal', () => {
  it('marks legends whatever the vira', () => {
    expect(hasSeal(cardById('alba'), 'carnero')).toBe(true);
  });

  it('marks active wildcards only', () => {
    expect(hasSeal(cardById('barbara'), 'lirio')).toBe(true);
    expect(hasSeal(cardById('barbara'), 'velo')).toBe(false);
  });

  it('ignores high normal cards', () => {
    expect(hasSeal(cardById('rafael'), 'lirio')).toBe(false);
  });
});
