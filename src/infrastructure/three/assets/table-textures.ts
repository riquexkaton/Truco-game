import { LinearFilter, NoColorSpace, Texture } from 'three';

import { loadImageBitmap } from '@infrastructure/browser/resource-loading';
import { backgroundUrl } from '@infrastructure/browser/table-asset-urls';
import type { CoinProto } from '@infrastructure/three/coins/coin-protos';
import { loadCoinProtos } from '@infrastructure/three/coins/coin-protos';
import type { LayoutKey } from '@infrastructure/three/layout/layouts';

export type Backgrounds = Readonly<Record<LayoutKey, Texture | null>>;

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

export const loadBackgrounds = async (): Promise<Backgrounds> => {
  const [wide, tall] = await Promise.all([loadBackground('wide'), loadBackground('tall')]);
  return { wide, tall };
};

export const loadCoinProtosOrNone = async (envMap: Texture): Promise<CoinProto[]> => {
  try {
    return await loadCoinProtos(envMap);
  } catch (error: unknown) {
    console.warn('Coins could not be loaded', error);
    return [];
  }
};
