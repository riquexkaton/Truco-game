import type { Scene, Texture } from 'three';
import { AdditiveBlending, PointLight, Sprite, SpriteMaterial } from 'three';

import type { Triple } from '@infrastructure/three/layout/layouts';
import { candleNoise } from '@infrastructure/three/scene/pulses';

interface Flame {
  readonly position: Triple;
  readonly power: number;
  readonly castsShadow: boolean;
  readonly halo: number;
}

export interface Candle {
  readonly light: PointLight;
  readonly haloMaterial: SpriteMaterial;
  readonly power: number;
  readonly seed: number;
}

export interface FlickerFrame {
  readonly time: number;
  readonly reducedMotion: boolean;
}

const FLAMES: readonly Flame[] = [
  { position: [-2.85, 1.195, -1.75], power: 9, castsShadow: true, halo: 0.9 },
  { position: [-3.05, 0.858, -0.82], power: 7, castsShadow: true, halo: 0.8 },
  { position: [2.95, 0.621, -2.05], power: 3, castsShadow: false, halo: 0.55 },
];

const BACKGROUND_FLAMES = 2;

const castShadows = (light: PointLight): void => {
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.bias = -0.002;
  light.shadow.radius = 4;
  light.shadow.camera.near = 0.05;
  light.shadow.camera.far = 12;
};

const createHalo = (flame: Flame, haloTexture: Texture): Sprite => {
  const material = new SpriteMaterial({
    map: haloTexture,
    blending: AdditiveBlending,
    depthWrite: false,
    depthTest: false,
    transparent: true,
    opacity: 0.5,
  });
  const halo = new Sprite(material);
  const [x, y, z] = flame.position;
  halo.scale.set(flame.halo, flame.halo, 1);
  halo.position.set(x, y + 0.02, z);
  halo.renderOrder = 5;
  return halo;
};

const createCandle = (scene: Scene, flame: Flame, haloTexture: Texture): Candle => {
  const light = new PointLight(0xff_a2_5a, flame.power, 14, 2);
  light.position.set(...flame.position);
  if (flame.castsShadow) castShadows(light);
  const halo = createHalo(flame, haloTexture);
  scene.add(light, halo);
  return { light, haloMaterial: halo.material, power: flame.power, seed: Math.random() * 100 };
};

export const createCandles = (scene: Scene, haloTexture: Texture): Candle[] =>
  FLAMES.map((flame) => createCandle(scene, flame, haloTexture));

export const flickerCandles = (candles: readonly Candle[], frame: FlickerFrame): number => {
  let backgroundNoise = 0;
  for (const [index, candle] of candles.entries()) {
    const noise = frame.reducedMotion ? 0 : candleNoise(frame.time, candle.seed);
    candle.light.intensity = candle.power * (0.9 + noise);
    candle.haloMaterial.opacity = 0.42 + noise * 1.4;
    if (index < BACKGROUND_FLAMES) backgroundNoise += noise / BACKGROUND_FLAMES;
  }
  return backgroundNoise;
};
