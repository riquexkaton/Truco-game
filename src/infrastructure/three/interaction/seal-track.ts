import type { CardId } from '@domain/cards/card';

import type { ScreenRect } from '@application/ports/table-listener';

import type { TableCard } from '@infrastructure/three/cards/table-card';

export interface SealTarget {
  readonly cardId: CardId;
  readonly card: TableCard;
}

export interface SealTrack {
  target: SealTarget | null;
  rect: ScreenRect | null;
}

export const createSealTrack = (): SealTrack => ({ target: null, rect: null });
