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

const ROUND: GameEvent = { type: 'roundStarted', round: 2, lead: 'player', vira: 'lirio' };
const RITUAL: GameEvent = { type: 'ritualSung', side: 'rival', annulsPact: false };
const WON: GameEvent = { type: 'roundEnded', winner: 'player', stake: 2 };
const LOST_MARK: GameEvent = { type: 'ritualLost' };
const CALLED: GameEvent = { type: 'challengeCalled', by: 'player', level: 1 };
const REVEALED: GameEvent = {
  type: 'pactRevealed',
  winner: 'rival',
  amount: 2,
  playerValue: 27,
  rivalValue: 31,
};

const advance = (ms: number) => vi.advanceTimersByTimeAsync(ms);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the HUD notice queue', () => {
  it('resolves a notice as soon as it appears, not when it closes', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    const shown = settled(port.notify(WON));
    await advance(0);
    expect(shown.isDone).toBe(true);
    expect(view.banner.value).toMatchObject({ title: 'GANAS LA RONDA', duration: 1400 });
    expect(view.announcement.value).toBe('GANAS LA RONDA. EL RIVAL PIERDE 2');
    await advance(1399);
    expect(view.banner.value?.title).toBe('GANAS LA RONDA');
    await advance(1);
    expect(view.banner.value).toBeNull();
  });

  it('keeps each notice up for 1.2 s before the next one replaces it', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    void port.notify(ROUND);
    const second = settled(port.notify(RITUAL));
    await advance(1199);
    expect(view.banner.value?.title).toBe('RONDA 2');
    expect(second.isDone).toBe(false);
    await advance(1);
    expect(second.isDone).toBe(true);
    expect(view.banner.value?.title).toBe('RITUAL');
  });

  it('only cuts a notice short when another one is waiting', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify(LOST_MARK);
    await advance(2000);
    expect(view.mark.value?.title).toBe('RITUAL PERDIDO');
    const next = settled(port.notify(CALLED));
    await advance(0);
    expect(next.isDone).toBe(true);
    expect(view.mark.value).toMatchObject({ title: 'DESAFÍO', tone: 'lose' });
    await advance(2799);
    expect(view.mark.value?.title).toBe('DESAFÍO');
    await advance(1);
    expect(view.mark.value).toBeNull();
  });

  it('shortens banners under reduced motion', async () => {
    const { port, view } = createHud({ reducedMotion: true });
    await port.notify(ROUND);
    expect(view.banner.value?.duration).toBe(700);
    await advance(700);
    expect(view.banner.value).toBeNull();
  });

  it('lets a turn strip give way at once', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify({ type: 'turnStarted', side: 'player' });
    expect(view.strip.value?.side).toBe('player');
    await port.notify(LOST_MARK);
    expect(view.strip.value).toBeNull();
    expect(view.mark.value?.title).toBe('RITUAL PERDIDO');
  });

  it('drops every waiting notice when a question opens', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    void port.notify(ROUND);
    const dropped = settled(port.notify(RITUAL));
    void port.ask({ kind: 'foldConfirm', damage: 1 });
    await advance(0);
    expect(dropped.isDone).toBe(true);
    expect(view.banner.value).toBeNull();
    await advance(3000);
    expect(view.banner.value).toBeNull();
  });

  it('drops the turn strip while a question is on screen', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify({ type: 'turnStarted', side: 'rival' });
    void port.ask({ kind: 'foldConfirm', damage: 1 });
    expect(view.strip.value).toBeNull();
    await port.notify({ type: 'turnStarted', side: 'player' });
    expect(view.strip.value).toBeNull();
    view.prompt.value?.choose(false);
    await port.notify({ type: 'turnStarted', side: 'player' });
    expect(view.strip.value?.side).toBe('player');
  });
});

describe('the HUD notices', () => {
  it('keeps the Pacto sheet up until the next round starts', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify(REVEALED);
    expect(view.headline.value?.headline.title).toBe('PACTO PERDIDO');
    const strip = settled(port.notify(WON));
    await advance(1200);
    expect(strip.isDone).toBe(true);
    expect(view.banner.value?.title).toBe('GANAS LA RONDA');
    await advance(5000);
    expect(view.headline.value?.headline.title).toBe('PACTO PERDIDO');
    await port.notify(ROUND);
    expect(view.headline.value).toBeNull();
  });

  it('reads the life hit after the notice that brought it, not instead of it', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify(WON);
    await port.notify({ type: 'lifeChanged', side: 'rival', delta: -2, life: 18 });
    expect(view.announcement.value).toBe('GANAS LA RONDA. EL RIVAL PIERDE 2. Vida del rival: 18.');
    await advance(1000);
    await port.notify({ type: 'lifeChanged', side: 'player', delta: 2, life: 20 });
    expect(view.announcement.value).toBe('Tu vida: 20');
  });

  it('closes the Pacto sheet early when tapped', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify(REVEALED);
    view.dismissHeadline();
    expect(view.headline.value).toBeNull();
  });

  it('reveals the player’s own effect without waiting and hides it afterwards', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify({ type: 'effectUsed', side: 'player', effect: 'sello' });
    expect(view.reveal.value).toMatchObject({ side: 'player', effect: 'sello', shown: true });
    expect(view.announcement.value).toBe('Usas SELLO');
    await advance(1700);
    expect(view.reveal.value?.shown).toBe(false);
    await advance(300);
    expect(view.reveal.value).toBeNull();
  });

  it('stamps a rival effect annulled by the player’s Sello on the same card', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify({ type: 'effectUsed', side: 'rival', effect: 'golpe' });
    expect(view.reveal.value).toMatchObject({ side: 'rival', annulled: false });
    await port.notify({ type: 'effectAnnulled', side: 'rival' });
    expect(view.reveal.value).toMatchObject({ annulled: true, line: 'Tu Sello lo anula.' });
    expect(view.announcement.value).toBe('ANULADO. Tu Sello lo anula.');
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

  it('marks life hits and ends the match over a clean table', async () => {
    const { port, view } = createHud({ reducedMotion: false });
    await port.notify({ type: 'lifeChanged', side: 'rival', delta: -3, life: 17 });
    expect(view.lifeHits.value.rival).toMatchObject({ delta: -3, hit: true });
    await advance(900);
    expect(view.lifeHits.value.rival?.hit).toBe(false);
    await port.notify(REVEALED);
    await port.notify({ type: 'matchOver', winner: 'player', life: 12, rounds: 3 });
    expect(view.headline.value).toBeNull();
    expect(view.gameOver.value?.title).toBe('VICTORIA');
    view.closeGameOver();
    expect(view.gameOver.value).toBeNull();
  });
});
