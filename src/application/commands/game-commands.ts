import type { CardId } from '@domain/cards/card';
import type { EffectId } from '@domain/effects/effect';
import {
  canCallPact,
  canFold,
  canRaiseChallenge,
  canSingRitual,
  canUseEffect,
} from '@domain/match/gates';

import { callChallenge } from '@application/challenge/challenge-flow';
import { foldFlow } from '@application/challenge/retirement';
import { playEffect } from '@application/effects/effect-play';
import type { GameContext } from '@application/game-context';
import { restartMatch, startMatch } from '@application/match/match-flow';
import { playerCallPact } from '@application/pact/pact-negotiation';
import { singRitualFlow } from '@application/ritual/ritual-flow';
import { playerAction, tryPlayCard } from '@application/turn/player-play';

export interface GameCommands {
  readonly start: () => void;
  readonly playCard: (cardId: CardId) => void;
  readonly callChallenge: () => void;
  readonly callPact: () => void;
  readonly singRitual: () => void;
  readonly fold: () => void;
  readonly useEffect: (effect: EffectId) => void;
  readonly restart: () => void;
}

type MatchCommands = Pick<GameCommands, 'start' | 'restart' | 'playCard'>;

const matchCommands = (game: GameContext): MatchCommands => ({
  start: () => void startMatch(game),
  restart: () => void restartMatch(game),
  playCard: (cardId) => void tryPlayCard(game, cardId),
});

type CallCommands = Omit<GameCommands, keyof MatchCommands>;

const callCommands = (game: GameContext): CallCommands => ({
  callChallenge: () =>
    void playerAction(game, {
      isAllowed: (state) => canRaiseChallenge(state, 'player'),
      run: () => callChallenge(game, 'player'),
    }),
  callPact: () =>
    void playerAction(game, {
      isAllowed: (state) => canCallPact(state, 'player'),
      run: () => playerCallPact(game),
    }),
  singRitual: () =>
    void playerAction(game, {
      isAllowed: (state) => canSingRitual(state, 'player'),
      run: () => singRitualFlow(game, 'player'),
    }),
  fold: () =>
    void playerAction(game, {
      isAllowed: (state) => canFold(state, 'player'),
      run: () => foldFlow(game),
    }),
  useEffect: (effect) =>
    void playerAction(game, {
      isAllowed: (state) => canUseEffect(state, { side: 'player', effect }),
      run: () => playEffect(game, { side: 'player', effect }),
    }),
});

export const createCommands = (game: GameContext): GameCommands => ({
  ...matchCommands(game),
  ...callCommands(game),
});
