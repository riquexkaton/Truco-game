import { singRitual } from '@domain/match/ritual-flow';
import type { Side } from '@domain/shared/side';

import { gainEffect } from '@application/effects/effect-gain';
import type { GameContext } from '@application/game-context';
import { announce, matchOf, pause } from '@application/game-context';
import { beforeEffectGain, commit } from '@application/match/commit';
import { RITUAL_GAIN_DELAY_MS } from '@application/timings';

export const singRitualFlow = async (
  game: GameContext,
  side: Side,
  doesAnnulPact = false,
): Promise<void> => {
  const before = matchOf(game);
  const next = singRitual(before, side, game.ports.random);
  await commit(game, { ...before, ritual: next.ritual });
  await announce(game, { type: 'ritualSung', side, annulsPact: doesAnnulPact });
  await commit(game, beforeEffectGain(next, before));
  if (next.over) return;
  await pause(game, RITUAL_GAIN_DELAY_MS);
  await gainEffect(game, { side, next });
};
