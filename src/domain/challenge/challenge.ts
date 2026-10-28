import type { Side } from '@domain/shared/side';

export type ChallengeLevel = 0 | 1 | 2;

export type RaisedLevel = Exclude<ChallengeLevel, 0>;

export type ChallengeAnswer = 'accept' | 'counter' | 'retire';

export interface Challenge {
  readonly level: ChallengeLevel;
  readonly holder: Side | null;
}

export const STAKES: Readonly<Record<ChallengeLevel, number>> = { 0: 2, 1: 4, 2: 6 };

const MAX_CHALLENGE_LEVEL: ChallengeLevel = 2;

export const FOLD_DAMAGE = 1;

export const NO_CHALLENGE: Challenge = { level: 0, holder: null };

export const nextLevel = (challenge: Challenge): RaisedLevel => (challenge.level === 0 ? 1 : 2);

export const canRaise = (challenge: Challenge, side: Side): boolean =>
  challenge.level < MAX_CHALLENGE_LEVEL && (challenge.level === 0 || challenge.holder === side);

export const acceptedChallenge = (challenge: Challenge, acceptor: Side): Challenge => {
  const level = nextLevel(challenge);
  return { level, holder: level < MAX_CHALLENGE_LEVEL ? acceptor : null };
};

export const declineDamage = (level: RaisedLevel): number =>
  level === 1 ? FOLD_DAMAGE : STAKES[1];
