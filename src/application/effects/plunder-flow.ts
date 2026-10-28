import type { CardId } from '@domain/cards/card';
import { plunder } from '@domain/match/effect-use';
import type { MatchState } from '@domain/match/match-state';
import { plunderGive } from '@domain/rival/card-pick';
import type { Side } from '@domain/shared/side';

import type { GameContext } from '@application/game-context';
import { announce, matchOf } from '@application/game-context';
import { commit } from '@application/match/commit';
import { deferred } from '@application/shared/deferred';

const chooseGift = async (game: GameContext): Promise<CardId> => {
  const gift = deferred<CardId>();
  game.pending.give = gift;
  game.signals.phase.value = 'give';
  const cardId = await gift.promise;
  game.signals.phase.value = 'player';
  return cardId;
};

export const isAwaitingGift = (game: GameContext): boolean => game.pending.give !== null;

export const giveCard = (game: GameContext, cardId: CardId): void => {
  const gift = game.pending.give;
  if (gift === null || !matchOf(game).hands.player.includes(cardId)) return;
  game.pending.give = null;
  gift.resolve(cardId);
};

const hasBothHands = (state: MatchState): boolean =>
  state.hands.player.length > 0 && state.hands.rival.length > 0;

export const plunderFlow = async (game: GameContext, side: Side): Promise<void> => {
  const state = matchOf(game);
  if (!hasBothHands(state)) return;
  const give = side === 'player' ? await chooseGift(game) : plunderGive(state, side);
  const next = plunder(matchOf(game), { side, give }, game.ports.random);
  await commit(game, next);
  await game.ports.table.arrangeHands(next.hands);
  await announce(game, { type: 'plundered', side });
};
