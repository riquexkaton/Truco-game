import { FOLD_DAMAGE } from '@domain/challenge/challenge';
import type { Retirement } from '@domain/match/challenge-flow';
import { retire } from '@domain/match/challenge-flow';

import type { GameContext } from '@application/game-context';
import { announce, ask, matchOf } from '@application/game-context';
import { beforeLifeChange, commit } from '@application/match/commit';
import type { RetireReason } from '@application/ports/game-event';

export interface RetireRequest extends Retirement {
  readonly reason: RetireReason;
}

export const retireFlow = async (game: GameContext, request: RetireRequest): Promise<void> => {
  const before = matchOf(game);
  const next = retire(before, request);
  await commit(game, beforeLifeChange(next, before));
  await announce(game, { type: 'retired', ...request });
  await commit(game, next);
};

export const foldFlow = async (game: GameContext): Promise<void> => {
  const shouldFold = await ask(game, { kind: 'foldConfirm' });
  if (shouldFold) await retireFlow(game, { side: 'player', damage: FOLD_DAMAGE, reason: 'fold' });
};
