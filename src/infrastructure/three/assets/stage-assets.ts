import type { WebGLRenderer, WebGLRenderTarget } from 'three';

import type { LoadProgress } from '@infrastructure/browser/load-progress';
import type { Backgrounds } from '@infrastructure/three/assets/table-textures';
import { loadBackgrounds, loadCoinProtosOrNone } from '@infrastructure/three/assets/table-textures';
import type { CoinProto } from '@infrastructure/three/coins/coin-protos';
import { createCoinEnvironment } from '@infrastructure/three/scene/coin-environment';
import type { RadialTextures } from '@infrastructure/three/scene/radial-textures';
import { createRadialTextures } from '@infrastructure/three/scene/radial-textures';
import type { TextureKit } from '@infrastructure/three/textures/canvas-texture';

export interface StageAssets {
  readonly kit: TextureKit;
  readonly environment: WebGLRenderTarget;
  readonly backgrounds: Backgrounds;
  readonly protos: readonly CoinProto[];
  readonly radial: RadialTextures;
}

export const loadStageAssets = async (
  renderer: WebGLRenderer,
  progress: LoadProgress,
): Promise<StageAssets> => {
  const kit: TextureKit = { anisotropy: renderer.capabilities.getMaxAnisotropy() };
  const environment = createCoinEnvironment(renderer);
  const [backgrounds, protos] = await Promise.all([
    loadBackgrounds(progress),
    loadCoinProtosOrNone({ envMap: environment.texture, progress }),
  ]);
  return { kit, environment, backgrounds, protos, radial: createRadialTextures(kit) };
};
