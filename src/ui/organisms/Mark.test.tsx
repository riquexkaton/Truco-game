import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';

import type { GameEvent } from '@application/ports/game-event';

import { createHud } from '@ui/hud/create-hud';
import { Mark } from '@ui/organisms/Mark';

const RAISE: GameEvent = {
  type: 'pactCalled',
  by: 'player',
  bet: { kind: 'repacto', amount: 4 },
  first: false,
};

const ANSWER: GameEvent = { type: 'pactAccepted', by: 'rival', amount: 4 };

const mount = () => {
  const hud = createHud({ reducedMotion: false });
  const View = () => <Mark mark={hud.view.mark.value} />;
  const { container } = render(<View />);
  return { hud, container };
};

const dotsIn = (container: Element) => container.querySelectorAll('.animate-dots');

afterEach(() => {
  cleanup();
});

describe('the mark', () => {
  it('pulses three dots while your call waits for the rival', async () => {
    const { hud, container } = mount();
    await hud.port.notify(RAISE);
    await screen.findByText('AVIVAS LA LLAMA · 4');
    expect(container.textContent).toBe('AVIVAS LA LLAMA · 4Quien pierda recibe 4.');
    expect(dotsIn(container)).toHaveLength(3);
  });

  it('shows the rival’s answer without dots', async () => {
    const { hud, container } = mount();
    await hud.port.notify(ANSWER);
    await screen.findByText('EL RIVAL QUISO');
    expect(dotsIn(container)).toHaveLength(0);
  });
});
