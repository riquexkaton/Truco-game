import { cleanup, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';

import { LifeCounter } from '@ui/molecules/LifeCounter';

afterEach(() => {
  cleanup();
});

describe('the life counter', () => {
  it('shows the life without a delta at first', () => {
    const { container } = render(<LifeCounter life={20} hit={null} size="player" />);
    expect(screen.getByText('20').className).toContain('text-white');
    expect(container.textContent).toBe('20');
  });

  it('flashes a hit and floats the lost amount', () => {
    render(<LifeCounter life={18} hit={{ id: 1, delta: -2, hit: true }} size="rival" />);
    expect(screen.getByText('18').className).toContain('text-hit');
    expect(screen.getByText('−2')).toBeTruthy();
  });

  it('floats healing without the hit flash', () => {
    render(<LifeCounter life={20} hit={{ id: 2, delta: 2, hit: false }} size="player" />);
    expect(screen.getByText('20').className).not.toContain('text-hit');
    expect(screen.getByText('+2')).toBeTruthy();
  });
});
