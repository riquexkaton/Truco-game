import { itemAt } from '@domain/shared/random';
import type { PerSide, Side } from '@domain/shared/side';

export interface TablePoint {
  readonly x: number;
  readonly z: number;
}

export const TABLE_Y = 0.105;
export const CARD_Y = 0.13;
export const CARD_WIDTH = 0.62;
export const CARD_HEIGHT = 0.886;
export const FACE_UP = -Math.PI / 2;
export const FACE_DOWN = Math.PI / 2;

export const VIRA_POINT: TablePoint = { x: -2.2, z: 0 };
export const DECK_POINT: TablePoint = { x: 2.2, z: 0.58 };
export const EFFECT_DECK_POINT: TablePoint = { x: 2.2, z: -0.58 };

const SLOT_XS = [-0.92, 0, 0.92];

const SLOT_ROWS: PerSide<number> = { player: -0.1, rival: -1.15 };

const slotRow = (side: Side): readonly TablePoint[] =>
  SLOT_XS.map((x) => ({ x, z: SLOT_ROWS[side] }));

export const DUEL_SLOTS: PerSide<readonly TablePoint[]> = {
  player: slotRow('player'),
  rival: slotRow('rival'),
};

export const slotPoint = (side: Side, duel: number): TablePoint => itemAt(DUEL_SLOTS[side], duel);
