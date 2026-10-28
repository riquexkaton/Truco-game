import { describe, expect, it } from 'vitest';

import { itemAt, pickIndex, pickOne, randomSide, shuffle, willHappen } from '@domain/shared/random';
import { scriptedRandom } from '@domain/shared/scripted-random';
import { bothSides, SIDES, withSide } from '@domain/shared/side';

describe('scriptedRandom', () => {
  it('replays its values and then sustains the last one', () => {
    const random = scriptedRandom(0.1, 0.7);
    expect([random.next(), random.next(), random.next()]).toEqual([0.1, 0.7, 0.7]);
    expect(random.consumed()).toBe(3);
  });

  it('returns zero when it has no values', () => {
    expect(scriptedRandom().next()).toBe(0);
  });
});

describe('random helpers', () => {
  it('picks an index proportional to the roll', () => {
    expect(pickIndex(scriptedRandom(0), 4)).toBe(0);
    expect(pickIndex(scriptedRandom(0.74), 4)).toBe(2);
    expect(pickIndex(scriptedRandom(0.999), 4)).toBe(3);
  });

  it('picks one item from a list', () => {
    expect(pickOne(scriptedRandom(0.5), ['a', 'b', 'c'])).toBe('b');
  });

  it('refuses to pick from an empty list', () => {
    expect(() => pickOne(scriptedRandom(0.5), [])).toThrow(RangeError);
    expect(() => itemAt(['a'], 3)).toThrow(RangeError);
  });

  it('happens only when the roll is strictly below the probability', () => {
    expect(willHappen(scriptedRandom(0.79), 0.8)).toBe(true);
    expect(willHappen(scriptedRandom(0.8), 0.8)).toBe(false);
  });

  it('draws a side with even odds', () => {
    expect(randomSide(scriptedRandom(0.49))).toBe('player');
    expect(randomSide(scriptedRandom(0.5))).toBe('rival');
  });
});

describe('shuffle', () => {
  it('keeps the order when every roll lands on the current position', () => {
    expect(shuffle(scriptedRandom(0.999), ['a', 'b', 'c', 'd'])).toEqual(['a', 'b', 'c', 'd']);
  });

  it('follows Fisher-Yates from the end of the list', () => {
    expect(shuffle(scriptedRandom(0), ['a', 'b', 'c', 'd'])).toEqual(['b', 'c', 'd', 'a']);
  });

  it('returns a permutation without mutating the input', () => {
    const items = Object.freeze(['a', 'b', 'c', 'd', 'e']);
    const result = shuffle(scriptedRandom(0.3, 0.9, 0.1, 0.6), items);
    expect(result.toSorted((first, second) => first.localeCompare(second))).toEqual([...items]);
    expect(items).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('consumes one roll per position except the first', () => {
    const random = scriptedRandom(0.5);
    shuffle(random, ['a', 'b', 'c', 'd']);
    expect(random.consumed()).toBe(3);
  });
});

describe('per-side records', () => {
  it('lists both sides', () => {
    expect(SIDES).toEqual(['player', 'rival']);
  });

  it('updates one side without touching the original', () => {
    const lives = bothSides(20);
    expect(withSide(lives, 'rival', 5)).toEqual({ player: 20, rival: 5 });
    expect(lives).toEqual({ player: 20, rival: 20 });
  });
});
