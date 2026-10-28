import type { EffectId } from '@domain/effects/effect';
import { discardEffect, requiresDiscard } from '@domain/match/effect-store';
import type { MatchState } from '@domain/match/match-state';
import { rivalDiscardIndex } from '@domain/rival/effect-ai';
import type { Side } from '@domain/shared/side';

import type { GameContext } from '@application/game-context';
import { announce, ask, matchOf } from '@application/game-context';
import { commit } from '@application/match/commit';

export interface EffectGain {
  readonly side: Side;
  readonly next: MatchState;
}

const newestEffect = ({ side, next }: EffectGain, previous: MatchState): EffectId | null => {
  const stored = next.effects.stored[side];
  return stored.length > previous.effects.stored[side].length ? (stored.at(-1) ?? null) : null;
};

const discardIndex = (game: GameContext, side: Side, effects: readonly EffectId[]) =>
  side === 'player'
    ? ask(game, { kind: 'discardEffect', effects })
    : Promise.resolve(rivalDiscardIndex(effects));

const discardExtra = async (game: GameContext, side: Side): Promise<void> => {
  const state = matchOf(game);
  const index = await discardIndex(game, side, state.effects.stored[side]);
  await commit(game, discardEffect(matchOf(game), { side, index }));
};

export const gainEffect = async (game: GameContext, gain: EffectGain): Promise<void> => {
  const effect = newestEffect(gain, matchOf(game));
  if (effect !== null) await game.ports.table.flyEffect(gain.side);
  await commit(game, gain.next);
  if (effect === null) return;
  await announce(game, { type: 'effectGained', side: gain.side, effect });
  if (requiresDiscard(gain.next, gain.side)) await discardExtra(game, gain.side);
};
