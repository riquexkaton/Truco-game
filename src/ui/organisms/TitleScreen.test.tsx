import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TitleScreen } from '@ui/organisms/TitleScreen';

const mount = () => {
  const onIntent = vi.fn();
  const onStart = vi.fn();
  render(<TitleScreen onIntent={onIntent} onStart={onStart} />);
  return { onIntent, onStart, play: screen.getByRole('button', { name: 'JUGAR' }) };
};

afterEach(() => {
  cleanup();
});

describe('the title screen', () => {
  it('shows the title over the background', () => {
    mount();
    expect(screen.getByRole('heading', { level: 1, name: 'MESA DE LAS VELAS' })).toBeTruthy();
    expect(document.querySelector('img')?.getAttribute('fetchpriority')).toBe('high');
  });

  it.each([
    ['pointer enter', (button: HTMLElement) => fireEvent.pointerEnter(button)],
    ['focus', (button: HTMLElement) => fireEvent.focus(button)],
    ['touch start', (button: HTMLElement) => fireEvent.touchStart(button)],
  ])('prefetches the table on %s', (_, intent) => {
    const { onIntent, onStart, play } = mount();
    intent(play);
    expect(onIntent).toHaveBeenCalledOnce();
    expect(onStart).not.toHaveBeenCalled();
  });

  it('starts the game on click', () => {
    const { onStart, play } = mount();
    fireEvent.click(play);
    expect(onStart).toHaveBeenCalledOnce();
  });
});
