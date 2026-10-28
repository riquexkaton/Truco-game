import type { ChallengeAnswer, RaisedLevel } from '@domain/challenge/challenge';
import { declineDamage, nextLevel, STAKES } from '@domain/challenge/challenge';
import { acceptChallenge, counterChallenge } from '@domain/match/challenge-flow';
import { rivalChallengeAnswer } from '@domain/rival/challenge-ai';
import type { Side } from '@domain/shared/side';
import { opponent } from '@domain/shared/side';

import { retireFlow } from '@application/challenge/retirement';
import type { GameContext } from '@application/game-context';
import { announce, ask, matchOf, pause } from '@application/game-context';
import { commit } from '@application/match/commit';
import { CHALLENGE_TIMEOUT_SECONDS, RIVAL_ANSWER_MS } from '@application/timings';

interface Response {
  readonly side: Side;
  readonly level: RaisedLevel;
}

const RETIRE_ON_TIMEOUT = { seconds: CHALLENGE_TIMEOUT_SECONDS, answer: 'retire' } as const;

const askPlayer = (game: GameContext, level: RaisedLevel): Promise<ChallengeAnswer> =>
  level === 1
    ? ask(game, {
        kind: 'challengeResponse',
        stake: STAKES[1],
        counterStake: STAKES[2],
        retireDamage: declineDamage(1),
        timeout: RETIRE_ON_TIMEOUT,
      })
    : ask(game, {
        kind: 'counterResponse',
        stake: STAKES[2],
        retireDamage: declineDamage(2),
        timeout: RETIRE_ON_TIMEOUT,
      });

const respond = async (game: GameContext, { side, level }: Response): Promise<ChallengeAnswer> => {
  if (side === 'player') return askPlayer(game, level);
  await pause(game, RIVAL_ANSWER_MS);
  return rivalChallengeAnswer(matchOf(game), level, game.ports.random);
};

const acceptBy = async (game: GameContext, acceptor: Side): Promise<void> => {
  const next = acceptChallenge(matchOf(game), acceptor);
  await commit(game, next);
  await announce(game, {
    type: 'challengeAccepted',
    by: acceptor,
    stake: next.stake,
    holder: next.challenge.holder,
  });
};

const retireFrom = (game: GameContext, { side, level }: Response): Promise<void> =>
  retireFlow(game, { side, damage: declineDamage(level), reason: 'retire' });

const counterFlow = async (game: GameContext, by: Side): Promise<void> => {
  await commit(game, counterChallenge(matchOf(game)));
  if (by === 'rival') await announce(game, { type: 'challengeCalled', by: 'player', level: 2 });
  const answer = await respond(game, { side: by, level: 2 });
  return answer === 'accept' ? acceptBy(game, by) : retireFrom(game, { side: by, level: 2 });
};

export const callChallenge = async (game: GameContext, by: Side): Promise<void> => {
  const level = nextLevel(matchOf(game).challenge);
  if (by === 'player') await announce(game, { type: 'challengeCalled', by, level });
  const responder = { side: opponent(by), level };
  const answer = await respond(game, responder);
  if (answer === 'accept') return acceptBy(game, responder.side);
  if (answer === 'retire') return retireFrom(game, responder);
  return counterFlow(game, by);
};
