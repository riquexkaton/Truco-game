import { signal } from '@preact/signals';
import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';

import { TableControlsContainer } from '@ui/containers/TableControlsContainer';

const createToggle = () => {
  const choice = signal(true);
  return {
    isEnabled: choice,
    toggle: () => {
      choice.value = !choice.value;
    },
  };
};

const mount = () => {
  render(<TableControlsContainer music={createToggle()} sfx={createToggle()} />);
};

afterEach(() => {
  cleanup();
});

describe('the table controls', () => {
  it.each(['Música', 'Efectos de sonido'])('offers the %s toggle during the match', (name) => {
    mount();
    const toggle = screen.getByRole('button', { name });
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });

  it.each(['Música', 'Efectos de sonido'])(
    'reflects the %s choice after each toggle',
    async (name) => {
      mount();
      const toggle = screen.getByRole('button', { name });
      fireEvent.click(toggle);
      expect(await screen.findByRole('button', { name, pressed: false })).toBeTruthy();
      fireEvent.click(toggle);
      expect(await screen.findByRole('button', { name, pressed: true })).toBeTruthy();
    },
  );

  it('keeps the music and the sound effects independent', async () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Efectos de sonido' }));
    expect(
      await screen.findByRole('button', { name: 'Efectos de sonido', pressed: false }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Música', pressed: true })).toBeTruthy();
  });
});
