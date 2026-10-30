import type { Notice, NoticeKind, NoticeOf } from '@ui/copy/notice';
import type { HudTiming } from '@ui/hud/hud-timing';
import { HIT_MS } from '@ui/hud/hud-timing';
import type { HudSignals } from '@ui/hud/hud-view';
import { QUEUE_ITEMS } from '@ui/hud/notice-items';
import type { NoticeQueue } from '@ui/hud/notice-queue';
import type { Voice } from '@ui/hud/voice';

export type NoticeHandlers = {
  readonly [K in NoticeKind]: (notice: NoticeOf<K>) => Promise<void>;
};

export interface NoticeOutlets {
  readonly signals: HudSignals;
  readonly timing: HudTiming;
  readonly queue: NoticeQueue;
  readonly voice: Voice;
  readonly clearNotices: () => void;
}

const done = Promise.resolve();

const showLife = (
  { signals, voice }: NoticeOutlets,
  { side, delta, announcement }: NoticeOf<'life'>,
) => {
  const id = (signals.lifeHits.peek()[side]?.id ?? 0) + 1;
  signals.lifeHits.value = { ...signals.lifeHits.value, [side]: { id, delta, hit: delta < 0 } };
  voice.add(announcement);
  setTimeout(() => {
    const current = signals.lifeHits.value[side];
    if (current?.id !== id) return;
    signals.lifeHits.value = { ...signals.lifeHits.value, [side]: { ...current, hit: false } };
  }, HIT_MS);
  return done;
};

const annulReveal = (
  { signals, voice }: NoticeOutlets,
  { side, line, announcement }: NoticeOf<'annul'>,
) => {
  const current = signals.reveal.peek();
  if (current?.side === side) signals.reveal.value = { ...current, line, annulled: true };
  voice.say(announcement);
  return done;
};

const queuedHandlers = ({ signals, timing, queue, voice }: NoticeOutlets) => {
  let shown = 0;
  const outlets = { signals, timing, voice };
  const nextId = () => (shown += 1);
  return {
    banner: (notice: NoticeOf<'banner'>) =>
      queue.present(QUEUE_ITEMS.banner(outlets, notice, nextId())),
    headline: (notice: NoticeOf<'headline'>) =>
      queue.present(QUEUE_ITEMS.headline(outlets, notice, nextId())),
    mark: (notice: NoticeOf<'mark'>) => queue.present(QUEUE_ITEMS.mark(outlets, notice, nextId())),
    strip: (notice: NoticeOf<'strip'>) =>
      signals.prompt.peek() === null
        ? queue.present(QUEUE_ITEMS.strip(outlets, notice, nextId()))
        : done,
    reveal: (notice: NoticeOf<'reveal'>) =>
      queue.present(QUEUE_ITEMS.reveal(outlets, notice, nextId())),
  };
};

export const createNoticeHandlers = (outlets: NoticeOutlets): NoticeHandlers => {
  const { signals, voice } = outlets;
  return {
    ...queuedHandlers(outlets),
    annul: (notice) => annulReveal(outlets, notice),
    life: (notice) => showLife(outlets, notice),
    announce: ({ announcement }) => {
      voice.say(announcement);
      return done;
    },
    gameOver: ({ gameOver, announcement }) => {
      outlets.clearNotices();
      signals.gameOver.value = gameOver;
      voice.say(announcement);
      return done;
    },
    silent: () => done,
  };
};

export const dispatchNotice = (handlers: NoticeHandlers, notice: Notice): Promise<void> =>
  (handlers[notice.kind] as (notice: Notice) => Promise<void>)(notice);
