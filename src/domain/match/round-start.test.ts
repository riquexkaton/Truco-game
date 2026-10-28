import { describe, expect, it } from 'vitest';

import { CARD_IDS, cardsByIds } from '@domain/cards/deck';
import { matchFixture, played, playedOf } from '@domain/match/match-fixture';
import { HAND_SIZE, newMatch, startRound } from '@domain/match/round-start';
import { hasRitual } from '@domain/ritual/ritual';
import { scriptedRandom } from '@domain/shared/scripted-random';

describe('newMatch', () => {
  it('starts round 1 with full lives and a fresh 20-card effect deck', () => {
    const state = newMatch(scriptedRandom(0.37));
    expect(state.round).toBe(1);
    expect(state.lives).toEqual({ player: 20, rival: 20 });
    expect(state.effects.deck).toHaveLength(20);
    expect(state.effects.stored).toEqual({ player: [], rival: [] });
    expect(state.over).toBe(false);
  });

  it('deals 3 distinct cards to each side from the 40-card deck', () => {
    const { hands } = newMatch(scriptedRandom(0.61, 0.2, 0.83, 0.05));
    const dealt = [...hands.player, ...hands.rival];
    expect(hands.player).toHaveLength(HAND_SIZE);
    expect(hands.rival).toHaveLength(HAND_SIZE);
    expect(new Set(dealt).size).toBe(6);
    expect(dealt.every((id) => CARD_IDS.includes(id))).toBe(true);
  });

  it('draws the first round lead, the vira and the deal from the random source', () => {
    const state = newMatch(scriptedRandom(0.99));
    expect(state.roundLead).toBe('rival');
    expect(state.lead).toBe('rival');
    expect(state.vira).toBe('lirio');
    expect(state.hands).toEqual({
      player: ['baltasar', 'gaspar', 'brunilda'],
      rival: ['garin', 'ferran', 'morgana'],
    });
  });

  it('gives the first round to the player on a low roll', () => {
    const state = newMatch(scriptedRandom(0));
    expect(state.roundLead).toBe('player');
    expect(state.vira).toBe('carnero');
  });

  it('flags a Ritual for every hand of a single faction', () => {
    const state = newMatch(scriptedRandom(0.99));
    expect(state.ritual).toEqual({ sung: false, available: { player: true, rival: true } });
  });

  it('flags a Ritual exactly when the hand qualifies', () => {
    const state = newMatch(scriptedRandom(0.37, 0.12, 0.9, 0.55));
    expect(state.ritual.available.player).toBe(hasRitual(cardsByIds(state.hands.player)));
    expect(state.ritual.available.rival).toBe(hasRitual(cardsByIds(state.hands.rival)));
  });
});

describe('startRound', () => {
  const finished = matchFixture({
    round: 3,
    roundLead: 'rival',
    lead: 'player',
    lives: { player: 9, rival: 14 },
    played: playedOf([played('baltasar')], [played('oriana', true)]),
    duel: 3,
    results: ['player', 'rival', 'tie'],
    challenge: { level: 2, holder: null },
    stake: 6,
    pact: { done: true, pending: null },
    ritual: { sung: true, available: { player: false, rival: false } },
    effects: { stored: { player: ['golpe'], rival: ['sello', 'saqueo'] }, deck: [], discard: [] },
    curse: { player: true, rival: false },
    seal: { player: false, rival: true },
    usedEffectThisTurn: true,
    roundOver: true,
    roundWinner: 'player',
    retired: true,
  });

  it('alternates the round lead without spending a roll on it', () => {
    const random = scriptedRandom(0.5);
    const next = startRound(finished, random);
    expect(next.roundLead).toBe('player');
    expect(next.lead).toBe('player');
    expect(next.round).toBe(4);
    expect(random.consumed()).toBe(1 + CARD_IDS.length - 1);
  });

  it('resets every per-round field', () => {
    const next = startRound(finished, scriptedRandom(0.5));
    expect(next).toMatchObject({
      played: { player: [], rival: [] },
      duel: 0,
      results: [],
      challenge: { level: 0, holder: null },
      stake: 2,
      pact: { done: false, pending: null },
      curse: { player: false, rival: false },
      seal: { player: false, rival: false },
      usedEffectThisTurn: false,
      roundOver: false,
      roundWinner: null,
      retired: false,
    });
    expect(next.ritual.sung).toBe(false);
  });

  it('keeps lives and stored effects between rounds', () => {
    const next = startRound(finished, scriptedRandom(0.5));
    expect(next.lives).toEqual({ player: 9, rival: 14 });
    expect(next.effects.stored).toEqual({ player: ['golpe'], rival: ['sello', 'saqueo'] });
  });
});
