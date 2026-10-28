import { describe, expect, it } from 'vitest';

import type { TablePort } from '@application/ports/table-port';

import { createLateTable } from './late-table';

const recordingTable = (calls: string[]): TablePort => {
  const record = (name: string) => () => {
    calls.push(name);
  };
  const animate = (name: string) => () => {
    calls.push(name);
    return Promise.resolve();
  };
  return {
    dealRound: animate('dealRound'),
    placeCard: animate('placeCard'),
    arrangeHands: animate('arrangeHands'),
    markDuel: record('markDuel'),
    flyEffect: animate('flyEffect'),
    moveCoins: record('moveCoins'),
    clearTable: animate('clearTable'),
    resetCoins: record('resetCoins'),
  };
};

describe('the late table', () => {
  it('refuses to animate before the 3D table is ready', () => {
    const { port } = createLateTable();
    expect(() => {
      port.resetCoins();
    }).toThrow('The table is not ready yet');
  });

  it('forwards every call to the bound table', async () => {
    const calls: string[] = [];
    const { port, bind } = createLateTable();
    bind(recordingTable(calls));
    await port.dealRound({ vira: 'lirio', player: ['garin'], rival: ['teo'] });
    await port.placeCard({ side: 'player', cardId: 'garin', duel: 0, cursed: false });
    await port.arrangeHands({ player: [], rival: [] });
    port.markDuel({ duel: 0, winner: 'player' });
    await port.flyEffect('rival');
    port.moveCoins({ side: 'rival', delta: -2 });
    await port.clearTable();
    port.resetCoins();
    expect(calls).toEqual([
      'dealRound',
      'placeCard',
      'arrangeHands',
      'markDuel',
      'flyEffect',
      'moveCoins',
      'clearTable',
      'resetCoins',
    ]);
  });
});
