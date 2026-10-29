import { act, cleanup, render, screen } from '@testing-library/preact';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoadingScreen } from '@ui/organisms/LoadingScreen';

const progressValue = () =>
  Number(
    screen.getByRole('progressbar', { name: 'Cargando la mesa' }).getAttribute('aria-valuenow'),
  );

const wait = (ms: number) => {
  void act(() => {
    vi.advanceTimersByTime(ms);
  });
};

class LoadedImage extends EventTarget {
  #src = '';

  get src() {
    return this.#src;
  }

  set src(url: string) {
    this.#src = url;
    setTimeout(() => {
      this.dispatchEvent(new Event('load'));
    }, 0);
  }
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('the loading screen', () => {
  it('starts from zero while the candles are lit', () => {
    render(<LoadingScreen progress={0} isReady={false} />);
    expect(progressValue()).toBe(0);
    expect(screen.getByRole('status').textContent).toBe('ENCENDIENDO VELAS');
  });

  it('counts up to the real load without jumping ahead', () => {
    render(<LoadingScreen progress={0.5} isReady={false} />);
    wait(50);
    expect(progressValue()).toBeGreaterThan(0);
    expect(progressValue()).toBeLessThan(50);
    wait(3000);
    expect(progressValue()).toBe(50);
  });

  it('holds at 99 until the table is ready', () => {
    render(<LoadingScreen progress={1} isReady={false} />);
    wait(5000);
    expect(progressValue()).toBe(99);
    expect(screen.getByRole('status').textContent).toBe('ENCENDIENDO VELAS');
  });

  it('reaches 100, announces the table and fades away', () => {
    const { rerender } = render(<LoadingScreen progress={1} isReady={false} />);
    wait(3000);
    rerender(<LoadingScreen progress={1} isReady />);
    wait(300);
    expect(progressValue()).toBe(100);
    expect(screen.getByRole('status').textContent).toBe('MESA LISTA');
    wait(2000);
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('keeps the current card until the next art has loaded', () => {
    const { container } = render(<LoadingScreen progress={0.2} isReady={false} />);
    wait(900);
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('only mounts the cards it is showing once it shuffles', () => {
    vi.stubGlobal('Image', LoadedImage);
    const { container } = render(<LoadingScreen progress={0.2} isReady={false} />);
    expect(container.querySelectorAll('img')).toHaveLength(2);
    wait(1);
    wait(900);
    expect(container.querySelectorAll('img')).toHaveLength(4);
  });
});
