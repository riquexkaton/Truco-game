import type { MatchState } from '@domain/match/match-state';
import type { Side } from '@domain/shared/side';
import { SIDES } from '@domain/shared/side';

import type { GameContext } from '@application/game-context';
import { announce, matchOf, replaceMatch } from '@application/game-context';
import { beginMatchEnd } from '@application/match/match-end';

interface LifeReport {
  readonly side: Side;
  readonly previous: MatchState;
  readonly next: MatchState;
}

const reportLife = async (game: GameContext, { side, previous, next }: LifeReport) => {
  const delta = next.lives[side] - previous.lives[side];
  if (delta === 0) return;
  game.ports.table.moveCoins({ side, delta });
  await announce(game, { type: 'lifeChanged', side, delta, life: next.lives[side] });
};

export const commit = async (game: GameContext, next: MatchState): Promise<void> => {
  const previous = matchOf(game);
  replaceMatch(game, next);
  for (const side of SIDES) {
    await reportLife(game, { side, previous, next });
  }
  if (next.over && !previous.over) beginMatchEnd(game);
};

export const beforeLifeChange = (next: MatchState, previous: MatchState): MatchState => ({
  ...next,
  lives: previous.lives,
  over: previous.over,
});

export const beforeEffectGain = (next: MatchState, previous: MatchState): MatchState => ({
  ...next,
  effects: previous.effects,
});
