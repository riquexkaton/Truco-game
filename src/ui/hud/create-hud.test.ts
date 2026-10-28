import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { GameEvent } from '@application/ports/game-event';

import { createHud } from '@ui/hud/create-hud';

const settled = (promise: Promise<unknown>) => {
  const flag = { isDone: false };
  const track = async () => {
    await promise;
    flag.isDone = true;
  };
  void track();
  return flag;
};

const ANNULLED: GameEvent = { type: 'effectAnnulled', side: 'player' };
const TIED: GameEvent = { type: 'roundEnded', winner: null, stake: 2 };

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the HUD adapter', () => {
  it('shows queued banners in order and resolves each once it is gone', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const first = settled(port.notify(ANNULLED));
    const second = settled(port.notify(TIED));
    await vi.advanceTimersByTimeAsync(0);
    expect(view.banner.value?.title).toBe('ANULADO');
    expect(view.announcement.value).toBe('ANULADO. POR UN SELLO');
    await vi.advanceTimersByTimeAsync(1149);
    expect(first.isDone).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(first.isDone).toBe(true);
    expect(view.banner.value?.title).toBe('RONDA EMPATADA');
    await vi.advanceTimersByTimeAsync(1300);
    expect(second.isDone).toBe(true);
    expect(view.banner.value).toBeNull();
  });

  it('shortens banners under reduced motion', async () => {
    const { port, view } = createHud({ reducedMotion: true });
    const shown = settled(port.notify(TIED));
    await vi.advanceTimersByTimeAsync(0);
    expect(view.banner.value?.duration).toBe(700);
    await vi.advanceTimersByTimeAsync(700);
    expect(shown.isDone).toBe(true);
  });

  it('keeps at most three toasts, newest first, without waiting', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const events: GameEvent[] = [
      { type: 'ritualLost' },
      { type: 'pactRejected', by: 'rival', damage: 1 },
      { type: 'pactAccepted', by: 'rival', amount: 2 },
      { type: 'pactAnnulled', by: 'rival' },
    ];
    await Promise.all(events.map((event) => port.notify(event)));
    expect(view.toasts.value.map((toast) => toast.title)).toEqual([
      'PACTO ANULADO',
      'PACTO',
      'NO QUISO',
    ]);
    expect(view.toasts.value[0]?.duration).toBe(3500);
  });

  it('dismisses a toast after its exit animation', async () => {
    const { port, view } = createHud({ reducedMotion: true });
    await port.notify({ type: 'ritualLost' });
    const [toast] = view.toasts.value;
    view.dismissToast(toast?.id ?? 0);
    expect(view.toasts.value[0]?.leaving).toBe(true);
    await vi.advanceTimersByTimeAsync(300);
    expect(view.toasts.value).toEqual([]);
  });

  it('answers with the timeout answer when the clock runs out', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const answer = port.ask({
      kind: 'counterResponse',
      stake: 6,
      retireDamage: 4,
      timeout: { seconds: 10, answer: 'retire' },
    });
    expect(view.prompt.value?.spec.title).toBe('CONTRA-DESAFÍO');
    await vi.advanceTimersByTimeAsync(4000);
    expect(view.promptTimer.value).toEqual({ total: 10, left: 6 });
    await vi.advanceTimersByTimeAsync(6000);
    await expect(answer).resolves.toBe('retire');
    expect(view.prompt.value).toBeNull();
  });

  it('answers with the chosen option', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const answer = port.ask({ kind: 'foldConfirm' });
    expect(view.promptTimer.value).toBeNull();
    view.prompt.value?.choose(true);
    await expect(answer).resolves.toBe(true);
  });

  it('reveals a used effect and hides it afterwards', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const reveal = settled(port.notify({ type: 'effectUsed', side: 'player', effect: 'sello' }));
    expect(view.reveal.value).toMatchObject({ side: 'player', effect: 'sello', shown: true });
    expect(view.announcement.value).toBe('Usas SELLO');
    await vi.advanceTimersByTimeAsync(1700);
    expect(view.reveal.value?.shown).toBe(false);
    await vi.advanceTimersByTimeAsync(300);
    expect(reveal.isDone).toBe(true);
    expect(view.reveal.value).toBeNull();
  });

  it('marks life hits, turn strips and the end of the match', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify({ type: 'lifeChanged', side: 'rival', delta: -3, life: 17 });
    await port.notify({ type: 'turnStarted', side: 'rival' });
    expect(view.lifeHits.value.rival).toMatchObject({ delta: -3, hit: true });
    expect(view.strip.value?.side).toBe('rival');
    await vi.advanceTimersByTimeAsync(900);
    expect(view.lifeHits.value.rival?.hit).toBe(false);
    await port.notify({ type: 'matchOver', winner: 'player', life: 12, rounds: 3 });
    expect(view.gameOver.value?.title).toBe('VICTORIA');
    view.closeGameOver();
    expect(view.gameOver.value).toBeNull();
  });
});
