import { openPact } from '@domain/match/pact-flow';
import type { Bet } from '@domain/pact/bet';
import type { PactAnswer, PactNegotiation } from '@domain/pact/negotiation';
import { openNegotiation, raiseNegotiation, responderOf } from '@domain/pact/negotiation';
import { rivalPactAnswer } from '@domain/rival/pact-answer-ai';
import type { Side } from '@domain/shared/side';

import type { GameContext } from '@application/game-context';
import { announce, matchOf, pause } from '@application/game-context';
import { commit } from '@application/match/commit';
import { askPactAnswer, askPactCall } from '@application/pact/pact-prompts';
import { settlePact } from '@application/pact/pact-settlement';
import { PACT_ANSWER_MS } from '@application/timings';

export interface PactOpening {
  readonly caller: Side;
  readonly bet: Bet;
}

const isAnnounced = ({ caller, first }: PactNegotiation): boolean => caller === 'player' || !first;

const answerOf = async (game: GameContext, negotiation: PactNegotiation): Promise<PactAnswer> => {
  if (isAnnounced(negotiation)) {
    const { caller: by, bet, first } = negotiation;
    await announce(game, { type: 'pactCalled', by, bet, first });
    await pause(game, PACT_ANSWER_MS);
  }
  return responderOf(negotiation) === 'player'
    ? askPactAnswer(game, negotiation)
    : rivalPactAnswer(matchOf(game), negotiation, game.ports.random);
};

const negotiate = async (game: GameContext, negotiation: PactNegotiation): Promise<void> => {
  const answer = await answerOf(game, negotiation);
  return answer.kind === 'raise'
    ? negotiate(game, raiseNegotiation(negotiation, answer.bet))
    : settlePact(game, { negotiation, answer });
};

export const negotiatePact = async (game: GameContext, opening: PactOpening): Promise<void> => {
  await commit(game, openPact(matchOf(game)));
  await negotiate(game, openNegotiation(opening.caller, opening.bet));
};

export const playerCallPact = async (game: GameContext): Promise<void> => {
  const bet = await askPactCall(game);
  if (bet !== null) await negotiatePact(game, { caller: 'player', bet });
};
