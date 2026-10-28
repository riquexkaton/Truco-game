import { describe, expect, it } from 'vitest';

import type { Side } from '@domain/shared/side';
import { opponent } from '@domain/shared/side';

const pairs: readonly (readonly [Side, Side])[] = [
  ['player', 'rival'],
  ['rival', 'player'],
];

describe('opponent', () => {
  it.each(pairs)('returns the other side for %s', (side, expected) => {
    expect(opponent(side)).toBe(expected);
  });

  it('is its own inverse', () => {
    expect(opponent(opponent('player'))).toBe('player');
  });
});
