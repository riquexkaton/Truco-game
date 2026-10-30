import { createGame } from '@application/create-game';

import type { ProgressListener } from '@infrastructure/browser/load-progress';
import { progressAfter } from '@infrastructure/browser/load-progress';
import { createBrowserRandom } from '@infrastructure/browser/random';
import { isReducedMotionPreferred } from '@infrastructure/browser/reduced-motion';
import { createBrowserScheduler } from '@infrastructure/browser/scheduler';
import type { createThreeTable } from '@infrastructure/three/create-three-table';

import type { GameSession, Launcher } from '@ui/containers/game-session';
import { createHud } from '@ui/hud/create-hud';

import { withHudSounds } from './hud-sounds';
import { createLateTable } from './late-table';
import type { PlaySound } from './sound-effects';

interface TableModule {
  readonly createThreeTable: typeof createThreeTable;
}

type LoadTable = () => Promise<TableModule>;

interface LaunchServices {
  readonly loadTable: LoadTable;
  readonly playSound: PlaySound;
}

const TABLE_CODE_SHARE = 0.25;

const launchGame = async (
  canvas: HTMLCanvasElement,
  onProgress: ProgressListener,
  { loadTable, playSound }: LaunchServices,
): Promise<GameSession> => {
  const isReducedMotion = isReducedMotionPreferred();
  const hud = createHud({ reducedMotion: isReducedMotion });
  const table = createLateTable();
  const { store, commands } = createGame({
    table: table.port,
    hud: withHudSounds(hud.port, playSound),
    scheduler: createBrowserScheduler({ reducedMotion: isReducedMotion }),
    random: createBrowserRandom(),
  });
  const { createThreeTable } = await loadTable();
  onProgress(TABLE_CODE_SHARE);
  const three = await createThreeTable({
    canvas,
    store,
    onPickCard: commands.playCard,
    listener: hud.table,
    reducedMotion: isReducedMotion,
    onProgress: progressAfter(TABLE_CODE_SHARE, onProgress),
    sounds: { play: playSound },
  });
  table.bind(three.table);
  commands.start();
  return { store, commands, hud: hud.view };
};

export const createLauncher = (playSound: PlaySound): Launcher => {
  let pending: Promise<TableModule> | null = null;
  const loadTable: LoadTable = () => {
    pending ??= import('@infrastructure/three/create-three-table');
    return pending;
  };
  return {
    prefetch: () => {
      void loadTable();
    },
    launch: (canvas, onProgress) => launchGame(canvas, onProgress, { loadTable, playSound }),
  };
};
