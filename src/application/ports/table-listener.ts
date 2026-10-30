import type { CardId } from '@domain/cards/card';
import type { Side } from '@domain/shared/side';

export interface PlayedCardPick {
  readonly side: Side;
  readonly cardId: CardId;
  readonly duel: number;
}

export interface ScreenRect {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export interface SealHover {
  readonly cardId: CardId;
  readonly rect: ScreenRect;
}

export interface TableListener {
  readonly cardInspected: (pick: PlayedCardPick) => void;
  readonly sealHovered: (hover: SealHover | null) => void;
  readonly tableCleared: () => void;
}
