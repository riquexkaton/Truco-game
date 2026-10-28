import { placeCard } from '@domain/match/duel-play';
import type { CardChoice } from '@domain/match/gates';
import type { MatchState } from '@domain/match/match-state';

import type { GameContext } from '@application/game-context';
import { announce, matchOf } from '@application/game-context';
import { commit } from '@application/match/commit';

const isRitualLost = (state: MatchState, { side }: CardChoice): boolean =>
  side === 'player' && state.duel === 0 && state.ritual.available.player;

export const placeCardFlow = async (game: GameContext, choice: CardChoice): Promise<void> => {
  const before = matchOf(game);
  if (isRitualLost(before, choice)) await announce(game, { type: 'ritualLost' });
  await commit(game, placeCard(before, choice));
  await game.ports.table.placeCard({
    ...choice,
    duel: before.duel,
    cursed: before.curse[choice.side],
  });
};
