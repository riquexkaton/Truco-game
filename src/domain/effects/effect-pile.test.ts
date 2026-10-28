import { describe, expect, it } from 'vitest';

import type { EffectId } from '@domain/effects/effect';
import { EFFECT_IDS, removeFirst } from '@domain/effects/effect';
import { drawFromPile, newEffectDeck } from '@domain/effects/effect-pile';
import { scriptedRandom } from '@domain/shared/scripted-random';

const countOf = (deck: readonly EffectId[], effect: EffectId): number =>
  deck.filter((item) => item === effect).length;

describe('newEffectDeck', () => {
  it('holds 20 cards: golpe 5, sanacion 5, saqueo 3, maldicion 4, sello 3', () => {
    const deck = newEffectDeck(scriptedRandom(0.42));
    expect(deck).toHaveLength(20);
    expect(EFFECT_IDS.map((effect) => countOf(deck, effect))).toEqual([5, 5, 3, 4, 3]);
  });
});

describe('drawFromPile', () => {
  it('draws from the top (end) of the deck', () => {
    const draw = drawFromPile({ deck: ['golpe', 'sello'], discard: ['saqueo'] }, scriptedRandom());
    expect(draw.effect).toBe('sello');
    expect(draw.pile).toEqual({ deck: ['golpe'], discard: ['saqueo'] });
  });

  it('reshuffles the discards into a new deck when it runs out', () => {
    const random = scriptedRandom(0.999);
    const draw = drawFromPile({ deck: [], discard: ['golpe', 'sanacion', 'sello'] }, random);
    expect(draw.effect).toBe('sello');
    expect(draw.pile).toEqual({ deck: ['golpe', 'sanacion'], discard: [] });
    expect(random.consumed()).toBe(2);
  });

  it('draws nothing when the deck and the discards are empty', () => {
    const draw = drawFromPile({ deck: [], discard: [] }, scriptedRandom());
    expect(draw.effect).toBeNull();
  });
});

describe('removeFirst', () => {
  it('removes a single copy and keeps the rest', () => {
    expect(removeFirst(['golpe', 'sello', 'golpe'], 'golpe')).toEqual(['sello', 'golpe']);
    expect(removeFirst(['sello'], 'golpe')).toEqual(['sello']);
  });
});
