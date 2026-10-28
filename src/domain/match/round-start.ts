import type { CardId } from '@domain/cards/card';
import { CARD_IDS, cardsByIds } from '@domain/cards/deck';
import type { FactionId } from '@domain/cards/faction';
import { FACTION_IDS } from '@domain/cards/faction';
import { NO_CHALLENGE, STAKES } from '@domain/challenge/challenge';
import { newEffectDeck } from '@domain/effects/effect-pile';
import { fullLives } from '@domain/life/life';
import type { MatchState } from '@domain/match/match-state';
import { hasRitual } from '@domain/ritual/ritual';
import type { Random } from '@domain/shared/random';
import { pickOne, randomSide, shuffle } from '@domain/shared/random';
import type { PerSide } from '@domain/shared/side';
import { bothSides, opponent } from '@domain/shared/side';

export const HAND_SIZE = 3;

type RoundFields = Omit<
  MatchState,
  'lives' | 'effects' | 'over' | 'round' | 'roundLead' | 'lead' | 'vira' | 'hands'
>;

const freshRound = (hands: PerSide<readonly CardId[]>): RoundFields => ({
  played: bothSides([]),
  duel: 0,
  results: [],
  challenge: NO_CHALLENGE,
  stake: STAKES[0],
  pact: { done: false, pending: null },
  ritual: {
    sung: false,
    available: {
      player: hasRitual(cardsByIds(hands.player)),
      rival: hasRitual(cardsByIds(hands.rival)),
    },
  },
  curse: bothSides(false),
  seal: bothSides(false),
  usedEffectThisTurn: false,
  roundOver: false,
  roundWinner: null,
  retired: false,
});

const dealHands = (random: Random): PerSide<readonly CardId[]> => {
  const deck = shuffle(random, CARD_IDS);
  return { player: deck.slice(0, HAND_SIZE), rival: deck.slice(HAND_SIZE, HAND_SIZE * 2) };
};

export const startRound = (state: MatchState, random: Random): MatchState => {
  const roundLead = state.round === 0 ? randomSide(random) : opponent(state.roundLead);
  const vira: FactionId = pickOne(random, FACTION_IDS);
  const hands = dealHands(random);
  return {
    ...state,
    ...freshRound(hands),
    hands,
    vira,
    roundLead,
    lead: roundLead,
    round: state.round + 1,
  };
};

export const newMatch = (random: Random): MatchState => {
  const hands = bothSides<readonly CardId[]>([]);
  const idle: MatchState = {
    ...freshRound(hands),
    lives: fullLives(),
    effects: { stored: bothSides([]), deck: newEffectDeck(random), discard: [] },
    hands,
    vira: 'carnero',
    roundLead: 'player',
    lead: 'player',
    round: 0,
    over: false,
  };
  return startRound(idle, random);
};
