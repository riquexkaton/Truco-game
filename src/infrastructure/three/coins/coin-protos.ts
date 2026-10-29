import type { ColorSpace } from 'three';
import {
  BufferGeometry,
  Float32BufferAttribute,
  MeshStandardMaterial,
  NoColorSpace,
  SRGBColorSpace,
  Texture,
} from 'three';

import type { LoadProgress } from '@infrastructure/browser/load-progress';
import { loadImageBitmap, loadJson } from '@infrastructure/browser/resource-loading';
import { coinGeometryUrl, coinMapUrls } from '@infrastructure/browser/table-asset-urls';

export interface CoinProto {
  readonly geometry: BufferGeometry;
  readonly material: MeshStandardMaterial;
}

export interface CoinLoad {
  readonly envMap: Texture;
  readonly progress: LoadProgress;
}

interface CoinGeometryData {
  readonly position: number[];
  readonly normal: number[];
  readonly texcoord_0: number[];
  readonly tangent: number[];
  readonly index: number[];
}

interface MapRequest {
  readonly url: string;
  readonly colorSpace: ColorSpace;
}

const COIN_VARIANTS = ['carnero', 'cayado', 'velo', 'lirio'];
const MAPS_PER_COIN = 3;
const COIN_ANISOTROPY = 4;

export const COIN_LOAD_STEPS = 1 + COIN_VARIANTS.length * MAPS_PER_COIN;

const isGeometryData = (value: unknown): value is CoinGeometryData =>
  typeof value === 'object' &&
  value !== null &&
  'position' in value &&
  'normal' in value &&
  'texcoord_0' in value &&
  'tangent' in value &&
  'index' in value;

const buildGeometry = (data: CoinGeometryData): BufferGeometry => {
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(data.position, 3));
  geometry.setAttribute('normal', new Float32BufferAttribute(data.normal, 3));
  geometry.setAttribute('uv', new Float32BufferAttribute(data.texcoord_0, 2));
  geometry.setAttribute('tangent', new Float32BufferAttribute(data.tangent, 4));
  geometry.setIndex(data.index);
  return geometry;
};

const loadMap = async ({ url, colorSpace }: MapRequest): Promise<Texture> => {
  const bitmap = await loadImageBitmap({ url, flipY: false });
  const texture = new Texture(bitmap);
  texture.flipY = false;
  texture.colorSpace = colorSpace;
  texture.anisotropy = COIN_ANISOTROPY;
  texture.needsUpdate = true;
  return texture;
};

const loadMaterial = async (variant: string, load: CoinLoad): Promise<MeshStandardMaterial> => {
  const urls = coinMapUrls(variant);
  const { track } = load.progress;
  const [map, normalMap, metalRoughness] = await Promise.all([
    track(loadMap({ url: urls.color, colorSpace: SRGBColorSpace })),
    track(loadMap({ url: urls.normal, colorSpace: NoColorSpace })),
    track(loadMap({ url: urls.metalRoughness, colorSpace: NoColorSpace })),
  ]);
  return new MeshStandardMaterial({
    map,
    normalMap,
    roughnessMap: metalRoughness,
    metalnessMap: metalRoughness,
    metalness: 1,
    roughness: 1,
    envMap: load.envMap,
    envMapIntensity: 0.8,
  });
};

export const loadCoinProtos = async (load: CoinLoad): Promise<CoinProto[]> => {
  const data = await load.progress.track(loadJson(coinGeometryUrl()));
  if (!isGeometryData(data)) {
    throw new TypeError('Invalid coin geometry');
  }
  const geometry = buildGeometry(data);
  const materials = await Promise.all(COIN_VARIANTS.map((variant) => loadMaterial(variant, load)));
  return materials.map((material) => ({ geometry, material }));
};
