import type { CardId } from '@domain/cards/card';

import type { TablePort } from '@application/ports/table-port';
import type { GameStore } from '@application/store/game-store';

import { loadCardFonts } from '@infrastructure/browser/fonts';
import type { ProgressListener } from '@infrastructure/browser/load-progress';
import { createLoadProgress } from '@infrastructure/browser/load-progress';
import { TABLE_TEXTURE_STEPS } from '@infrastructure/three/assets/table-textures';
import { assembleStage } from '@infrastructure/three/assemble-stage';
import { createRenderer } from '@infrastructure/three/scene/renderer';
import { startStage } from '@infrastructure/three/start-stage';
import { createTableAdapter } from '@infrastructure/three/table/table-adapter';

export interface ThreeTableOptions {
  readonly canvas: HTMLCanvasElement;
  readonly store: GameStore;
  readonly onPickCard: (cardId: CardId) => void;
  readonly reducedMotion: boolean;
  readonly onProgress: ProgressListener;
}

export interface ThreeTable {
  readonly table: TablePort;
  readonly dispose: () => void;
}

const FONT_STEPS = 1;
const ASSEMBLY_STEPS = 1;
const TABLE_LOAD_STEPS = FONT_STEPS + TABLE_TEXTURE_STEPS + ASSEMBLY_STEPS;

export const createThreeTable = async (options: ThreeTableOptions): Promise<ThreeTable> => {
  const progress = createLoadProgress(TABLE_LOAD_STEPS, options.onProgress);
  await progress.track(loadCardFonts());
  const renderer = createRenderer(options.canvas);
  const stage = await assembleStage(renderer, { ...options, progress });
  progress.step();
  return { table: createTableAdapter(stage), dispose: startStage(stage, options) };
};
