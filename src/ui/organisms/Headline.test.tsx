import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';

import type { GameEvent } from '@application/ports/game-event';

import { createHud } from '@ui/hud/create-hud';
import { Headline } from '@ui/organisms/Headline';

const REVEALED: GameEvent = {
  type: 'pactRevealed',
  winner: 'player',
  amount: 4,
  playerValue: 31,
  rivalValue: 27,
};

const mount = () => {
  const hud = createHud({ reducedMotion: false });
  const View = () => (
    <Headline headline={hud.view.headline.value} onClose={hud.view.dismissHeadline} />
  );
  render(<View />);
  return hud;
};

const LABEL = /Toca para cerrar/;

afterEach(() => {
  cleanup();
});

describe('the Pacto sheet', () => {
  it('shows the result without asking to be tapped through', async () => {
    const hud = mount();
    await hud.port.notify(REVEALED);
    const sheet = await screen.findByRole('button', { name: LABEL });
    expect(sheet.getAttribute('aria-label')).toBe(
      'PACTO GANADO. Tu Pacto: 31. El del rival: 27. EL RIVAL PIERDE 4. Toca para cerrar.',
    );
    expect(sheet.textContent).not.toContain('PARA SEGUIR');
    expect(sheet.textContent).toContain('EL RIVAL PIERDE 4');
  });

  it('closes early when tapped', async () => {
    const hud = mount();
    await hud.port.notify(REVEALED);
    fireEvent.click(await screen.findByRole('button', { name: LABEL }));
    expect(screen.queryByRole('button', { name: LABEL })).toBeNull();
  });
});
