export interface QueueItem {
  readonly duration: number;
  readonly yields: boolean;
  readonly show: () => void;
  readonly hide: () => void;
}

export interface NoticeQueue {
  readonly present: (item: QueueItem) => Promise<void>;
  readonly clear: () => void;
}

interface Waiting {
  readonly item: QueueItem;
  readonly shown: () => void;
}

interface Showing {
  readonly item: QueueItem;
  isPastMinimum: boolean;
  timer: ReturnType<typeof setTimeout> | undefined;
}

interface QueueState {
  readonly minimumMs: number;
  readonly waiting: Waiting[];
  showing: Showing | null;
}

const takeDown = (state: QueueState): void => {
  const { showing } = state;
  if (showing === null) return;
  clearTimeout(showing.timer);
  showing.item.hide();
  state.showing = null;
};

const minimumOf = (state: QueueState, item: QueueItem): number =>
  item.yields ? 0 : Math.min(state.minimumMs, item.duration);

const advance = (state: QueueState): void => {
  takeDown(state);
  const next = state.waiting.shift();
  if (next === undefined) return;
  const showing: Showing = { item: next.item, isPastMinimum: false, timer: undefined };
  state.showing = showing;
  next.item.show();
  next.shown();
  showing.timer = setTimeout(
    () => {
      reachMinimum(state, showing);
    },
    minimumOf(state, next.item),
  );
};

const reachMinimum = (state: QueueState, showing: Showing): void => {
  showing.isPastMinimum = true;
  const rest = showing.item.duration - minimumOf(state, showing.item);
  if (state.waiting.length > 0 || rest <= 0) {
    advance(state);
    return;
  }
  showing.timer = setTimeout(() => {
    advance(state);
  }, rest);
};

const isFree = ({ showing }: QueueState): boolean =>
  showing === null || showing.isPastMinimum || showing.item.yields;

export const createNoticeQueue = (minimumMs: number): NoticeQueue => {
  const state: QueueState = { minimumMs, waiting: [], showing: null };
  return {
    present: (item) =>
      new Promise((resolve) => {
        state.waiting.push({ item, shown: resolve });
        if (isFree(state)) advance(state);
      }),
    clear: () => {
      takeDown(state);
      for (const { shown } of state.waiting.splice(0)) {
        shown();
      }
    },
  };
};
