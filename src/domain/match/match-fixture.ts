import type { CardId } from '@domain/cards/card';
import { NO_CHALLENGE } from '@domain/challenge/challenge';
import type { MatchState, PlayedCard } from '@domain/match/match-state';
import type { PerSide } from '@domain/shared/side';
import { bothSides } from '@domain/shared/side';

const BASE: MatchState = {
  lives: bothSides(20),
  vira: 'lirio',
  hands: { player: ['baltasar', 'saul', 'irene'], rival: ['oriana', 'ferran', 'ada'] },
  played: bothSides([]),
  duel: 0,
  results: [],
  lead: 'player',
  roundLead: 'player',
  round: 1,
  challenge: NO_CHALLENGE,
  stake: 2,
  pact: { done: false, pending: null },
  ritual: { sung: false, available: bothSides(false) },
  effects: { stored: bothSides([]), deck: [], discard: [] },
  curse: bothSides(false),
  seal: bothSides(false),
  usedEffectThisTurn: false,
  roundOver: false,
  roundWinner: null,
  retired: false,
  over: false,
};

export const matchFixture = (overrides: Partial<MatchState> = {}): MatchState => ({
  ...BASE,
  ...overrides,
});

export const handsOf = (
  player: readonly CardId[],
  rival: readonly CardId[],
): PerSide<readonly CardId[]> => ({ player, rival });

export const playedOf = (
  player: readonly PlayedCard[],
  rival: readonly PlayedCard[],
): PerSide<readonly PlayedCard[]> => ({ player, rival });

export const played = (cardId: CardId, isCursed = false): PlayedCard => ({
  cardId,
  cursed: isCursed,
});
