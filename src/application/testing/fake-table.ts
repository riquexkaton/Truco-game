import type { TablePort } from '@application/ports/table-port';

type TableMethod = keyof TablePort;

interface TableCall {
  readonly method: TableMethod;
  readonly args: unknown;
}

export interface FakeTable extends TablePort {
  readonly calls: TableCall[];
  readonly callsTo: (method: TableMethod) => unknown[];
}

export const createFakeTable = (): FakeTable => {
  const calls: TableCall[] = [];
  const instant = (method: TableMethod) => (args?: unknown) => {
    calls.push({ method, args });
  };
  const animated = (method: TableMethod) => (args?: unknown) => {
    instant(method)(args);
    return Promise.resolve();
  };
  return {
    calls,
    callsTo: (method) => calls.filter((call) => call.method === method).map((call) => call.args),
    dealRound: animated('dealRound'),
    placeCard: animated('placeCard'),
    arrangeHands: animated('arrangeHands'),
    markDuel: instant('markDuel'),
    flyEffect: animated('flyEffect'),
    moveCoins: instant('moveCoins'),
    clearTable: animated('clearTable'),
    resetCoins: instant('resetCoins'),
  };
};
