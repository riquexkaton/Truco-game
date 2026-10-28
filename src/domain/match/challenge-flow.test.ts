import { describe, expect, it } from 'vitest';

import {
  acceptChallenge,
  counterChallenge,
  declineChallenge,
  fold,
  retire,
} from '@domain/match/challenge-flow';
import { canFold, canRaiseChallenge } from '@domain/match/gates';
import { matchFixture, played, playedOf } from '@domain/match/match-fixture';

describe('Desafío', () => {
  it('makes the round worth 4 and hands the word to whoever accepts', () => {
    const state = acceptChallenge(matchFixture(), 'rival');
    expect(state.challenge).toEqual({ level: 1, holder: 'rival' });
    expect(state.stake).toBe(4);
    expect(canRaiseChallenge(state, 'rival')).toBe(true);
    expect(canRaiseChallenge(state, 'player')).toBe(false);
  });

  it('costs 1 life and the round to whoever declines it', () => {
    const state = declineChallenge(matchFixture(), 'rival');
    expect(state.lives).toEqual({ player: 20, rival: 19 });
    expect(state).toMatchObject({ roundOver: true, retired: true, roundWinner: 'player' });
  });
});

describe('Contra', () => {
  const desafio = acceptChallenge(matchFixture(), 'player');

  it('lets the holder raise to 6 and then nobody can raise', () => {
    const state = acceptChallenge(desafio, 'rival');
    expect(state.challenge).toEqual({ level: 2, holder: null });
    expect(state.stake).toBe(6);
    expect(canRaiseChallenge(state, 'player')).toBe(false);
    expect(canRaiseChallenge(state, 'rival')).toBe(false);
  });

  it('costs 4 life to whoever declines it', () => {
    const state = declineChallenge(desafio, 'rival');
    expect(state.lives.rival).toBe(16);
    expect(state.roundWinner).toBe('player');
  });

  it('can answer a Desafío immediately, leaving the caller to accept or retire', () => {
    const countered = counterChallenge(matchFixture());
    expect(countered.challenge).toEqual({ level: 1, holder: null });
    expect(countered.stake).toBe(4);
    expect(acceptChallenge(countered, 'player')).toMatchObject({
      challenge: { level: 2, holder: null },
      stake: 6,
    });
    expect(declineChallenge(countered, 'player').lives.player).toBe(16);
  });
});

describe('retiring', () => {
  it('folds for 1 whatever the round was worth', () => {
    const state = fold(matchFixture({ stake: 6, challenge: { level: 2, holder: null } }), 'player');
    expect(state.lives.player).toBe(19);
    expect(state).toMatchObject({ roundOver: true, retired: true, roundWinner: 'rival' });
  });

  it('ends the match when the damage is lethal', () => {
    const state = retire(matchFixture({ lives: { player: 3, rival: 20 } }), {
      side: 'player',
      damage: 4,
    });
    expect(state.lives.player).toBe(0);
    expect(state.over).toBe(true);
  });

  it('is only possible on the side’s own turn before placing a card', () => {
    const placed = matchFixture({ played: playedOf([played('teo')], []) });
    expect(canFold(matchFixture(), 'player')).toBe(true);
    expect(canFold(placed, 'player')).toBe(false);
    expect(canFold(matchFixture({ over: true }), 'rival')).toBe(false);
  });

  it('blocks raising once the round is over', () => {
    expect(canRaiseChallenge(matchFixture({ roundOver: true }), 'player')).toBe(false);
  });
});
