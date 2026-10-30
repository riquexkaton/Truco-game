import type { CardId } from '@domain/cards/card';
import type { FactionId } from '@domain/cards/faction';
import type { DuelResult } from '@domain/duel/duel';
import type { PerSide, Side } from '@domain/shared/side';

export interface RoundDeal {
  readonly vira: FactionId;
  readonly player: readonly CardId[];
  readonly rival: readonly CardId[];
}

export interface CardPlacement {
  readonly side: Side;
  readonly cardId: CardId;
  readonly duel: number;
  readonly cursed: boolean;
}

export interface DuelMark {
  readonly duel: number;
  readonly result: DuelResult;
  readonly attacks: PerSide<number>;
}

export interface CoinMove {
  readonly side: Side;
  readonly delta: number;
}

export interface TablePort {
  dealRound(deal: RoundDeal): Promise<void>;
  placeCard(placement: CardPlacement): Promise<void>;
  arrangeHands(hands: PerSide<readonly CardId[]>): Promise<void>;
  markDuel(mark: DuelMark): void;
  flyEffect(side: Side): Promise<void>;
  moveCoins(move: CoinMove): void;
  clearTable(): Promise<void>;
  resetCoins(): void;
}
