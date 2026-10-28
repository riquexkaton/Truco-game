import type { EffectChoice } from '@domain/match/gates';
import { activateEffect } from '@domain/match/effect-use';

import type { GameContext } from '@application/game-context';
import { announce, matchOf } from '@application/game-context';
import { plunderFlow } from '@application/effects/plunder-flow';
import { commit } from '@application/match/commit';

export const playEffect = async (game: GameContext, choice: EffectChoice): Promise<void> => {
  const before = matchOf(game);
  const { state, annulled } = activateEffect(before, choice);
  await commit(game, { ...before, effects: state.effects });
  await announce(game, { type: 'effectUsed', side: choice.side, effect: choice.effect });
  await commit(game, state);
  if (annulled) {
    await announce(game, { type: 'effectAnnulled', side: choice.side });
    return;
  }
  if (choice.effect === 'saqueo') await plunderFlow(game, choice.side);
};
