import type { Notice, NoticeKind, NoticeOf } from '@ui/copy/notice';
import type { HudTiming } from '@ui/hud/hud-timing';
import { delay, HIT_MS, REVEAL_EXIT_MS } from '@ui/hud/hud-timing';
import type { HudSignals } from '@ui/hud/hud-view';

export type NoticeHandlers = {
  readonly [K in NoticeKind]: (notice: NoticeOf<K>) => Promise<void>;
};

interface NoticeOutlets {
  readonly signals: HudSignals;
  readonly timing: HudTiming;
}

const done = Promise.resolve();

const revealEffect = async (
  { signals, timing }: NoticeOutlets,
  { side, effect, announcement }: NoticeOf<'reveal'>,
  id: number,
): Promise<void> => {
  signals.reveal.value = { id, side, effect, shown: true };
  signals.announcement.value = announcement;
  await delay(timing.reveal);
  signals.reveal.value = { id, side, effect, shown: false };
  await delay(REVEAL_EXIT_MS);
  signals.reveal.value = null;
};

const showLife = (signals: HudSignals, { side, delta, announcement }: NoticeOf<'life'>) => {
  const id = (signals.lifeHits.peek()[side]?.id ?? 0) + 1;
  signals.lifeHits.value = { ...signals.lifeHits.value, [side]: { id, delta, hit: delta < 0 } };
  signals.announcement.value = announcement;
  setTimeout(() => {
    const current = signals.lifeHits.value[side];
    if (current?.id !== id) return;
    signals.lifeHits.value = { ...signals.lifeHits.value, [side]: { ...current, hit: false } };
  }, HIT_MS);
  return done;
};

export const createNoticeHandlers = (
  outlets: NoticeOutlets,
  show: Pick<NoticeHandlers, 'banner' | 'toast'>,
): NoticeHandlers => {
  const { signals } = outlets;
  let shown = 0;
  const nextId = () => (shown += 1);
  return {
    ...show,
    strip: ({ side }) => {
      signals.strip.value = { id: nextId(), side };
      return done;
    },
    reveal: (notice) => revealEffect(outlets, notice, nextId()),
    life: (notice) => showLife(signals, notice),
    announce: ({ announcement }) => {
      signals.announcement.value = announcement;
      return done;
    },
    gameOver: ({ gameOver, announcement }) => {
      signals.gameOver.value = gameOver;
      signals.announcement.value = announcement;
      return done;
    },
    silent: () => done,
  };
};

export const dispatchNotice = (handlers: NoticeHandlers, notice: Notice): Promise<void> =>
  (handlers[notice.kind] as (notice: Notice) => Promise<void>)(notice);
