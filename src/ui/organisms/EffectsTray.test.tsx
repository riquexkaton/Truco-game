import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { EffectId } from '@domain/effects/effect';
import type { EffectBlock } from '@domain/match/gates';

import { EffectsTray } from '@ui/organisms/EffectsTray';

interface Entry {
  readonly effect: EffectId;
  readonly block: EffectBlock | null;
}

const GOLPE: Entry = { effect: 'golpe', block: null };
const SELLO: Entry = { effect: 'sello', block: null };

const mount = (effects: readonly Entry[] = [GOLPE, SELLO]) => {
  const onUse = vi.fn();
  const tray = (promptId: number | null, shown = effects) => (
    <EffectsTray effects={shown} promptId={promptId} onUse={onUse} />
  );
  const { rerender } = render(tray(null));
  return {
    onUse,
    update: (promptId: number | null, shown = effects) => {
      rerender(tray(promptId, shown));
    },
  };
};

const card = (name: string) => screen.getByRole('button', { name: new RegExp(`^${name}:`) });

const tap = (element: HTMLElement) => {
  fireEvent.pointerDown(element, { pointerType: 'touch' });
  fireEvent.click(element);
};

const press = (element: HTMLElement) => {
  fireEvent.pointerDown(element, { pointerType: 'mouse' });
  fireEvent.click(element);
};

const pinned = (name: string) => screen.queryByRole('dialog', { name });

afterEach(() => {
  cleanup();
});

describe('the effects tray on touch', () => {
  it('lifts the card and opens its tip on the first tap without using it', () => {
    const { onUse } = mount();
    tap(card('GOLPE'));
    expect(onUse).not.toHaveBeenCalled();
    expect(pinned('GOLPE')?.textContent).toContain('2 de daño al campeón rival.');
    expect(card('GOLPE').getAttribute('aria-describedby')).toBe('effect-tip-text');
    expect(screen.getByRole('button', { name: 'USAR GOLPE' })).toBeTruthy();
  });

  it('uses the effect on a second tap of the lifted card', () => {
    const { onUse } = mount();
    tap(card('GOLPE'));
    tap(card('GOLPE'));
    expect(onUse).toHaveBeenCalledExactlyOnceWith('golpe');
    expect(pinned('GOLPE')).toBeNull();
  });

  it('uses the effect from USAR', () => {
    const { onUse } = mount();
    tap(card('SELLO'));
    fireEvent.click(screen.getByRole('button', { name: 'USAR SELLO' }));
    expect(onUse).toHaveBeenCalledExactlyOnceWith('sello');
  });

  it('closes the tip on a tap outside the tray', () => {
    const { onUse } = mount();
    tap(card('GOLPE'));
    fireEvent.pointerDown(document.body, { pointerType: 'touch' });
    expect(pinned('GOLPE')).toBeNull();
    expect(onUse).not.toHaveBeenCalled();
  });

  it('switches to another card when it is tapped', () => {
    const { onUse } = mount();
    tap(card('GOLPE'));
    tap(card('SELLO'));
    expect(pinned('GOLPE')).toBeNull();
    expect(pinned('SELLO')).toBeTruthy();
    expect(onUse).not.toHaveBeenCalled();
  });

  it('closes when a question appears and stays closed after it', () => {
    const { update } = mount();
    tap(card('GOLPE'));
    update(4);
    expect(pinned('GOLPE')).toBeNull();
    update(null);
    expect(pinned('GOLPE')).toBeNull();
  });

  it('closes when the tray changes', () => {
    const { update } = mount();
    tap(card('SELLO'));
    update(null, [SELLO]);
    expect(pinned('SELLO')).toBeNull();
  });
});

describe('an effect that cannot be used now', () => {
  it.each<[EffectBlock, string]>([
    ['turn', 'Úsala en tu turno, antes de jugar tu carta.'],
    ['used', 'Ya usaste un efecto este turno.'],
    ['noPlunderTarget', 'El rival no tiene cartas en la mano.'],
  ])('shows why (%s) and cannot be used', (block, reason) => {
    const { onUse } = mount([{ effect: 'saqueo', block }]);
    const saqueo = card('SAQUEO');
    expect(saqueo.getAttribute('aria-disabled')).toBe('true');
    tap(saqueo);
    expect(screen.getByRole('tooltip').textContent).toContain(reason);
    expect(screen.queryByRole('button', { name: 'USAR SAQUEO' })).toBeNull();
    tap(saqueo);
    press(saqueo);
    fireEvent.click(saqueo);
    expect(onUse).not.toHaveBeenCalled();
    expect(screen.getByRole('tooltip').textContent).toContain(reason);
  });
});

describe('the effects tray with a mouse or keyboard', () => {
  it('shows the tip on hover, without USAR, and hides it on leave', async () => {
    mount();
    fireEvent.pointerEnter(card('GOLPE'), { pointerType: 'mouse' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    const tip = await screen.findByRole('tooltip');
    expect(tip.textContent).toContain('2 de daño al campeón rival.');
    expect(screen.queryByRole('button', { name: 'USAR GOLPE' })).toBeNull();
    fireEvent.pointerLeave(card('GOLPE'), { pointerType: 'mouse' });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('uses the effect in one click', () => {
    const { onUse } = mount();
    press(card('GOLPE'));
    expect(onUse).toHaveBeenCalledExactlyOnceWith('golpe');
  });

  it('shows the tip on keyboard focus and uses the effect with Enter', async () => {
    const { onUse } = mount();
    fireEvent.focus(card('SELLO'));
    const tip = await screen.findByRole('tooltip');
    expect(tip.textContent).toContain('SELLO');
    fireEvent.click(card('SELLO'));
    expect(onUse).toHaveBeenCalledExactlyOnceWith('sello');
  });
});
