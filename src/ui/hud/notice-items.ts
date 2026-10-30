import type { Signal } from '@preact/signals';

import type { NoticeKind, NoticeOf } from '@ui/copy/notice';
import type { HudTiming } from '@ui/hud/hud-timing';
import { MARK_MS, NOTICE_MIN_MS, REVEAL_EXIT_MS, STRIP_MS } from '@ui/hud/hud-timing';
import type { HudSignals } from '@ui/hud/hud-view';
import type { QueueItem } from '@ui/hud/notice-queue';
import type { Voice } from '@ui/hud/voice';

interface ItemOutlets {
  readonly signals: HudSignals;
  readonly timing: HudTiming;
  readonly voice: Voice;
}

type QueuedKind = 'banner' | 'headline' | 'mark' | 'strip' | 'reveal';

type ItemOf<K extends NoticeKind> = (
  outlets: ItemOutlets,
  notice: NoticeOf<K>,
  id: number,
) => QueueItem;

const keepUp = (): void => undefined;

const clearIf = <T extends { readonly id: number }>(slot: Signal<T | null>, id: number): void => {
  if (slot.peek()?.id === id) slot.value = null;
};

const bannerItem: ItemOf<'banner'> = ({ signals, timing, voice }, notice, id) => {
  const duration = timing.banner(notice.banner.duration);
  return {
    duration,
    yields: false,
    show: () => {
      if (notice.clearsSheet) signals.headline.value = null;
      signals.banner.value = { ...notice.banner, duration, id };
      voice.say(notice.announcement);
    },
    hide: () => {
      clearIf(signals.banner, id);
    },
  };
};

const sheetItem: ItemOf<'headline'> = ({ signals, voice }, { headline, announcement }, id) => ({
  duration: NOTICE_MIN_MS,
  yields: false,
  show: () => {
    signals.headline.value = { id, headline, text: announcement };
    voice.say(announcement);
  },
  hide: keepUp,
});

const markItem: ItemOf<'mark'> = ({ signals, voice }, { mark, announcement }, id) => ({
  duration: MARK_MS,
  yields: false,
  show: () => {
    signals.mark.value = { ...mark, id };
    voice.say(announcement);
  },
  hide: () => {
    clearIf(signals.mark, id);
  },
});

const stripItem: ItemOf<'strip'> = ({ signals }, { side }, id) => ({
  duration: STRIP_MS,
  yields: true,
  show: () => {
    signals.strip.value = { id, side };
  },
  hide: () => {
    clearIf(signals.strip, id);
  },
});

const exitReveal = (signals: HudSignals, id: number): void => {
  const current = signals.reveal.peek();
  if (current?.id !== id) return;
  signals.reveal.value = { ...current, shown: false };
  setTimeout(() => {
    clearIf(signals.reveal, id);
  }, REVEAL_EXIT_MS);
};

const revealItem: ItemOf<'reveal'> = ({ signals, timing, voice }, notice, id) => ({
  duration: timing.reveal,
  yields: false,
  show: () => {
    const { side, effect, line } = notice;
    signals.reveal.value = { id, side, effect, line, annulled: false, shown: true };
    voice.say(notice.announcement);
  },
  hide: () => {
    exitReveal(signals, id);
  },
});

export const QUEUE_ITEMS: { readonly [K in QueuedKind]: ItemOf<K> } = {
  banner: bannerItem,
  headline: sheetItem,
  mark: markItem,
  strip: stripItem,
  reveal: revealItem,
};
