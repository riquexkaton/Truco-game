import { winsOf } from '@domain/duel/duel';
import type { MatchState } from '@domain/match/match-state';
import { handAttack, handCards, playedAttack, slotOf } from '@domain/match/queries';

const BEST_WEIGHT = 0.55;
const AVERAGE_WEIGHT = 0.45;
const DUEL_LEAD_WEIGHT = 3;
const BEATABLE_BONUS = 2;
const UNBEATABLE_PENALTY = -3;

const rivalAttacks = (state: MatchState): number[] => {
  const inHand = handCards(state, 'rival').map((card) => handAttack(state, 'rival', card));
  const slot = slotOf(state, 'rival');
  return slot === null ? inHand : [...inHand, playedAttack(state, slot)];
};

const handStrength = (attacks: readonly number[]): number => {
  if (attacks.length === 0) return 0;
  const total = attacks.reduce((sum, attack) => sum + attack, 0);
  return Math.max(...attacks) * BEST_WEIGHT + (total / attacks.length) * AVERAGE_WEIGHT;
};

const answerAdjustment = (state: MatchState): number => {
  const playerSlot = slotOf(state, 'player');
  if (playerSlot === null || slotOf(state, 'rival') !== null) return 0;
  const toBeat = playedAttack(state, playerSlot);
  const canBeat = handCards(state, 'rival').some(
    (card) => handAttack(state, 'rival', card) > toBeat,
  );
  return canBeat ? BEATABLE_BONUS : UNBEATABLE_PENALTY;
};

export const rivalScore = (state: MatchState): number => {
  const wins = winsOf(state.results);
  return (
    handStrength(rivalAttacks(state)) +
    (wins.rival - wins.player) * DUEL_LEAD_WEIGHT +
    answerAdjustment(state)
  );
};
