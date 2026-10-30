import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';

import type { MatchState } from '@domain/match/match-state';
import { matchFixture, played, playedOf } from '@domain/match/match-fixture';

import type { PlayedCardPick } from '@application/ports/table-listener';

import { closeUpModel } from '@ui/copy/close-up-copy';
import { createHud } from '@ui/hud/create-hud';
import { CloseUp } from '@ui/organisms/CloseUp';

const DUEL_WON = matchFixture({
  vira: 'carnero',
  played: playedOf([played('gaspar')], [played('tobias')]),
  results: ['player'],
});

const RIVAL_PICK: PlayedCardPick = { side: 'rival', cardId: 'tobias', duel: 0 };
const DIALOG = { name: 'Duelo 1 de cerca' };

const mount = (state: MatchState = DUEL_WON) => {
  const hud = createHud({ reducedMotion: false });
  const View = () => (
    <CloseUp
      model={closeUpModel(state, hud.view.closeUp.value)}
      onShow={hud.view.showCloseUpSide}
      onClose={hud.view.closeCloseUp}
    />
  );
  render(<View />);
  return hud;
};

type Hud = ReturnType<typeof mount>;

const inspect = (hud: Hud, pick: PlayedCardPick = RIVAL_PICK) =>
  act(() => {
    hud.table.cardInspected(pick);
  });

const tab = (name: string) => screen.getByRole('button', { name });

const dialogText = () => screen.getByRole('dialog', DIALOG).textContent;

afterEach(() => {
  cleanup();
});

describe('the close-up of a duel', () => {
  it('opens on the picked card with a tab for each side', async () => {
    await inspect(mount());
    expect(dialogText()).toContain('TOBÍAS');
    expect(tab('RIVAL · 7').getAttribute('aria-pressed')).toBe('true');
    expect(tab('TÚ · 15').getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(tab('TÚ · 15'));
    expect(tab('TÚ · 15').getAttribute('aria-pressed')).toBe('true');
    expect(tab('RIVAL · 7').getAttribute('aria-pressed')).toBe('false');
  });

  it('explains the seal of a sealed card and marks who won the duel', async () => {
    await inspect(mount());
    expect(dialogText()).toContain(
      'CON SELLO · Si ganas el duelo con esta carta, tomas un efecto.',
    );
    expect(dialogText()).toContain('GANAS');
    expect(dialogText()).toContain('TOCA FUERA PARA CERRAR');
  });

  it('has no tabs while only one card of the duel is on the table', async () => {
    const alone = matchFixture({ played: playedOf([played('saul')], []) });
    await inspect(mount(alone), { side: 'player', cardId: 'saul', duel: 0 });
    expect(dialogText()).toContain('SAÚL');
    expect(dialogText()).not.toContain('CON SELLO');
    expect(screen.queryByRole('button', { name: /·/ })).toBeNull();
  });

  it('closes with Escape', async () => {
    await inspect(mount());
    fireEvent.keyDown(document.body, { key: 'Escape' });
    expect(screen.queryByRole('dialog', DIALOG)).toBeNull();
  });

  it('closes with a tap outside the card', async () => {
    await inspect(mount());
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(screen.queryByRole('dialog', DIALOG)).toBeNull();
  });

  it('closes when the table is cleared at the end of the round', async () => {
    const hud = mount();
    await inspect(hud);
    await act(() => {
      hud.table.tableCleared();
    });
    expect(screen.queryByRole('dialog', DIALOG)).toBeNull();
  });

  it('stays closed while a question waits for an answer', async () => {
    const hud = mount();
    await act(() => {
      void hud.port.ask({ kind: 'foldConfirm', damage: 1 });
    });
    await inspect(hud);
    expect(screen.queryByRole('dialog', DIALOG)).toBeNull();
  });

  it('shows nothing once the match is over', async () => {
    await inspect(mount({ ...DUEL_WON, over: true }));
    expect(screen.queryByRole('dialog', DIALOG)).toBeNull();
  });
});
