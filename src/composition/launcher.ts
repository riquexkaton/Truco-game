import { createGame } from '@application/create-game';

import { createBrowserRandom } from '@infrastructure/browser/random';
import { isReducedMotionPreferred } from '@infrastructure/browser/reduced-motion';
import { createBrowserScheduler } from '@infrastructure/browser/scheduler';
import type { createThreeTable } from '@infrastructure/three/create-three-table';

import type { GameSession, Launcher } from '@ui/containers/game-session';
import { createHud } from '@ui/hud/create-hud';

import { createLateTable } from './late-table';

interface TableModule {
  readonly createThreeTable: typeof createThreeTable;
}

type LoadTable = () => Promise<TableModule>;

const launchGame = async (
  canvas: HTMLCanvasElement,
  loadTable: LoadTable,
): Promise<GameSession> => {
  const isReducedMotion = isReducedMotionPreferred();
  const hud = createHud({ reducedMotion: isReducedMotion });
  const table = createLateTable();
  const { store, commands } = createGame({
    table: table.port,
    hud: hud.port,
    scheduler: createBrowserScheduler({ reducedMotion: isReducedMotion }),
    random: createBrowserRandom(),
  });
  const { createThreeTable } = await loadTable();
  const three = await createThreeTable({
    canvas,
    store,
    onPickCard: commands.playCard,
    reducedMotion: isReducedMotion,
  });
  table.bind(three.table);
  commands.start();
  return { store, commands, hud: hud.view };
};

export const createLauncher = (): Launcher => {
  let pending: Promise<TableModule> | null = null;
  const loadTable: LoadTable = () => {
    pending ??= import('@infrastructure/three/create-three-table');
    return pending;
  };
  return {
    prefetch: () => {
      void loadTable();
    },
    launch: (canvas) => launchGame(canvas, loadTable),
  };
};
