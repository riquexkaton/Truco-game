import type { WebGLRenderer } from 'three';
import { PerspectiveCamera, PlaneGeometry, Scene } from 'three';

import type { TableListener } from '@application/ports/table-listener';
import type { GameStore } from '@application/store/game-store';

import { createCardArtLibrary } from '@infrastructure/browser/card-art-library';
import type { LoadProgress } from '@infrastructure/browser/load-progress';
import { createBrowserScheduler } from '@infrastructure/browser/scheduler';
import type { StageAssets } from '@infrastructure/three/assets/stage-assets';
import { loadStageAssets } from '@infrastructure/three/assets/stage-assets';
import { addDeckBoxes } from '@infrastructure/three/cards/deck-boxes';
import { createDuelGlows } from '@infrastructure/three/cards/duel-glows';
import { createSealMarks } from '@infrastructure/three/cards/seal-marks';
import { createTableDeck } from '@infrastructure/three/cards/table-deck';
import { resetCoins } from '@infrastructure/three/coins/coin-actions';
import { createCoinTable } from '@infrastructure/three/coins/coin-table';
import { createSealTrack } from '@infrastructure/three/interaction/seal-track';
import type { Layout } from '@infrastructure/three/layout/layouts';
import { layoutFor } from '@infrastructure/three/layout/layouts';
import { CARD_HEIGHT, CARD_WIDTH } from '@infrastructure/three/layout/table-points';
import { createBackground } from '@infrastructure/three/scene/background';
import { createCandles } from '@infrastructure/three/scene/candles';
import { addRoomLights } from '@infrastructure/three/scene/room-lights';
import type { Stage, StagePieces, StageView } from '@infrastructure/three/stage';
import type { TableSounds } from '@infrastructure/three/table/table-sounds';

export interface StageOptions {
  readonly store: GameStore;
  readonly reducedMotion: boolean;
  readonly progress: LoadProgress;
  readonly sounds: TableSounds;
  readonly listener: TableListener;
}

const screenLayout = (): Layout => layoutFor(globalThis.innerWidth / globalThis.innerHeight);

const buildView = (renderer: WebGLRenderer, assets: StageAssets): StageView => {
  const scene = new Scene();
  const { handLight } = addRoomLights(scene);
  return {
    renderer,
    scene,
    camera: new PerspectiveCamera(42, 1.6, 0.05, 60),
    background: createBackground(),
    backgrounds: assets.backgrounds,
    candles: createCandles(scene, assets.radial.halo),
    handLight,
    environment: assets.environment,
  };
};

const buildPieces = (view: StageView, assets: StageAssets, options: StageOptions): StagePieces => {
  const { scene } = view;
  const { kit, radial } = assets;
  const geometry = new PlaneGeometry(CARD_WIDTH, CARD_HEIGHT);
  const deck = createTableDeck({ ...kit, scene, geometry, glareTexture: radial.glare });
  addDeckBoxes(scene, deck.backs);
  const coins = createCoinTable({
    scene,
    protos: assets.protos,
    blobTexture: radial.blob,
    sparkTexture: radial.halo,
    reducedMotion: options.reducedMotion,
    layout: screenLayout().key,
    onCoinLand: () => {
      options.sounds.play('coinLanded');
    },
  });
  resetCoins(coins);
  const glows = createDuelGlows(scene, radial.glow);
  return { glows, deck, coins, marks: [], seals: createSealMarks(kit) };
};

export const assembleStage = async (
  renderer: WebGLRenderer,
  options: StageOptions,
): Promise<Stage> => {
  const assets = await loadStageAssets(renderer, options.progress);
  const view = buildView(renderer, assets);
  return {
    ...view,
    ...buildPieces(view, assets, options),
    reducedMotion: options.reducedMotion,
    scheduler: createBrowserScheduler({ reducedMotion: options.reducedMotion }),
    art: createCardArtLibrary(),
    store: options.store,
    sounds: options.sounds,
    listener: options.listener,
    hands: { player: [], rival: [] },
    played: [],
    sealTrack: createSealTrack(),
    vira: null,
    layout: screenLayout(),
    isClearing: false,
    shadowsDirty: true,
  };
};
