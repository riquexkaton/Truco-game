import type { WebGLRenderer, WebGLRenderTarget } from 'three';
import { PerspectiveCamera, PlaneGeometry, Scene } from 'three';

import type { GameStore } from '@application/store/game-store';

import { createCardArtLibrary } from '@infrastructure/browser/card-art-library';
import { createBrowserScheduler } from '@infrastructure/browser/scheduler';
import type { Backgrounds } from '@infrastructure/three/assets/table-textures';
import { loadBackgrounds, loadCoinProtosOrNone } from '@infrastructure/three/assets/table-textures';
import { addDeckBoxes } from '@infrastructure/three/cards/deck-boxes';
import { createDuelGlows } from '@infrastructure/three/cards/duel-glows';
import { createTableDeck } from '@infrastructure/three/cards/table-deck';
import { resetCoins } from '@infrastructure/three/coins/coin-actions';
import type { CoinProto } from '@infrastructure/three/coins/coin-protos';
import { createCoinTable } from '@infrastructure/three/coins/coin-table';
import type { Layout } from '@infrastructure/three/layout/layouts';
import { layoutFor } from '@infrastructure/three/layout/layouts';
import { CARD_HEIGHT, CARD_WIDTH } from '@infrastructure/three/layout/table-points';
import { createBackground } from '@infrastructure/three/scene/background';
import { createCandles } from '@infrastructure/three/scene/candles';
import { createCoinEnvironment } from '@infrastructure/three/scene/coin-environment';
import type { RadialTextures } from '@infrastructure/three/scene/radial-textures';
import { createRadialTextures } from '@infrastructure/three/scene/radial-textures';
import { addRoomLights } from '@infrastructure/three/scene/room-lights';
import type { Stage, StagePieces, StageView } from '@infrastructure/three/stage';
import type { TextureKit } from '@infrastructure/three/textures/canvas-texture';

export interface StageOptions {
  readonly store: GameStore;
  readonly reducedMotion: boolean;
}

interface StageAssets {
  readonly kit: TextureKit;
  readonly environment: WebGLRenderTarget;
  readonly backgrounds: Backgrounds;
  readonly protos: readonly CoinProto[];
  readonly radial: RadialTextures;
}

const screenLayout = (): Layout => layoutFor(globalThis.innerWidth / globalThis.innerHeight);

const loadStageAssets = async (renderer: WebGLRenderer): Promise<StageAssets> => {
  const kit: TextureKit = { anisotropy: renderer.capabilities.getMaxAnisotropy() };
  const environment = createCoinEnvironment(renderer);
  const [backgrounds, protos] = await Promise.all([
    loadBackgrounds(),
    loadCoinProtosOrNone(environment.texture),
  ]);
  return { kit, environment, backgrounds, protos, radial: createRadialTextures(kit) };
};

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
  });
  resetCoins(coins);
  return { glows: createDuelGlows(scene, radial.glow), deck, coins, marks: [] };
};

export const assembleStage = async (
  renderer: WebGLRenderer,
  options: StageOptions,
): Promise<Stage> => {
  const assets = await loadStageAssets(renderer);
  const view = buildView(renderer, assets);
  return {
    ...view,
    ...buildPieces(view, assets, options),
    reducedMotion: options.reducedMotion,
    scheduler: createBrowserScheduler({ reducedMotion: options.reducedMotion }),
    art: createCardArtLibrary(),
    store: options.store,
    hands: { player: [], rival: [] },
    played: [],
    vira: null,
    layout: screenLayout(),
    isClearing: false,
    shadowsDirty: true,
  };
};
