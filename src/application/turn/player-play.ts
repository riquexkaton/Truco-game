import { batch } from '@preact/signals-core';

import type { CardId } from '@domain/cards/card';
import { canPlaceCard } from '@domain/match/gates';
import type { MatchState } from '@domain/match/match-state';

import { giveCard, isAwaitingGift } from '@application/effects/plunder-flow';
import type { GameContext } from '@application/game-context';
import { isRoundLive, matchOf } from '@application/game-context';
import { canPlayerAct } from '@application/store/game-signals';
import { placeCardFlow } from '@application/turn/card-placement';
import { endPlayerTurn } from '@application/turn/turn-gate';

type Gate = (state: MatchState) => boolean;

export interface PlayerAction {
  readonly isAllowed: Gate;
  readonly run: () => Promise<void>;
}

const isPermitted = (game: GameContext, isAllowed: Gate): boolean => {
  const state = game.signals.match.value;
  return state !== null && canPlayerAct(game.signals) && isAllowed(state);
};

const perform = async (game: GameContext, run: PlayerAction['run']): Promise<void> => {
  game.signals.busy.value = true;
  await run();
  game.signals.busy.value = false;
  if (!isRoundLive(matchOf(game))) endPlayerTurn(game);
};

export const playerAction = (game: GameContext, action: PlayerAction): Promise<void> =>
  isPermitted(game, action.isAllowed) ? perform(game, action.run) : Promise.resolve();

const placePlayerCard = async (game: GameContext, cardId: CardId): Promise<void> => {
  batch(() => {
    game.signals.busy.value = true;
    game.signals.showPlayHint.value = false;
  });
  await placeCardFlow(game, { side: 'player', cardId });
  endPlayerTurn(game);
};

export const tryPlayCard = (game: GameContext, cardId: CardId): Promise<void> => {
  if (isAwaitingGift(game)) {
    giveCard(game, cardId);
    return Promise.resolve();
  }
  return isPermitted(game, (state) => canPlaceCard(state, { side: 'player', cardId }))
    ? placePlayerCard(game, cardId)
    : Promise.resolve();
};
