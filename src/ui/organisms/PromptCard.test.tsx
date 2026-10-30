import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/preact';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { PactAnswerQuestion } from '@application/ports/hud-port';

import type { Hud } from '@ui/hud/create-hud';
import { createHud } from '@ui/hud/create-hud';
import { PromptCard } from '@ui/organisms/PromptCard';

const mount = () => {
  const hud = createHud({ reducedMotion: false });
  const Card = () => (
    <PromptCard prompt={hud.view.prompt.value} timer={hud.view.promptTimer.value} />
  );
  render(<Card />);
  return hud;
};

const askPactCall = (hud: Hud) =>
  hud.port.ask({
    kind: 'pactCall',
    range: { min: 4, max: 20 },
    timeout: { seconds: 15, answer: null },
  });

const REPACT: PactAnswerQuestion = {
  kind: 'pactAnswer',
  bet: { kind: 'repacto', amount: 4 },
  previousAmount: 0,
  first: true,
  canRitual: false,
  canRepacto: false,
  range: { min: 5, max: 20 },
  timeout: { seconds: 10, answer: { kind: 'reject' } },
};

const button = (name: string) => screen.getByRole('button', { name });

afterEach(() => {
  cleanup();
});

describe('the prompt card', () => {
  it('is a labelled, non-modal card that focuses its first answer', async () => {
    const hud = mount();
    void hud.port.ask({ kind: 'foldConfirm', damage: 4 });
    const card = await screen.findByRole('dialog', { name: '¿TE VAS?' });
    expect(card.getAttribute('aria-modal')).toBeNull();
    expect(card.textContent).toContain('tú pierdes 4 de vida.');
    await waitFor(() => {
      expect(document.activeElement).toBe(button('ME VOY · −4'));
    });
  });

  it('resolves the question with the clicked answer and goes away', async () => {
    const hud = mount();
    const answer = hud.port.ask({ kind: 'foldConfirm', damage: 1 });
    fireEvent.click(await screen.findByRole('button', { name: 'SEGUIR' }));
    await expect(answer).resolves.toBe(false);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('voices a rival Desafío with its stakes and a retire countdown', async () => {
    const hud = mount();
    void hud.port.ask({
      kind: 'challengeResponse',
      stake: 4,
      counterStake: 6,
      retireDamage: 1,
      timeout: { seconds: 10, answer: 'retire' },
    });
    const card = await screen.findByRole('dialog', { name: 'DESAFÍO' });
    expect(card.textContent).toContain('El rival quiere que la ronda valga 4.');
    expect(screen.getByRole('timer', { name: 'Quedan 10 segundos' }).textContent).toContain(
      'TE RETIRAS EN 10 S',
    );
    expect(button('CONTRA · VALE 6').querySelector('kbd')?.textContent).toBe('2');
  });

  it('strikes the old stake of a Contra-desafío', async () => {
    const hud = mount();
    void hud.port.ask({
      kind: 'counterResponse',
      stake: 6,
      retireDamage: 4,
      timeout: { seconds: 10, answer: 'retire' },
    });
    const card = await screen.findByRole('dialog', { name: 'CONTRA-DESAFÍO' });
    expect(card.querySelector('s')?.textContent).toBe('4');
    expect(button('RETIRARSE · −4')).toBeTruthy();
  });

  it('swaps the answers for the stepper with SUBIR and restores them with VOLVER', async () => {
    const hud = mount();
    void hud.port.ask(REPACT);
    fireEvent.click(await screen.findByRole('button', { name: 'SUBIR' }));
    expect(screen.getByRole('dialog').textContent).toContain('Subes a 5 de daño.');
    expect(screen.queryByRole('button', { name: 'ACEPTAR' })).toBeNull();
    fireEvent.click(button('Subir apuesta'));
    expect(screen.getByRole('dialog').textContent).toContain('Subes a 6 de daño.');
    fireEvent.click(button('Volver a las respuestas'));
    expect(screen.queryByRole('spinbutton')).toBeNull();
    expect(screen.getByRole('dialog').textContent).toContain('«Quien pierda recibe 4 de daño.»');
    expect(button('RECHAZAR · −1')).toBeTruthy();
  });

  it('raises to the amount on the stepper', async () => {
    const hud = mount();
    const answer = hud.port.ask(REPACT);
    fireEvent.click(await screen.findByRole('button', { name: 'SUBIR' }));
    fireEvent.click(button('Subir apuesta'));
    fireEvent.click(button('SUBIR A 6'));
    await expect(answer).resolves.toEqual({ kind: 'raise', bet: { kind: 'apuesta', amount: 6 } });
  });

  it('keeps the Ritual beside the message and four answers in the row', async () => {
    const hud = mount();
    const answer = hud.port.ask({
      ...REPACT,
      bet: { kind: 'pacto', amount: 2 },
      canRitual: true,
      canRepacto: true,
    });
    const ritual = await screen.findByRole('button', { name: 'RITUAL · LO ANULA' });
    const keys = [...document.querySelectorAll('[data-answer] kbd')].map((kbd) => kbd.textContent);
    expect(keys).toEqual(['1', '2', '3', '4']);
    expect(button('RE-PACTO · 4').querySelector('kbd')?.textContent).toBe('3');
    fireEvent.click(ritual);
    await expect(answer).resolves.toEqual({ kind: 'ritual' });
  });

  it('answers with the number keys before the hand can play a card', async () => {
    const hud = mount();
    const playCard = vi.fn();
    globalThis.addEventListener('keydown', playCard);
    const answer = hud.port.ask(REPACT);
    await screen.findByRole('dialog');
    fireEvent.keyDown(document.body, { key: '2' });
    await expect(answer).resolves.toEqual({ kind: 'reject' });
    expect(playCard).not.toHaveBeenCalled();
    globalThis.removeEventListener('keydown', playCard);
  });

  it('opens the stepper with key 3 and leaves the digits to it', async () => {
    const hud = mount();
    void hud.port.ask(REPACT);
    await screen.findByRole('dialog');
    fireEvent.keyDown(document.body, { key: '3' });
    await screen.findByRole('spinbutton', { name: 'Valor de la apuesta, de 5 a 20' });
    fireEvent.keyDown(document.body, { key: '1' });
    expect(hud.view.prompt.value).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'ACEPTAR' })).toBeNull();
  });

  it('clamps a wager between its minimum and maximum', async () => {
    const hud = mount();
    const answer = askPactCall(hud);
    fireEvent.click(await screen.findByRole('button', { name: 'APOSTAR' }));
    const input = screen.getByRole<HTMLInputElement>('spinbutton', {
      name: 'Valor de la apuesta, de 4 a 20',
    });
    fireEvent.click(button('Bajar apuesta'));
    expect(input.value).toBe('4');
    fireEvent.input(input, { target: { value: '25' } });
    fireEvent.change(input);
    expect(input.value).toBe('20');
    fireEvent.input(input, { target: { value: '7' } });
    fireEvent.click(button('Subir apuesta'));
    expect(input.value).toBe('8');
    fireEvent.keyDown(input, { key: 'Enter' });
    await expect(answer).resolves.toEqual({ kind: 'apuesta', amount: 8 });
  });

  it('bets everything with FALTA and lets the player cancel instead', async () => {
    const hud = mount();
    const answer = askPactCall(hud);
    fireEvent.click(await screen.findByRole('button', { name: 'APOSTAR' }));
    fireEvent.click(button('FALTA · 20'));
    fireEvent.click(button('APOSTAR 20'));
    await expect(answer).resolves.toEqual({ kind: 'apuesta', amount: 20 });
    const cancelled = askPactCall(hud);
    fireEvent.click(await screen.findByRole('button', { name: 'CANCELAR' }));
    await expect(cancelled).resolves.toBeNull();
  });

  it('returns the index of the effect picked for discarding', async () => {
    const hud = mount();
    const answer = hud.port.ask({ kind: 'discardEffect', effects: ['golpe', 'sello', 'saqueo'] });
    fireEvent.click(
      await screen.findByRole('button', { name: 'SELLO: Anula el próximo efecto del rival.' }),
    );
    await expect(answer).resolves.toBe(1);
  });
});
