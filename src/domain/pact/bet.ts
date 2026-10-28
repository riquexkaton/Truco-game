export type BetKind = 'pacto' | 'repacto' | 'apuesta';

export interface Bet {
  readonly kind: BetKind;
  readonly amount: number;
}

export interface WagerRange {
  readonly min: number;
  readonly max: number;
}

const MIN_WAGER = 4;

export const PACT_BET: Bet = { kind: 'pacto', amount: 2 };

export const REPACT_BET: Bet = { kind: 'repacto', amount: 4 };

export const wager = (amount: number): Bet => ({ kind: 'apuesta', amount });

const RANKS: Readonly<Record<BetKind, number>> = { pacto: 1, repacto: 2, apuesta: 3 };

export const betRank = (bet: Bet): number => RANKS[bet.kind];

export const canRaiseToRepact = (bet: Bet): boolean => betRank(bet) < RANKS.repacto;

export const canRaiseToWager = (bet: Bet): boolean => betRank(bet) < RANKS.apuesta;

export const wagerRange = (opponentLife: number, current: Bet | null): WagerRange => {
  const min = current === null ? MIN_WAGER : Math.max(MIN_WAGER, current.amount + 1);
  return { min, max: Math.max(min, opponentLife) };
};

export const clampWager = (amount: number, range: WagerRange): number =>
  Math.min(range.max, Math.max(range.min, amount));

export const rejectDamage = (previousAmount: number): number =>
  previousAmount > 0 ? previousAmount : 1;
