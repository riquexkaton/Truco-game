import { describe, expect, it } from 'vitest';

import {
  advanceMark,
  duelLooks,
  shownAttack,
  traitAt,
} from '@infrastructure/three/cards/duel-look';

describe('the duel lighting on the table', () => {
  it('lights the winner warm and bright, a little more saturated, with a pool on the table', () => {
    expect(duelLooks('player')).toEqual({ player: 'won', rival: 'lost' });
    expect(duelLooks('rival')).toEqual({ player: 'lost', rival: 'won' });
    expect(traitAt('won', 'shade', 1)).toBeCloseTo(1.3);
    expect(traitAt('won', 'grey', 1)).toBeLessThan(0);
    expect(traitAt('won', 'sepia', 1)).toBeCloseTo(0.12);
    expect(traitAt('won', 'glow', 1)).toBeGreaterThan(0);
    expect(traitAt('won', 'pool', 1)).toBeGreaterThan(0);
  });

  it('leaves the loser dark and almost grey, with no warmth', () => {
    expect(traitAt('lost', 'shade', 1)).toBeCloseTo(0.34);
    expect(traitAt('lost', 'grey', 1)).toBeCloseTo(0.8);
    expect(traitAt('lost', 'sepia', 1)).toBe(0);
    expect(traitAt('lost', 'glow', 1)).toBe(0);
    expect(traitAt('lost', 'pool', 1)).toBe(0);
  });

  it('treats a tie as its own state: both cards dimmed the same, neither lit', () => {
    expect(duelLooks('tie')).toEqual({ player: 'even', rival: 'even' });
    expect(traitAt('even', 'shade', 1)).toBeCloseTo(0.7);
    expect(traitAt('even', 'glow', 1)).toBe(0);
    expect(traitAt('even', 'pool', 1)).toBe(0);
    expect(traitAt('even', 'shade', 1)).toBeGreaterThan(traitAt('lost', 'shade', 1));
  });

  it('starts unlit and settles within 400 ms', () => {
    expect(traitAt('lost', 'shade', 0)).toBe(1);
    expect(traitAt('won', 'glow', 0)).toBe(0);
    expect(advanceMark(0, 0.2, false)).toBeCloseTo(0.5);
    expect(advanceMark(0.9, 0.2, false)).toBe(1);
  });

  it('lights at once under reduced motion', () => {
    expect(advanceMark(0, 0.016, true)).toBe(1);
  });

  it('shows the attack used only when it differs from the printed one', () => {
    expect(shownAttack(12, 8)).toBe(8);
    expect(shownAttack(12, 12)).toBeNull();
  });
});
