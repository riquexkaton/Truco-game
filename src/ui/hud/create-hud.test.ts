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

const ROUND: GameEvent = { type: 'roundStarted', round: 1, lead: 'player', vira: 'lirio' };
const RITUAL: GameEvent = { type: 'ritualSung', side: 'rival' };
const TIED: GameEvent = { type: 'roundEnded', winner: null, stake: 2 };
const REFUSED: GameEvent = { type: 'pactRejected', by: 'rival', damage: 1 };

const advance = (ms: number) => vi.advanceTimersByTimeAsync(ms);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the HUD adapter', () => {
  it('shows queued banners in order and resolves each once it is gone', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const first = settled(port.notify(ROUND));
    const second = settled(port.notify(RITUAL));
    await advance(0);
    expect(view.banner.value?.title).toBe('RONDA 1');
    await advance(1499);
    expect(first.isDone).toBe(false);
    await advance(1);
    expect(first.isDone).toBe(true);
    expect(view.banner.value?.title).toBe('RITUAL');
    await advance(1600);
    expect(second.isDone).toBe(true);
    expect(view.banner.value).toBeNull();
  });

  it('shortens banners under reduced motion', async () => {
    const { port, view } = createHud({ reducedMotion: true });
    const shown = settled(port.notify(ROUND));
    await advance(0);
    expect(view.banner.value?.duration).toBe(700);
    await advance(700);
    expect(shown.isDone).toBe(true);
  });

  it('reads headlines out one at a time, in order', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const first = settled(port.notify(TIED));
    const second = settled(port.notify(REFUSED));
    await advance(0);
    expect(view.headline.value).toMatchObject({ text: 'RONDA EMPATADA. NADIE RECIBE DAÑO.' });
    expect(view.announcement.value).toBe('RONDA EMPATADA. NADIE RECIBE DAÑO.');
    await advance(3499);
    expect(first.isDone).toBe(false);
    await advance(1);
    expect(first.isDone).toBe(true);
    expect(view.headline.value?.headline.title).toBe('NO QUISO');
    expect(second.isDone).toBe(false);
  });

  it('moves on by itself after a reading time that grows with the text', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const told = settled(port.notify(REFUSED));
    await advance(0);
    expect(view.headline.value?.duration).toBe(4200);
    await advance(4199);
    expect(told.isDone).toBe(false);
    await advance(1);
    expect(told.isDone).toBe(true);
    expect(view.headline.value).toBeNull();
  });

  it('closes a headline early without letting its timer close the next one', async () => {
    const { port, view } = createHud({ reducedMotion: true });
    const first = settled(port.notify(TIED));
    await advance(1000);
    view.dismissHeadline();
    await advance(0);
    expect(first.isDone).toBe(true);
    expect(view.headline.value).toBeNull();
    view.dismissHeadline();
    const second = settled(port.notify(REFUSED));
    await advance(2500);
    expect(view.headline.value?.headline.title).toBe('NO QUISO');
    expect(second.isDone).toBe(false);
  });

  it('keeps a headline waiting until the banner before it is gone', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    void port.notify(ROUND);
    const told = settled(port.notify(TIED));
    await advance(1499);
    expect(view.headline.value).toBeNull();
    await advance(1);
    expect(view.banner.value).toBeNull();
    expect(view.headline.value?.headline.title).toBe('RONDA EMPATADA');
    expect(told.isDone).toBe(false);
  });

  it('shows small marks without waiting and drops them after a while', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify({ type: 'ritualLost' });
    expect(view.mark.value?.title).toBe('RITUAL PERDIDO');
    await port.notify({ type: 'challengeCalled', by: 'player', level: 1 });
    expect(view.mark.value).toMatchObject({ title: 'DESAFÍO', tone: 'lose' });
    expect(view.announcement.value).toBe('DESAFÍO. LA RONDA PASARÍA A VALER 4.');
    await advance(2799);
    expect(view.mark.value?.title).toBe('DESAFÍO');
    await advance(1);
    expect(view.mark.value).toBeNull();
  });

  it('answers with the timeout answer when the clock runs out', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const answer = port.ask({
      kind: 'counterResponse',
      stake: 6,
      retireDamage: 4,
      timeout: { seconds: 10, answer: 'retire' },
    });
    expect(view.prompt.value?.spec.seal).toBe('CONTRA-DESAFÍO');
    await advance(4000);
    expect(view.promptTimer.value).toEqual({ total: 10, left: 6 });
    await advance(6000);
    await expect(answer).resolves.toBe('retire');
    expect(view.prompt.value).toBeNull();
  });

  it('answers with the chosen option', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const answer = port.ask({ kind: 'foldConfirm', damage: 1 });
    expect(view.promptTimer.value).toBeNull();
    view.prompt.value?.choose(true);
    await expect(answer).resolves.toBe(true);
  });

  it('reveals the player’s own effect and hides it afterwards', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const reveal = settled(port.notify({ type: 'effectUsed', side: 'player', effect: 'sello' }));
    expect(view.reveal.value).toMatchObject({ side: 'player', effect: 'sello', shown: true });
    expect(view.announcement.value).toBe('Usas SELLO');
    await advance(1700);
    expect(view.reveal.value?.shown).toBe(false);
    await advance(300);
    expect(reveal.isDone).toBe(true);
    expect(view.reveal.value).toBeNull();
  });

  it('marks life hits, turn strips and the end of the match', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify({ type: 'lifeChanged', side: 'rival', delta: -3, life: 17 });
    await port.notify({ type: 'turnStarted', side: 'rival' });
    expect(view.lifeHits.value.rival).toMatchObject({ delta: -3, hit: true });
    expect(view.strip.value?.side).toBe('rival');
    await advance(900);
    expect(view.lifeHits.value.rival?.hit).toBe(false);
    await port.notify({ type: 'matchOver', winner: 'player', life: 12, rounds: 3 });
    expect(view.gameOver.value?.title).toBe('VICTORIA');
    view.closeGameOver();
    expect(view.gameOver.value).toBeNull();
  });
});
