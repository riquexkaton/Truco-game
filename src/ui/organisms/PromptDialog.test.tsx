import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, describe, expect, it } from 'vitest';

import type { Hud } from '@ui/hud/create-hud';
import { createHud } from '@ui/hud/create-hud';
import { PromptDialog } from '@ui/organisms/PromptDialog';

const mount = (hud: Hud) => {
  const Dialog = () => (
    <PromptDialog prompt={hud.view.prompt.value} timer={hud.view.promptTimer.value} />
  );
  return render(<Dialog />);
};

const askPactCall = (hud: Hud) =>
  hud.port.ask({
    kind: 'pactCall',
    range: { min: 4, max: 20 },
    timeout: { seconds: 15, answer: null },
  });

afterEach(() => {
  cleanup();
});

describe('the prompt dialog', () => {
  it('is a labelled dialog that focuses its first option', async () => {
    const hud = createHud({ reducedMotion: false });
    void hud.port.ask({ kind: 'foldConfirm' });
    mount(hud);
    expect(screen.getByRole('dialog', { name: '¿TE VAS?' })).toBeTruthy();
    const first = screen.getByRole('button', { name: 'ME VOY · −1' });
    await waitFor(() => {
      expect(document.activeElement).toBe(first);
    });
  });

  it('resolves the question with the clicked option', async () => {
    const hud = createHud({ reducedMotion: false });
    const answer = hud.port.ask({ kind: 'foldConfirm' });
    mount(hud);
    fireEvent.click(screen.getByRole('button', { name: 'SEGUIR' }));
    await expect(answer).resolves.toBe(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('clamps the wager between its minimum and maximum', async () => {
    const hud = createHud({ reducedMotion: false });
    const answer = askPactCall(hud);
    mount(hud);
    const input = screen.getByRole<HTMLInputElement>('spinbutton', {
      name: 'Valor de la apuesta, de 4 a 20',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Bajar' }));
    expect(input.value).toBe('4');
    fireEvent.input(input, { target: { value: '25' } });
    fireEvent.change(input);
    expect(input.value).toBe('20');
    fireEvent.input(input, { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: 'Subir' }));
    expect(input.value).toBe('8');
    fireEvent.keyDown(input, { key: 'Enter' });
    await expect(answer).resolves.toEqual({ kind: 'apuesta', amount: 8 });
  });

  it('bets everything with the FALTA chip', async () => {
    const hud = createHud({ reducedMotion: false });
    const answer = askPactCall(hud);
    mount(hud);
    fireEvent.click(screen.getByRole('button', { name: 'FALTA · 20' }));
    fireEvent.click(screen.getByRole('button', { name: 'APOSTAR' }));
    await expect(answer).resolves.toEqual({ kind: 'apuesta', amount: 20 });
  });

  it('shows the burning timer of timed questions', () => {
    const hud = createHud({ reducedMotion: false });
    void askPactCall(hud);
    mount(hud);
    expect(screen.getByRole('timer', { name: 'Quedan 15 segundos' })).toBeTruthy();
  });

  it('returns the index of the effect picked for discarding', async () => {
    const hud = createHud({ reducedMotion: false });
    const answer = hud.port.ask({ kind: 'discardEffect', effects: ['golpe', 'sello', 'saqueo'] });
    mount(hud);
    fireEvent.click(
      screen.getByRole('button', { name: 'SELLO: Anula el próximo efecto del rival.' }),
    );
    await expect(answer).resolves.toBe(1);
  });
});
