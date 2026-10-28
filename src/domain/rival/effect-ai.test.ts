import { describe, expect, it } from 'vitest';

import type { EffectId } from '@domain/effects/effect';
import { handsOf, matchFixture } from '@domain/match/match-fixture';
import type { MatchState } from '@domain/match/match-state';
import { rivalDiscardIndex, rivalEffectChoice } from '@domain/rival/effect-ai';
import { scriptedRandom } from '@domain/shared/scripted-random';

const storing = (rival: readonly EffectId[], player: readonly EffectId[] = []): MatchState =>
  matchFixture({ effects: { stored: { player, rival }, deck: [], discard: [] } });

describe('rivalEffectChoice', () => {
  it('prefers golpe and uses it on a roll under 0.8', () => {
    expect(rivalEffectChoice(storing(['sanacion', 'golpe']), scriptedRandom(0.79))).toBe('golpe');
    expect(rivalEffectChoice(storing(['sanacion', 'golpe']), scriptedRandom(0.8))).toBeNull();
  });

  it('heals only at 18 life or less', () => {
    const healthy = storing(['sanacion']);
    const random = scriptedRandom(0);
    expect(rivalEffectChoice(healthy, random)).toBeNull();
    expect(random.consumed()).toBe(0);
    const hurt = { ...healthy, lives: { player: 20, rival: 18 } };
    expect(rivalEffectChoice(hurt, scriptedRandom(0))).toBe('sanacion');
  });

  it('curses only while the player still holds cards', () => {
    expect(rivalEffectChoice(storing(['sello', 'maldicion'], ['golpe']), scriptedRandom(0))).toBe(
      'maldicion',
    );
    const empty = { ...storing(['maldicion']), hands: handsOf([], ['ada']) };
    expect(rivalEffectChoice(empty, scriptedRandom(0))).toBeNull();
  });

  it('seals only when the player stores an effect', () => {
    expect(rivalEffectChoice(storing(['sello'], ['golpe']), scriptedRandom(0))).toBe('sello');
    expect(rivalEffectChoice(storing(['sello']), scriptedRandom(0))).toBeNull();
  });

  it('plunders on a 0.6 roll before the 0.8 use roll', () => {
    const random = scriptedRandom(0.59, 0.79);
    expect(rivalEffectChoice(storing(['saqueo']), random)).toBe('saqueo');
    expect(random.consumed()).toBe(2);
    const declined = scriptedRandom(0.6);
    expect(rivalEffectChoice(storing(['saqueo']), declined)).toBeNull();
    expect(declined.consumed()).toBe(1);
  });

  it('never plunders an empty hand', () => {
    const empty = { ...storing(['saqueo']), hands: handsOf(['saul'], []) };
    expect(rivalEffectChoice(empty, scriptedRandom(0))).toBeNull();
  });
});

describe('rivalDiscardIndex', () => {
  it('drops the lowest priority: sello, saqueo, sanacion, maldicion, golpe', () => {
    expect(rivalDiscardIndex(['golpe', 'sello', 'maldicion'])).toBe(1);
    expect(rivalDiscardIndex(['sanacion', 'saqueo', 'golpe'])).toBe(1);
    expect(rivalDiscardIndex(['golpe', 'maldicion', 'sanacion'])).toBe(2);
    expect(rivalDiscardIndex(['golpe', 'golpe', 'maldicion'])).toBe(2);
  });

  it('drops the first copy on ties', () => {
    expect(rivalDiscardIndex(['maldicion', 'sanacion', 'sanacion'])).toBe(1);
    expect(rivalDiscardIndex(['sello', 'golpe', 'sello'])).toBe(0);
  });
});
