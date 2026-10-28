import type { CardId } from '@domain/cards/card';

import type { TablePort } from '@application/ports/table-port';
import type { GameStore } from '@application/store/game-store';

import { loadCardFonts } from '@infrastructure/browser/fonts';
import { assembleStage } from '@infrastructure/three/assemble-stage';
import { createRenderer } from '@infrastructure/three/scene/renderer';
import { startStage } from '@infrastructure/three/start-stage';
import { createTableAdapter } from '@infrastructure/three/table/table-adapter';

export interface ThreeTableOptions {
  readonly canvas: HTMLCanvasElement;
  readonly store: GameStore;
  readonly onPickCard: (cardId: CardId) => void;
  readonly reducedMotion: boolean;
}

export interface ThreeTable {
  readonly table: TablePort;
  readonly dispose: () => void;
}

export const createThreeTable = async (options: ThreeTableOptions): Promise<ThreeTable> => {
  await loadCardFonts();
  const renderer = createRenderer(options.canvas);
  const stage = await assembleStage(renderer, options);
  return { table: createTableAdapter(stage), dispose: startStage(stage, options) };
};
