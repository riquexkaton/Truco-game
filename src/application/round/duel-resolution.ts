import { winsOf } from '@domain/duel/duel';
import type { DuelOutcome } from '@domain/match/duel-play';
import { resolveDuel } from '@domain/match/duel-play';
import type { MatchState } from '@domain/match/match-state';
import { playedAttack } from '@domain/match/queries';
import { itemAt } from '@domain/shared/random';
import type { Side } from '@domain/shared/side';

import { gainEffect } from '@application/effects/effect-gain';
import type { GameContext } from '@application/game-context';
import { announce, matchOf, pause } from '@application/game-context';
import { beforeEffectGain, commit } from '@application/match/commit';
import type { DuelCard, GameEventOf } from '@application/ports/game-event';
import { DUEL_BEAT_MS, DUEL_REVEAL_MS } from '@application/timings';

const duelCard = (state: MatchState, side: Side): DuelCard => {
  const slot = itemAt(state.played[side], state.duel);
  return { cardId: slot.cardId, attack: playedAttack(state, slot) };
};

const duelReport = (before: MatchState, outcome: DuelOutcome): GameEventOf<'duelResolved'> => ({
  type: 'duelResolved',
  duel: before.duel,
  result: outcome.result,
  player: duelCard(before, 'player'),
  rival: duelCard(before, 'rival'),
  wins: winsOf(outcome.state.results),
});

const rewardSeal = async (game: GameContext, before: MatchState, outcome: DuelOutcome) => {
  const side = outcome.effectEarner;
  if (side === null) return;
  await announce(game, { type: 'effectEarned', side, cardId: duelCard(before, side).cardId });
  await gainEffect(game, { side, next: outcome.state });
};

export const resolveDuelFlow = async (game: GameContext): Promise<void> => {
  await pause(game, DUEL_REVEAL_MS);
  const before = matchOf(game);
  const outcome = resolveDuel(before, game.ports.random);
  const report = duelReport(before, outcome);
  await commit(game, beforeEffectGain(outcome.state, before));
  game.ports.table.markDuel({
    duel: report.duel,
    result: report.result,
    attacks: { player: report.player.attack, rival: report.rival.attack },
  });
  await announce(game, report);
  await pause(game, DUEL_BEAT_MS);
  await rewardSeal(game, before, outcome);
};
