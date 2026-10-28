import { describe, expect, it } from 'vitest';

import type { CardId } from '@domain/cards/card';
import { placeCard, resolveDuel, startTurn } from '@domain/match/duel-play';
import { handsOf, matchFixture, played, playedOf } from '@domain/match/match-fixture';
import type { MatchState } from '@domain/match/match-state';
import { slotOf } from '@domain/match/queries';
import { scriptedRandom } from '@domain/shared/scripted-random';

const duelOf = (state: MatchState, player: CardId, rival: CardId): MatchState =>
  placeCard(placeCard(state, { side: 'player', cardId: player }), { side: 'rival', cardId: rival });

const withEffectDeck = matchFixture({
  effects: { stored: { player: [], rival: [] }, deck: ['golpe', 'sello'], discard: [] },
});

describe('placeCard', () => {
  it('moves the card from the hand to the duel slot', () => {
    const state = placeCard(matchFixture(), { side: 'player', cardId: 'saul' });
    expect(state.hands.player).toEqual(['baltasar', 'irene']);
    expect(slotOf(state, 'player')).toEqual(played('saul'));
    expect(slotOf(state, 'rival')).toBeNull();
  });

  it('consumes a pending curse into the placed card', () => {
    const cursed = matchFixture({ curse: { player: true, rival: false } });
    const state = placeCard(cursed, { side: 'player', cardId: 'saul' });
    expect(slotOf(state, 'player')).toEqual(played('saul', true));
    expect(state.curse.player).toBe(false);
  });

  it('loses an unsung Ritual when the first card is played', () => {
    const ready = matchFixture({
      ritual: { sung: false, available: { player: true, rival: true } },
    });
    const state = placeCard(ready, { side: 'player', cardId: 'saul' });
    expect(state.ritual.available).toEqual({ player: false, rival: true });
  });

  it('does not touch the Ritual after the first duel', () => {
    const later = matchFixture({
      duel: 1,
      played: playedOf([played('teo')], [played('paula')]),
      ritual: { sung: false, available: { player: true, rival: false } },
    });
    const state = placeCard(later, { side: 'player', cardId: 'saul' });
    expect(state.ritual.available.player).toBe(true);
  });

  it('rejects cards outside the hand, a second card and plays after the round', () => {
    const placedOnce = placeCard(matchFixture(), { side: 'player', cardId: 'saul' });
    expect(() => placeCard(matchFixture(), { side: 'player', cardId: 'oriana' })).toThrow();
    expect(() => placeCard(placedOnce, { side: 'player', cardId: 'irene' })).toThrow();
    const over = matchFixture({ roundOver: true });
    expect(() => placeCard(over, { side: 'rival', cardId: 'ada' })).toThrow();
  });
});

describe('resolveDuel', () => {
  it('gives the duel and the lead to the higher attack', () => {
    const start = duelOf(matchFixture({ lead: 'rival' }), 'saul', 'ada');
    const { state, result, effectEarner } = resolveDuel(start, scriptedRandom());
    expect(result).toBe('player');
    expect(effectEarner).toBeNull();
    expect(state).toMatchObject({ results: ['player'], duel: 1, lead: 'player', roundOver: false });
    expect(slotOf(state, 'player')).toBeNull();
  });

  it('awards an effect when the winning card has a seal', () => {
    const { state, effectEarner } = resolveDuel(
      duelOf(withEffectDeck, 'baltasar', 'ferran'),
      scriptedRandom(),
    );
    expect(effectEarner).toBe('player');
    expect(state.effects.stored.player).toEqual(['sello']);
    expect(state.effects.deck).toEqual(['golpe']);
  });

  it('still awards the effect to a cursed active perico that wins', () => {
    const start = matchFixture({
      ...withEffectDeck,
      vira: 'carnero',
      hands: handsOf(['gaspar', 'teo'], ['ferran', 'ada']),
      curse: { player: true, rival: false },
    });
    const { result, effectEarner } = resolveDuel(
      duelOf(start, 'gaspar', 'ferran'),
      scriptedRandom(),
    );
    expect(result).toBe('player');
    expect(effectEarner).toBe('player');
  });

  it('lets a curse turn a duel around', () => {
    const start = matchFixture({
      hands: handsOf(['garin'], ['ferran']),
      curse: { player: true, rival: false },
    });
    expect(resolveDuel(duelOf(start, 'garin', 'ferran'), scriptedRandom()).result).toBe('rival');
  });

  it('keeps the lead after a tie and grants nothing', () => {
    const start = matchFixture({ lead: 'rival', hands: handsOf(['saul'], ['celia']) });
    const { state, result, effectEarner } = resolveDuel(
      duelOf(start, 'saul', 'celia'),
      scriptedRandom(),
    );
    expect(result).toBe('tie');
    expect(effectEarner).toBeNull();
    expect(state.lead).toBe('rival');
  });

  it('ends the round on the second win', () => {
    const second = matchFixture({
      duel: 1,
      results: ['player'],
      played: playedOf([played('teo')], [played('paula')]),
    });
    const { state } = resolveDuel(duelOf(second, 'saul', 'ada'), scriptedRandom());
    expect(state).toMatchObject({ roundOver: true, roundWinner: 'player' });
  });

  it('ends a 1-1 round with a tie in the first duel without a winner', () => {
    const third = matchFixture({
      duel: 2,
      results: ['tie', 'player'],
      played: playedOf([played('teo'), played('rui')], [played('paula'), played('lucia')]),
    });
    const { state } = resolveDuel(duelOf(third, 'irene', 'oriana'), scriptedRandom());
    expect(state).toMatchObject({ roundOver: true, roundWinner: null, duel: 3 });
  });

  it('refuses to resolve before both cards are down', () => {
    const half = placeCard(matchFixture(), { side: 'player', cardId: 'saul' });
    expect(() => resolveDuel(half, scriptedRandom())).toThrow();
  });
});

describe('startTurn', () => {
  it('allows a new effect this turn', () => {
    expect(startTurn(matchFixture({ usedEffectThisTurn: true })).usedEffectThisTurn).toBe(false);
  });
});
