import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TitleScreen } from '@ui/organisms/TitleScreen';

const mount = () => {
  const onIntent = vi.fn();
  const onStart = vi.fn();
  render(<TitleScreen onIntent={onIntent} onStart={onStart} />);
  return { onIntent, onStart, play: screen.getByRole('button', { name: 'JUGAR' }) };
};

const FULLSCREEN_KEYS = ['fullscreenEnabled', 'fullscreenElement', 'exitFullscreen'];

const allowFullscreen = () => {
  let element: Element | null = null;
  const requestFullscreen = vi.fn(() => {
    element = document.documentElement;
    document.dispatchEvent(new Event('fullscreenchange'));
    return Promise.resolve();
  });
  const exitFullscreen = vi.fn(() => Promise.resolve());
  Object.defineProperties(document, {
    fullscreenEnabled: { configurable: true, value: true },
    fullscreenElement: { configurable: true, get: () => element },
    exitFullscreen: { configurable: true, value: exitFullscreen },
  });
  document.documentElement.requestFullscreen = requestFullscreen;
  return { requestFullscreen, exitFullscreen };
};

afterEach(() => {
  cleanup();
  for (const key of FULLSCREEN_KEYS) {
    Reflect.deleteProperty(document, key);
  }
  Reflect.deleteProperty(document.documentElement, 'requestFullscreen');
});

describe('the title screen', () => {
  it('shows the title over the background', () => {
    mount();
    expect(screen.getByRole('heading', { level: 1, name: 'MESA DE LAS VELAS' })).toBeTruthy();
    expect(document.querySelector('img')?.getAttribute('fetchpriority')).toBe('high');
  });

  it('deals the four menu cards with JUGAR described as a match against the AI', () => {
    mount();
    const menu = screen.getByRole('navigation', { name: 'Menú principal' });
    expect(menu.querySelectorAll('button')).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'JUGAR', description: 'Contra la IA' })).toBeTruthy();
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

  it('describes the hovered card under the fan', () => {
    const { play } = mount();
    fireEvent.mouseEnter(play);
    expect(screen.getByText(/baja al rival de 20 a 0 de vida/)).toBeTruthy();
    fireEvent.mouseLeave(play);
    expect(screen.queryByText(/baja al rival de 20 a 0 de vida/)).toBeNull();
  });

  it.each(['REGLAS', 'MAZO', 'AJUSTES'])(
    'keeps %s inert and announces it as coming soon',
    (name) => {
      const { onIntent, onStart } = mount();
      const card = screen.getByRole('button', { name });
      expect(card.getAttribute('aria-disabled')).toBe('true');
      fireEvent.click(card);
      fireEvent.focus(card);
      expect(onStart).not.toHaveBeenCalled();
      expect(onIntent).not.toHaveBeenCalled();
      expect(screen.getByText('PRÓXIMAMENTE')).toBeTruthy();
    },
  );

  it('hides the fullscreen toggle when the browser cannot go fullscreen', () => {
    mount();
    expect(screen.queryByRole('button', { name: 'Pantalla completa' })).toBeNull();
  });

  it('toggles fullscreen from the header', async () => {
    const { requestFullscreen, exitFullscreen } = allowFullscreen();
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Pantalla completa' }));
    expect(requestFullscreen).toHaveBeenCalledOnce();
    const exit = await screen.findByRole('button', { name: 'Salir de pantalla completa' });
    fireEvent.click(exit);
    expect(exitFullscreen).toHaveBeenCalledOnce();
  });
});
