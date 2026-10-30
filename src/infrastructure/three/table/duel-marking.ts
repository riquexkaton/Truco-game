import { attackOf } from '@domain/cards/attack';
import type { CardId } from '@domain/cards/card';
import { cardById } from '@domain/cards/deck';
import type { PerSide, Side } from '@domain/shared/side';
import { SIDES } from '@domain/shared/side';

import type { DuelMark } from '@application/ports/table-port';

import { setBadgeLevel, showBadge } from '@infrastructure/three/cards/duel-badges';
import { lightGlow, resetGlows } from '@infrastructure/three/cards/duel-glows';
import type { CardLook } from '@infrastructure/three/cards/duel-look';
import {
  advanceMark,
  duelLooks,
  shownAttack,
  TINT_TRAITS,
  traitAt,
} from '@infrastructure/three/cards/duel-look';
import type { MarkedDuel } from '@infrastructure/three/cards/duel-marks';
import { unmarkDuels } from '@infrastructure/three/cards/duel-marks';
import type { TableCard } from '@infrastructure/three/cards/table-card';
import { tableCardOf } from '@infrastructure/three/cards/table-deck';
import { startDuelFx, updateDuelFx } from '@infrastructure/three/fx/duel-fx';
import type { Stage } from '@infrastructure/three/stage';

const pickOf = (stage: Stage, side: Side, duel: number): CardId | undefined =>
  stage.played.find((pick) => pick.side === side && pick.duel === duel)?.cardId;

const duelPicks = (stage: Stage, duel: number): PerSide<CardId> | null => {
  const player = pickOf(stage, 'player', duel);
  const rival = pickOf(stage, 'rival', duel);
  return player === undefined || rival === undefined ? null : { player, rival };
};

const markBadges = (stage: Stage, mark: DuelMark, ids: PerSide<CardId>): void => {
  const { vira } = stage;
  if (vira === null) return;
  for (const side of SIDES) {
    const value = shownAttack(attackOf(cardById(ids[side]), vira), mark.attacks[side]);
    const card = tableCardOf(stage.deck, ids[side]);
    if (value !== null) showBadge(stage.duelMarks.badges, { side, duel: mark.duel, card, value });
  }
};

export const markDuelOnTable = (stage: Stage, mark: DuelMark): void => {
  const ids = duelPicks(stage, mark.duel);
  if (ids === null) return;
  const looks = duelLooks(mark.result);
  stage.duelMarks.marked.push({
    duel: mark.duel,
    cards: {
      player: tableCardOf(stage.deck, ids.player),
      rival: tableCardOf(stage.deck, ids.rival),
    },
    looks,
    progress: 0,
  });
  for (const side of SIDES) {
    lightGlow(stage.glows, { duel: mark.duel, side, level: traitAt(looks[side], 'pool', 1) });
  }
  markBadges(stage, mark, ids);
  startDuelFx(stage.duelMarks.fx, {
    duel: mark.duel,
    looks,
    isReduced: stage.reducedMotion,
    pixelRatio: stage.renderer.getPixelRatio(),
  });
};

const tintCard = ({ tint }: TableCard, look: CardLook, progress: number): void => {
  for (const trait of TINT_TRAITS) {
    tint[trait].value = traitAt(look, trait, progress);
  }
};

const lightDuel = (stage: Stage, { duel, cards, looks, progress }: MarkedDuel): void => {
  for (const side of SIDES) {
    tintCard(cards[side], looks[side], progress);
  }
  setBadgeLevel(stage.duelMarks.badges, duel, progress);
};

export const updateDuelMarks = (stage: Stage, deltaSeconds: number): void => {
  updateDuelFx(stage.duelMarks.fx, deltaSeconds);
  for (const marked of stage.duelMarks.marked) {
    if (marked.progress >= 1) continue;
    marked.progress = advanceMark(marked.progress, deltaSeconds, stage.reducedMotion);
    lightDuel(stage, marked);
  }
};

export const clearDuelMarks = (stage: Stage): void => {
  unmarkDuels(stage.duelMarks);
  resetGlows(stage.glows);
};
