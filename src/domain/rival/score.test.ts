import { describe, expect, it } from 'vitest';

import { handsOf, matchFixture, played, playedOf } from '@domain/match/match-fixture';
import { rivalScore } from '@domain/rival/score';

describe('rivalScore', () => {
  it('weighs the best card at 0.55 and the average at 0.45', () => {
    const state = matchFixture({ hands: handsOf([], ['baltasar', 'garin', 'teo']) });
    expect(rivalScore(state)).toBeCloseTo(12 * 0.55 + (23 / 3) * 0.45);
  });

  it('adds 3 per duel of advantage', () => {
    const ahead = matchFixture({
      hands: handsOf([], ['teo', 'paula', 'lucia']),
      results: ['rival', 'tie'],
    });
    const behind = { ...ahead, results: ['player' as const] };
    expect(rivalScore(ahead)).toBeCloseTo(4);
    expect(rivalScore(behind)).toBeCloseTo(-2);
  });

  it('uses the effective attack of a cursed hand', () => {
    const state = matchFixture({
      hands: handsOf([], ['garin', 'ferran', 'teo']),
      curse: { player: false, rival: true },
    });
    expect(rivalScore(state)).toBeCloseTo(6 * 0.55 + (10 / 3) * 0.45);
  });

  it('adds 2 when it can beat the card the player already played', () => {
    const state = matchFixture({
      hands: handsOf([], ['baltasar', 'teo']),
      played: playedOf([played('saul')], []),
    });
    expect(rivalScore(state)).toBeCloseTo(12 * 0.55 + 6.5 * 0.45 + 2);
  });

  it('subtracts 3 when nothing in hand beats the card already played', () => {
    const state = matchFixture({
      hands: handsOf([], ['teo', 'paula']),
      played: playedOf([played('saul')], []),
    });
    expect(rivalScore(state)).toBeCloseTo(1 - 3);
  });

  it('counts its own card already in the slot', () => {
    const state = matchFixture({
      hands: handsOf([], ['teo', 'paula']),
      played: playedOf([played('saul')], [played('baltasar')]),
    });
    expect(rivalScore(state)).toBeCloseTo(12 * 0.55 + (14 / 3) * 0.45);
  });

  it('scores an empty hand as zero', () => {
    const empty = matchFixture({ hands: handsOf([], []) });
    expect(rivalScore(empty)).toBe(0);
  });
});
