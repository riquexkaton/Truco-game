import { describe, expect, it } from 'vitest';

import type { PlayedCardPick } from '@application/ports/table-listener';

import { createHud } from '@ui/hud/create-hud';

const RIVAL_PICK: PlayedCardPick = { side: 'rival', cardId: 'tobias', duel: 0 };
const PLAYER_PICK: PlayedCardPick = { side: 'player', cardId: 'gaspar', duel: 1 };

describe('the close-up of a played card', () => {
  it('opens on the picked card and switches between both sides of the duel', () => {
    const { table, view } = createHud({ reducedMotion: false });
    table.cardInspected(RIVAL_PICK);
    expect(view.closeUp.value).toMatchObject({ pick: RIVAL_PICK, shown: 'rival' });
    view.showCloseUpSide('player');
    expect(view.closeUp.value).toMatchObject({ pick: RIVAL_PICK, shown: 'player' });
    table.cardInspected(PLAYER_PICK);
    expect(view.closeUp.value).toMatchObject({ pick: PLAYER_PICK, shown: 'player' });
  });

  it('closes on request and ignores tab changes once closed', () => {
    const { table, view } = createHud({ reducedMotion: false });
    table.cardInspected(RIVAL_PICK);
    view.closeCloseUp();
    expect(view.closeUp.value).toBeNull();
    view.showCloseUpSide('player');
    expect(view.closeUp.value).toBeNull();
  });

  it('closes by itself when the table is cleared', () => {
    const { table, view } = createHud({ reducedMotion: false });
    table.cardInspected(PLAYER_PICK);
    table.tableCleared();
    expect(view.closeUp.value).toBeNull();
  });

  it('does not open while a question waits for an answer', () => {
    const { port, table, view } = createHud({ reducedMotion: false });
    void port.ask({ kind: 'foldConfirm', damage: 1 });
    table.cardInspected(RIVAL_PICK);
    expect(view.closeUp.value).toBeNull();
    view.prompt.value?.choose(false);
    table.cardInspected(RIVAL_PICK);
    expect(view.closeUp.value?.pick).toEqual(RIVAL_PICK);
  });

  it('gives way to a question that arrives while it is open', () => {
    const { port, table, view } = createHud({ reducedMotion: false });
    table.cardInspected(RIVAL_PICK);
    void port.ask({ kind: 'foldConfirm', damage: 1 });
    expect(view.closeUp.value).toBeNull();
    expect(view.prompt.value).not.toBeNull();
  });

  it('follows the sealed hand card under the pointer', () => {
    const { table, view } = createHud({ reducedMotion: false });
    const hover = { cardId: 'baltasar', rect: { left: 447, top: 406, width: 182, height: 252 } };
    table.sealHovered(hover);
    expect(view.sealHover.value).toEqual(hover);
    table.sealHovered(null);
    expect(view.sealHover.value).toBeNull();
  });
});
