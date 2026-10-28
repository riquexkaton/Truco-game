import { batch } from '@preact/signals-core';

import { startTurn } from '@domain/match/duel-play';
import { rivalCardPick } from '@domain/rival/card-pick';
import { shouldRivalRaise } from '@domain/rival/challenge-ai';
import { rivalEffectChoice } from '@domain/rival/effect-ai';
import {
  rivalOpeningBet,
  shouldRivalCallPact,
  shouldRivalSingRitual,
} from '@domain/rival/pact-call-ai';

import { callChallenge } from '@application/challenge/challenge-flow';
import { playEffect } from '@application/effects/effect-play';
import type { GameContext } from '@application/game-context';
import { announce, isRoundLive, matchOf, pause, replaceMatch } from '@application/game-context';
import { negotiatePact } from '@application/pact/pact-negotiation';
import { singRitualFlow } from '@application/ritual/ritual-flow';
import { RIVAL_EFFECT_PAUSE_MS, RIVAL_THINK_MS } from '@application/timings';
import { placeCardFlow } from '@application/turn/card-placement';

type RivalStep = (game: GameContext) => Promise<boolean>;

const isMatchLive = (game: GameContext): boolean => !matchOf(game).over;

const isLiveAfterRitual: RivalStep = async (game) => {
  if (!shouldRivalSingRitual(matchOf(game), game.ports.random)) return true;
  await singRitualFlow(game, 'rival');
  return isMatchLive(game);
};

const isLiveAfterPact: RivalStep = async (game) => {
  const state = matchOf(game);
  if (!shouldRivalCallPact(state, game.ports.random)) return true;
  await negotiatePact(game, { caller: 'rival', bet: rivalOpeningBet(state, game.ports.random) });
  return isMatchLive(game);
};

const isLiveAfterEffect: RivalStep = async (game) => {
  const effect = rivalEffectChoice(matchOf(game), game.ports.random);
  if (effect === null) return true;
  await playEffect(game, { side: 'rival', effect });
  if (!isRoundLive(matchOf(game))) return false;
  await pause(game, RIVAL_EFFECT_PAUSE_MS);
  return true;
};

const isLiveAfterRaise: RivalStep = async (game) => {
  if (!shouldRivalRaise(matchOf(game), game.ports.random)) return true;
  await callChallenge(game, 'rival');
  return isRoundLive(matchOf(game));
};

const RIVAL_STEPS: readonly RivalStep[] = [
  isLiveAfterRitual,
  isLiveAfterPact,
  isLiveAfterEffect,
  isLiveAfterRaise,
];

export const rivalTurn = async (game: GameContext): Promise<void> => {
  batch(() => {
    game.signals.phase.value = 'rival';
    replaceMatch(game, startTurn(matchOf(game)));
  });
  await announce(game, { type: 'turnStarted', side: 'rival' });
  await pause(game, RIVAL_THINK_MS);
  for (const step of RIVAL_STEPS) {
    if (!(await step(game))) return;
  }
  await placeCardFlow(game, { side: 'rival', cardId: rivalCardPick(matchOf(game)) });
};
