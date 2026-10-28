type ArtLoader<T> = (id: string) => Promise<T>;

type TaskScheduler = (task: () => void) => void;

export interface ArtLibraryOptions<T> {
  readonly ids: readonly string[];
  readonly load: ArtLoader<T>;
  readonly schedule: TaskScheduler;
}

export interface ArtLibrary<T> {
  ensure(ids: readonly string[]): Promise<void>;
  get(id: string): T | undefined;
  prefetchRest(): void;
}

interface ArtState {
  readonly options: ArtLibraryOptions<unknown>;
  readonly loaded: Map<string, unknown>;
  readonly failed: Set<string>;
  readonly pending: Map<string, Promise<void>>;
}

const PREFETCH_BATCH = 4;

const loadInto = async (state: ArtState, id: string): Promise<void> => {
  try {
    state.loaded.set(id, await state.options.load(id));
  } catch {
    state.failed.add(id);
  }
};

const request = (state: ArtState, id: string): Promise<void> => {
  const existing = state.pending.get(id);
  if (existing !== undefined) return existing;
  const task = loadInto(state, id);
  state.pending.set(id, task);
  return task;
};

const ensureAll = async (state: ArtState, ids: readonly string[]): Promise<void> => {
  await Promise.all(ids.map((id) => request(state, id)));
};

const prefetchInBatches = (state: ArtState, ids: readonly string[]): void => {
  if (ids.length === 0) return;
  state.options.schedule(() => {
    void prefetchBatch(state, ids);
  });
};

const prefetchBatch = async (state: ArtState, ids: readonly string[]): Promise<void> => {
  await ensureAll(state, ids.slice(0, PREFETCH_BATCH));
  prefetchInBatches(state, ids.slice(PREFETCH_BATCH));
};

export const createArtLibrary = <T>(options: ArtLibraryOptions<T>): ArtLibrary<T> => {
  const loaded = new Map<string, T>();
  const state: ArtState = { options, loaded, failed: new Set(), pending: new Map() };
  let isPrefetching = false;
  return {
    ensure: (ids) => ensureAll(state, ids),
    get: (id) => loaded.get(id),
    prefetchRest: () => {
      if (isPrefetching) return;
      isPrefetching = true;
      prefetchInBatches(
        state,
        options.ids.filter((id) => !state.pending.has(id)),
      );
    },
  };
};
