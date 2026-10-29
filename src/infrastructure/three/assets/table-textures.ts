import { LinearFilter, NoColorSpace, Texture } from 'three';

import type { LoadProgress } from '@infrastructure/browser/load-progress';
import { loadImageBitmap } from '@infrastructure/browser/resource-loading';
import { backgroundUrl } from '@infrastructure/browser/table-asset-urls';
import type { CoinLoad, CoinProto } from '@infrastructure/three/coins/coin-protos';
import { COIN_LOAD_STEPS, loadCoinProtos } from '@infrastructure/three/coins/coin-protos';
import type { LayoutKey } from '@infrastructure/three/layout/layouts';

export type Backgrounds = Readonly<Record<LayoutKey, Texture | null>>;

const BACKGROUND_LOAD_STEPS = 2;

export const TABLE_TEXTURE_STEPS = BACKGROUND_LOAD_STEPS + COIN_LOAD_STEPS;

const loadBackground = async (key: LayoutKey): Promise<Texture | null> => {
  try {
    const bitmap = await loadImageBitmap({ url: backgroundUrl(key), flipY: true });
    const texture = new Texture(bitmap);
    texture.flipY = false;
    texture.colorSpace = NoColorSpace;
    texture.generateMipmaps = false;
    texture.minFilter = LinearFilter;
    texture.needsUpdate = true;
    return texture;
  } catch {
    return null;
  }
};

export const loadBackgrounds = async ({ track }: LoadProgress): Promise<Backgrounds> => {
  const [wide, tall] = await Promise.all([
    track(loadBackground('wide')),
    track(loadBackground('tall')),
  ]);
  return { wide, tall };
};

export const loadCoinProtosOrNone = async (load: CoinLoad): Promise<CoinProto[]> => {
  try {
    return await loadCoinProtos(load);
  } catch (error: unknown) {
    console.warn('Coins could not be loaded', error);
    return [];
  }
};
