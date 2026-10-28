import { describe, expect, it } from 'vitest';

import type { CardId } from '@domain/cards/card';
import type { DuelResult } from '@domain/duel/duel';
import { handsOf, matchFixture, played, playedOf } from '@domain/match/match-fixture';
import { plunderGive, rivalCardPick, timeoutCard } from '@domain/rival/card-pick';

const answering = (rival: readonly CardId[], playerCard: CardId) =>
  matchFixture({ hands: handsOf([], rival), played: playedOf([played(playerCard)], []) });

const leading = (rival: readonly CardId[], results: readonly DuelResult[]) =>
  matchFixture({ hands: handsOf([], rival), results });

describe('rivalCardPick when answering', () => {
  it('plays the weakest card that still wins', () => {
    expect(rivalCardPick(answering(['baltasar', 'ferran', 'oriana'], 'saul'))).toBe('oriana');
  });

  it('throws away the weakest card when nothing wins', () => {
    expect(rivalCardPick(answering(['ferran', 'ada', 'oriana'], 'baltasar'))).toBe('ada');
  });

  it('accounts for its own curse', () => {
    const state = answering(['teo', 'garin', 'baltasar'], 'morgana');
    expect(rivalCardPick(state)).toBe('garin');
    expect(rivalCardPick({ ...state, curse: { player: false, rival: true } })).toBe('baltasar');
  });
});

describe('rivalCardPick when leading', () => {
  const hand = ['oriana', 'ada', 'ferran'];

  it('saves strength with the lowest card when ahead', () => {
    expect(rivalCardPick(leading(hand, ['rival']))).toBe('ada');
  });

  it('goes all in with the highest card when behind', () => {
    expect(rivalCardPick(leading(hand, ['player', 'tie']))).toBe('oriana');
  });

  it('plays the middle card when even', () => {
    expect(rivalCardPick(leading(hand, []))).toBe('ferran');
    expect(rivalCardPick(leading(['oriana', 'ada'], ['tie']))).toBe('ada');
  });

  it('needs a card to play', () => {
    expect(() => rivalCardPick(leading([], []))).toThrow(RangeError);
  });
});

describe('timeoutCard', () => {
  it('plays the lowest effective attack, keeping hand order on ties', () => {
    expect(timeoutCard(matchFixture(), 'player')).toBe('irene');
    const tied = matchFixture({ hands: handsOf(['ada', 'rui'], []) });
    expect(timeoutCard(tied, 'player')).toBe('rui');
    expect(timeoutCard({ ...tied, curse: { player: true, rival: false } }, 'player')).toBe('ada');
  });
});

describe('plunderGive', () => {
  it('gives away the lowest attack, counting an active perico at 15', () => {
    const state = matchFixture({ vira: 'carnero', hands: handsOf([], ['gaspar', 'ferran']) });
    expect(plunderGive(state, 'rival')).toBe('ferran');
    expect(plunderGive({ ...state, vira: 'velo' }, 'rival')).toBe('gaspar');
  });
});
