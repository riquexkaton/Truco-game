import type { Scene } from 'three';

import type { PerSide } from '@domain/shared/side';
import { SIDES } from '@domain/shared/side';

import { resetTint } from '@infrastructure/three/cards/card-tint';
import type { DuelBadges } from '@infrastructure/three/cards/duel-badges';
import {
  createDuelBadges,
  disposeDuelBadges,
  hideBadges,
} from '@infrastructure/three/cards/duel-badges';
import type { CardLook } from '@infrastructure/three/cards/duel-look';
import type { TableCard } from '@infrastructure/three/cards/table-card';
import type { DuelFx } from '@infrastructure/three/fx/duel-fx';
import { clearDuelFx, createDuelFx } from '@infrastructure/three/fx/duel-fx';
import type { TextureKit } from '@infrastructure/three/textures/canvas-texture';

export interface MarkedDuel {
  readonly duel: number;
  readonly cards: PerSide<TableCard>;
  readonly looks: PerSide<CardLook>;
  progress: number;
}

export interface DuelMarks {
  readonly badges: DuelBadges;
  readonly fx: DuelFx;
  readonly marked: MarkedDuel[];
}

export const createDuelMarks = (kit: TextureKit, scene: Scene): DuelMarks => ({
  badges: createDuelBadges(kit),
  fx: createDuelFx(scene),
  marked: [],
});

export const unmarkDuels = (marks: DuelMarks): void => {
  for (const { cards } of marks.marked) {
    for (const side of SIDES) {
      resetTint(cards[side].tint);
    }
  }
  marks.marked.length = 0;
  hideBadges(marks.badges);
  clearDuelFx(marks.fx);
};

export const disposeDuelMarks = (marks: DuelMarks): void => {
  disposeDuelBadges(marks.badges);
};
