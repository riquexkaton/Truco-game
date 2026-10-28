import { describe, expect, it } from 'vitest';

import { placeCard } from '@domain/match/duel-play';
import { canCallPact, canSingRitual } from '@domain/match/gates';
import { matchFixture, played, playedOf } from '@domain/match/match-fixture';
import { singRitual } from '@domain/match/ritual-flow';
import { scriptedRandom } from '@domain/shared/scripted-random';

const ready = matchFixture({
  ritual: { sung: false, available: { player: true, rival: false } },
  effects: { stored: { player: [], rival: [] }, deck: ['saqueo', 'golpe'], discard: [] },
});

describe('singRitual', () => {
  it('deals 3 damage to the opponent and grants an effect', () => {
    const state = singRitual(ready, 'player', scriptedRandom());
    expect(state.lives).toEqual({ player: 20, rival: 17 });
    expect(state.effects.stored.player).toEqual(['golpe']);
    expect(state.ritual).toEqual({ sung: true, available: { player: false, rival: false } });
  });

  it('cancels any further Pacto this round', () => {
    const state = singRitual(ready, 'player', scriptedRandom());
    expect(canCallPact(state, 'player')).toBe(false);
    expect(canCallPact(state, 'rival')).toBe(false);
  });

  it('ends the match without drawing when the damage is lethal', () => {
    const state = singRitual(
      { ...ready, lives: { player: 20, rival: 2 } },
      'player',
      scriptedRandom(),
    );
    expect(state.over).toBe(true);
    expect(state.effects.stored.player).toEqual([]);
  });
});

describe('canSingRitual', () => {
  it('is available before the first card of the round', () => {
    expect(canSingRitual(ready, 'player')).toBe(true);
    expect(canSingRitual(ready, 'rival')).toBe(false);
  });

  it('is lost once the first card is played', () => {
    const state = placeCard(ready, { side: 'player', cardId: 'saul' });
    expect(canSingRitual(state, 'player')).toBe(false);
  });

  it('is never available after the first duel', () => {
    const later = { ...ready, duel: 1, played: playedOf([played('teo')], [played('ada')]) };
    expect(canSingRitual(later, 'player')).toBe(false);
  });
});
