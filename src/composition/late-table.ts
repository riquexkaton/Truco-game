import type { TablePort } from '@application/ports/table-port';

export interface LateTable {
  readonly port: TablePort;
  readonly bind: (table: TablePort) => void;
}

export const createLateTable = (): LateTable => {
  let bound: TablePort | null = null;
  const table = (): TablePort => {
    if (bound === null) throw new Error('The table is not ready yet');
    return bound;
  };
  return {
    bind: (next) => {
      bound = next;
    },
    port: {
      dealRound: (deal) => table().dealRound(deal),
      placeCard: (placement) => table().placeCard(placement),
      arrangeHands: (hands) => table().arrangeHands(hands),
      markDuel: (mark) => {
        table().markDuel(mark);
      },
      flyEffect: (side) => table().flyEffect(side),
      moveCoins: (move) => {
        table().moveCoins(move);
      },
      clearTable: () => table().clearTable(),
      resetCoins: () => {
        table().resetCoins();
      },
    },
  };
};
