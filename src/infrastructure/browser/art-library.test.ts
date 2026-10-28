import { describe, expect, it } from 'vitest';

import { createArtLibrary } from '@infrastructure/browser/art-library';

const IDS = ['ada', 'teo', 'rui', 'alba', 'elio', 'saul'];

const createRecordingLibrary = (failing: readonly string[] = []) => {
  const loads: string[] = [];
  const tasks: (() => void)[] = [];
  const library = createArtLibrary({
    ids: IDS,
    load: (id) => {
      loads.push(id);
      return failing.includes(id) ? Promise.reject(new Error(id)) : Promise.resolve(`art:${id}`);
    },
    schedule: (task) => {
      tasks.push(task);
    },
  });
  const runIdleTask = async (): Promise<void> => {
    tasks.shift()?.();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  };
  return { library, loads, tasks, runIdleTask };
};

describe('createArtLibrary', () => {
  it('loads only the requested art', async () => {
    const { library, loads } = createRecordingLibrary();
    await library.ensure(['ada', 'teo']);
    expect(loads).toEqual(['ada', 'teo']);
    expect(library.get('ada')).toBe('art:ada');
    expect(library.get('rui')).toBeUndefined();
  });

  it('never loads the same art twice', async () => {
    const { library, loads } = createRecordingLibrary();
    await Promise.all([library.ensure(['ada']), library.ensure(['ada', 'teo'])]);
    await library.ensure(['teo']);
    expect(loads).toEqual(['ada', 'teo']);
  });

  it('tolerates art that fails to load', async () => {
    const { library } = createRecordingLibrary(['teo']);
    await library.ensure(['ada', 'teo']);
    expect(library.get('ada')).toBe('art:ada');
    expect(library.get('teo')).toBeUndefined();
  });

  it('prefetches the rest in idle batches of four', async () => {
    const { library, loads, tasks, runIdleTask } = createRecordingLibrary();
    await library.ensure(['ada']);
    library.prefetchRest();
    expect(loads).toEqual(['ada']);
    await runIdleTask();
    expect(loads).toEqual(['ada', 'teo', 'rui', 'alba', 'elio']);
    await runIdleTask();
    expect(loads).toEqual(['ada', 'teo', 'rui', 'alba', 'elio', 'saul']);
    expect(tasks).toHaveLength(0);
  });

  it('starts the prefetch only once', async () => {
    const { library, tasks } = createRecordingLibrary();
    await library.ensure(['ada']);
    library.prefetchRest();
    library.prefetchRest();
    expect(tasks).toHaveLength(1);
  });
});
