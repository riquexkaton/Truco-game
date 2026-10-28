import { describe, expect, it } from 'vitest';

import type { CardId } from '@domain/cards/card';
import { handsOf, matchFixture } from '@domain/match/match-fixture';
import type { MatchState } from '@domain/match/match-state';
import { openPact } from '@domain/match/pact-flow';
import { PACT_BET, REPACT_BET, wager } from '@domain/pact/bet';
import {
  rivalOpeningBet,
  shouldRivalCallPact,
  shouldRivalSingRitual,
} from '@domain/rival/pact-call-ai';
import { scriptedRandom } from '@domain/shared/scripted-random';

const rivalHolding = (rival: readonly CardId[], playerLife = 20): MatchState =>
  matchFixture({ hands: handsOf([], rival), lives: { player: playerLife, rival: 20 } });

describe('shouldRivalSingRitual', () => {
  const ready = matchFixture({
    ritual: { sung: false, available: { player: false, rival: true } },
  });

  it('sings an available Ritual on a roll under 0.85', () => {
    expect(shouldRivalSingRitual(ready, scriptedRandom(0.84))).toBe(true);
    expect(shouldRivalSingRitual(ready, scriptedRandom(0.85))).toBe(false);
  });

  it('never rolls without a Ritual', () => {
    const random = scriptedRandom(0);
    expect(shouldRivalSingRitual(matchFixture(), random)).toBe(false);
    expect(random.consumed()).toBe(0);
  });
});

describe('shouldRivalCallPact', () => {
  it('calls 80% of the time with a pact of 26 or more', () => {
    const strong = rivalHolding(['osric', 'teo', 'alba']);
    expect(shouldRivalCallPact(strong, scriptedRandom(0.79))).toBe(true);
    expect(shouldRivalCallPact(strong, scriptedRandom(0.8))).toBe(false);
  });

  it('bluffs 8% of the time below 26', () => {
    const weak = rivalHolding(['rui', 'vidal', 'alba']);
    expect(shouldRivalCallPact(weak, scriptedRandom(0.07))).toBe(true);
    expect(shouldRivalCallPact(weak, scriptedRandom(0.08))).toBe(false);
  });

  it('never rolls once a pact was called this round', () => {
    const random = scriptedRandom(0);
    const called = openPact(matchFixture());
    expect(shouldRivalCallPact(called, random)).toBe(false);
    expect(random.consumed()).toBe(0);
  });
});

describe('rivalOpeningBet', () => {
  it('wagers 4 + round((value - 29) * 1.5) from 31 on a roll under 0.5', () => {
    expect(
      rivalOpeningBet(rivalHolding(['ferran', 'vidal', 'alba']), scriptedRandom(0.49)),
    ).toEqual(wager(7));
    expect(rivalOpeningBet(rivalHolding(['morgana', 'osric', 'alba']), scriptedRandom(0))).toEqual(
      wager(9),
    );
    expect(rivalOpeningBet(rivalHolding(['ferran', 'osric', 'alba']), scriptedRandom(0))).toEqual(
      wager(10),
    );
  });

  it('goes all in from 34', () => {
    expect(
      rivalOpeningBet(rivalHolding(['ferran', 'gaspar', 'alba'], 13), scriptedRandom(0)),
    ).toEqual(wager(13));
    expect(
      rivalOpeningBet(rivalHolding(['isolda', 'elvira', 'alba'], 6), scriptedRandom(0)),
    ).toEqual(wager(6));
  });

  it('caps the wager at the player life', () => {
    expect(
      rivalOpeningBet(rivalHolding(['ferran', 'vidal', 'alba'], 5), scriptedRandom(0)),
    ).toEqual(wager(5));
  });

  it('calls Re-pacto from 28 when it does not wager', () => {
    expect(rivalOpeningBet(rivalHolding(['ferran', 'vidal', 'alba']), scriptedRandom(0.5))).toBe(
      REPACT_BET,
    );
    const random = scriptedRandom(0);
    expect(rivalOpeningBet(rivalHolding(['osric', 'vidal', 'alba']), random)).toBe(REPACT_BET);
    expect(random.consumed()).toBe(0);
  });

  it('calls a plain Pacto below 28', () => {
    expect(rivalOpeningBet(rivalHolding(['osric', 'teo', 'alba']), scriptedRandom(0))).toBe(
      PACT_BET,
    );
  });
});
