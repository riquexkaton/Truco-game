import { useEffect, useState } from 'preact/hooks';

import type { CardCycle, LoaderCard } from '@ui/art/loader-deck';
import { LOADER_CARDS, OPENING_CARD_INDEX } from '@ui/art/loader-deck';
import { cycleDelay, easePercent, nextCardIndex } from '@ui/organisms/loader-motion';
import { usePreloadedUrl } from '@ui/organisms/use-preloaded-url';

type LoaderPhase = 'shown' | 'leaving' | 'gone';

interface CycleState {
  readonly index: number;
  readonly previous: number | null;
}

const FADE_MS = 700;
const HOLD_MS = 450;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const isReducedMotionPreferred = (): boolean => globalThis.matchMedia(REDUCED_MOTION_QUERY).matches;

const OPENING_CYCLE: CycleState = { index: OPENING_CARD_INDEX, previous: null };

const cardAt = (index: number): LoaderCard => {
  const card = LOADER_CARDS[index];
  if (card === undefined) {
    throw new RangeError(`No loader card at ${String(index)}`);
  }
  return card;
};

export const useEasedPercent = (target: number): number => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let frame = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      const elapsed = last === null ? 0 : now - last;
      last = now;
      setShown((current) => easePercent(current, target, elapsed));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [target]);
  return shown;
};

export const useCardCycle = (percent: number): CardCycle => {
  const [cycle, setCycle] = useState(OPENING_CYCLE);
  const [isReducedMotion] = useState(isReducedMotionPreferred);
  const delay = cycleDelay(percent, isReducedMotion);
  const upcoming = nextCardIndex(cycle.index, LOADER_CARDS.length);
  const upcomingUrl = cardAt(upcoming).url;
  const isUpcomingReady = usePreloadedUrl(upcomingUrl) === upcomingUrl;
  useEffect(() => {
    if (!isUpcomingReady) return;
    const timer = setTimeout(() => {
      setCycle({ index: upcoming, previous: cycle.index });
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [cycle.index, delay, upcoming, isUpcomingReady]);
  const { previous } = cycle;
  return { active: cardAt(cycle.index), previous: previous === null ? null : cardAt(previous) };
};

export const useLoaderPhase = (isDone: boolean): LoaderPhase => {
  const [phase, setPhase] = useState<LoaderPhase>('shown');
  useEffect(() => {
    if (!isDone) return;
    const leave = setTimeout(() => {
      setPhase('leaving');
    }, HOLD_MS);
    const gone = setTimeout(() => {
      setPhase('gone');
    }, HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(leave);
      clearTimeout(gone);
    };
  }, [isDone]);
  return phase;
};
