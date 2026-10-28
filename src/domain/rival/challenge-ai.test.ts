import { describe, expect, it } from 'vitest';

import type { CardId } from '@domain/cards/card';
import type { Challenge } from '@domain/challenge/challenge';
import { NO_CHALLENGE } from '@domain/challenge/challenge';
import { handsOf, matchFixture } from '@domain/match/match-fixture';
import type { MatchState } from '@domain/match/match-state';
import { rivalChallengeAnswer, shouldRivalRaise } from '@domain/rival/challenge-ai';
import { rivalScore } from '@domain/rival/score';
import { scriptedRandom } from '@domain/shared/scripted-random';

const withHand = (rival: readonly CardId[], challenge: Challenge = NO_CHALLENGE): MatchState =>
  matchFixture({ hands: handsOf([], rival), challenge });

const strong = withHand(['baltasar', 'oriana', 'brigida']);
const medium = withHand(['garin', 'ferran', 'teo']);
const edge = withHand(['baltasar', 'garin', 'teo']);
const weak = withHand(['teo', 'paula', 'lucia']);

describe('test hands', () => {
  it('sit on the expected sides of every threshold', () => {
    expect(rivalScore(strong)).toBeGreaterThanOrEqual(11);
    expect(rivalScore(edge)).toBeGreaterThanOrEqual(10);
    expect(rivalScore(edge)).toBeLessThan(10.5);
    expect(rivalScore(medium)).toBeGreaterThanOrEqual(7.5);
    expect(rivalScore(medium)).toBeLessThan(8.5);
    expect(rivalScore(weak)).toBeLessThan(7.5);
  });
});

describe('rivalChallengeAnswer to a Desafío', () => {
  it('counters with a score of 11 or more on a roll below 0.55', () => {
    expect(rivalChallengeAnswer(strong, 1, scriptedRandom(0.54))).toBe('counter');
  });

  it('accepts a strong hand when the counter roll fails, without rolling again', () => {
    const random = scriptedRandom(0.55);
    expect(rivalChallengeAnswer(strong, 1, random)).toBe('accept');
    expect(random.consumed()).toBe(1);
  });

  it('accepts from 7.5 without rolling', () => {
    const random = scriptedRandom(0.99);
    expect(rivalChallengeAnswer(medium, 1, random)).toBe('accept');
    expect(random.consumed()).toBe(0);
  });

  it('bluffs an accept below 7.5 on a roll under 0.2 and retires otherwise', () => {
    expect(rivalChallengeAnswer(weak, 1, scriptedRandom(0.19))).toBe('accept');
    expect(rivalChallengeAnswer(weak, 1, scriptedRandom(0.2))).toBe('retire');
  });
});

describe('rivalChallengeAnswer to a Contra', () => {
  it('accepts from 8.5 without rolling', () => {
    const random = scriptedRandom(0.99);
    expect(rivalChallengeAnswer(strong, 2, random)).toBe('accept');
    expect(random.consumed()).toBe(0);
  });

  it('accepts below 8.5 only on a roll under 0.15', () => {
    expect(rivalChallengeAnswer(medium, 2, scriptedRandom(0.14))).toBe('accept');
    expect(rivalChallengeAnswer(medium, 2, scriptedRandom(0.15))).toBe('retire');
  });
});

describe('shouldRivalRaise to a Desafío', () => {
  it('raises from 10 on a roll under 0.6', () => {
    expect(shouldRivalRaise(edge, scriptedRandom(0.59))).toBe(true);
  });

  it('falls back to a 0.08 bluff', () => {
    expect(shouldRivalRaise(edge, scriptedRandom(0.6, 0.07))).toBe(true);
    expect(shouldRivalRaise(edge, scriptedRandom(0.6, 0.08))).toBe(false);
  });

  it('only bluffs below 10', () => {
    const random = scriptedRandom(0.07);
    expect(shouldRivalRaise(medium, random)).toBe(true);
    expect(random.consumed()).toBe(1);
  });
});

describe('shouldRivalRaise to a Contra', () => {
  const holding = { level: 1, holder: 'rival' } as const;

  it('raises from 10.5 on a roll under 0.6', () => {
    expect(
      shouldRivalRaise(withHand(['baltasar', 'oriana', 'brigida'], holding), scriptedRandom(0.59)),
    ).toBe(true);
  });

  it('bluffs below 10.5 only on a roll under 0.05', () => {
    const edgeHolding = withHand(['baltasar', 'garin', 'teo'], holding);
    expect(shouldRivalRaise(edgeHolding, scriptedRandom(0.04))).toBe(true);
    expect(shouldRivalRaise(edgeHolding, scriptedRandom(0.05))).toBe(false);
  });

  it('never rolls when it does not hold the word', () => {
    const random = scriptedRandom(0);
    const notHolding = withHand(['baltasar'], { level: 1, holder: 'player' });
    expect(shouldRivalRaise(notHolding, random)).toBe(false);
    expect(random.consumed()).toBe(0);
  });
});
