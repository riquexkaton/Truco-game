import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';

import type { GameEvent } from '@application/ports/game-event';

import { createHud } from '@ui/hud/create-hud';
import { Headline } from '@ui/organisms/Headline';

const ACCEPTED: GameEvent = { type: 'challengeAccepted', by: 'rival', stake: 4, holder: null };

const DUEL: GameEvent = {
  type: 'duelResolved',
  duel: 0,
  result: 'player',
  player: { cardId: 'gaspar', attack: 15 },
  rival: { cardId: 'tobias', attack: 7 },
  wins: { player: 1, rival: 0 },
};

const mount = () => {
  const hud = createHud({ reducedMotion: false });
  const View = () => (
    <Headline headline={hud.view.headline.value} onContinue={hud.view.dismissHeadline} />
  );
  render(<View />);
  return hud;
};

const LABEL = /Toca, haz clic o pulsa Espacio para seguir/;

afterEach(() => {
  cleanup();
});

describe('the headline', () => {
  it('tells the rival’s answer big and moves on when tapped', async () => {
    const hud = mount();
    const told = hud.port.notify(ACCEPTED);
    const card = await screen.findByRole('button', { name: LABEL });
    expect(card.getAttribute('aria-label')).toBe(
      'EL RIVAL ACEPTA. LA RONDA VALE 4. Toca, haz clic o pulsa Espacio para seguir.',
    );
    expect(card.textContent).toContain('TOCA PARA SEGUIR');
    expect(card.textContent).toContain('CLIC O ESPACIO PARA SEGUIR');
    fireEvent.click(card);
    await told;
    expect(screen.queryByRole('button', { name: LABEL })).toBeNull();
  });

  it.each([' ', 'Enter'])('moves on with the %j key', async (key) => {
    const hud = mount();
    const told = hud.port.notify(ACCEPTED);
    await screen.findByRole('button', { name: LABEL });
    fireEvent.keyDown(document.body, { key });
    await told;
    expect(hud.view.headline.value).toBeNull();
  });

  it('shows both duel cards with their attack', async () => {
    const hud = mount();
    void hud.port.notify(DUEL);
    const band = await screen.findByRole('button', { name: LABEL });
    expect(band.querySelectorAll('img')).toHaveLength(2);
    expect(band.textContent).toContain('DUELO GANADO');
    expect(band.textContent).toContain('Gaspar (15) vence a Tobías (7).');
    expect(band.textContent).toContain('LLEVAS 1 DE 3');
  });
});
