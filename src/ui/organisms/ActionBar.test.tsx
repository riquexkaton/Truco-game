import { cleanup, fireEvent, render, screen } from '@testing-library/preact';
import { useState } from 'preact/hooks';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { MenuItemCopy } from '@ui/copy/action-copy';
import { challengeItemCopy, pactItemCopy, RITUAL_ITEM } from '@ui/copy/action-copy';
import { ActionBar } from '@ui/organisms/ActionBar';
import type { ActionBarHandlers, ActionBarModel, MenuAction } from '@ui/organisms/action-model';

const action = (copy: MenuItemCopy, isEnabled: boolean, isVisible = true): MenuAction => ({
  copy,
  isEnabled,
  isVisible,
});

const modelWith = (overrides: Partial<ActionBarModel> = {}): ActionBarModel => ({
  canFold: true,
  foldDamage: 1,
  isTurn: true,
  challenge: action(challengeItemCopy({ level: 0, holder: null, stake: 2 }), true),
  pact: action(pactItemCopy({ ritualSung: false, pendingAmount: null }), true),
  ritual: action(RITUAL_ITEM, false, false),
  pactAmount: null,
  roundStake: null,
  ...overrides,
});

const handlersFor = (): ActionBarHandlers => ({
  onFold: vi.fn(),
  onChallenge: vi.fn(),
  onPact: vi.fn(),
  onRitual: vi.fn(),
});

const mount = (model: ActionBarModel) => {
  const handlers = handlersFor();
  const Harness = () => {
    const [isOpen, setOpen] = useState(false);
    return <ActionBar model={model} handlers={handlers} isOpen={isOpen} onOpenChange={setOpen} />;
  };
  render(<Harness />);
  return handlers;
};

const cantar = () => screen.getByRole('button', { name: 'Cantar: Ritual, Pacto o Desafío' });

afterEach(() => {
  cleanup();
});

describe('the action bar', () => {
  it('disables the controls the player cannot use', () => {
    const closed = action(challengeItemCopy({ level: 0, holder: null, stake: 2 }), false);
    mount(modelWith({ canFold: false, challenge: closed, pact: { ...closed, isVisible: false } }));
    expect(
      screen.getByRole<HTMLButtonElement>('button', {
        name: 'Me voy: abandonas la ronda y pierdes 1 de vida',
      }).disabled,
    ).toBe(true);
    expect(cantar().hasAttribute('disabled')).toBe(true);
  });

  it('tells what folding costs once the round is raised', () => {
    mount(modelWith({ foldDamage: 6 }));
    expect(
      screen.getByRole('button', { name: 'Me voy: abandonas la ronda y pierdes 6 de vida' }),
    ).toBeTruthy();
  });

  it('opens the Cantar menu and reflects it in aria-expanded', () => {
    mount(modelWith());
    expect(cantar().getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(cantar());
    expect(cantar().getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menu', { name: 'Cantar' })).toBeTruthy();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });

  it('closes the menu with Escape and with a click outside', () => {
    mount(modelWith());
    fireEvent.click(cantar());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(cantar().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(cantar());
    fireEvent.click(cantar());
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('names the counter challenge when the player holds the word', () => {
    const contra = action(challengeItemCopy({ level: 1, holder: 'player', stake: 4 }), true);
    mount(modelWith({ challenge: contra }));
    fireEvent.click(cantar());
    const item = screen.getByRole('menuitem', {
      name: 'La ronda vale 4. Contra-desafío: subirla a 6',
    });
    expect(item.textContent).toContain('CONTRA');
    expect(item.textContent).toContain('VALE 6');
  });

  it('runs the chosen call and closes the menu', () => {
    const handlers = mount(modelWith({ ritual: action(RITUAL_ITEM, true) }));
    fireEvent.click(cantar());
    fireEvent.click(screen.getByRole('menuitem', { name: RITUAL_ITEM.description }));
    expect(handlers.onRitual).toHaveBeenCalledOnce();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('shows the stakes in play while the menu is closed', () => {
    mount(modelWith({ pactAmount: 4, roundStake: 6 }));
    expect(screen.getByText('PACTO · 4')).toBeTruthy();
    expect(screen.getByText('RONDA · VALE 6')).toBeTruthy();
  });
});
