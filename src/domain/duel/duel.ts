import type { PerSide, Side } from '@domain/shared/side';

export type DuelResult = Side | 'tie';

const DUELS_PER_ROUND = 3;

const DUELS_TO_WIN = 2;

export const compareAttacks = ({ player, rival }: PerSide<number>): DuelResult => {
  if (player > rival) return 'player';
  if (rival > player) return 'rival';
  return 'tie';
};

export const winsOf = (results: readonly DuelResult[]): PerSide<number> => ({
  player: results.filter((result) => result === 'player').length,
  rival: results.filter((result) => result === 'rival').length,
});

const hasOnlyOneWon = ({ player, rival }: PerSide<number>): boolean =>
  (player === 0) !== (rival === 0);

export const isRoundDecided = (results: readonly DuelResult[]): boolean => {
  const wins = winsOf(results);
  const isLastDuelNext = results.length >= DUELS_PER_ROUND - 1;
  return (
    wins.player >= DUELS_TO_WIN ||
    wins.rival >= DUELS_TO_WIN ||
    results.length >= DUELS_PER_ROUND ||
    (isLastDuelNext && hasOnlyOneWon(wins))
  );
};

const firstKill = (results: readonly DuelResult[]): Side | null =>
  results.find((result): result is Side => result !== 'tie') ?? null;

export const roundWinnerOf = (results: readonly DuelResult[]): Side | null => {
  const decided = compareAttacks(winsOf(results));
  return decided === 'tie' ? firstKill(results) : decided;
};

export const nextLead = (result: DuelResult, currentLead: Side): Side =>
  result === 'tie' ? currentLead : result;
