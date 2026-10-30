import type { Scene, Texture } from 'three';
import {
  AdditiveBlending,
  Color,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three';

import type { Side } from '@domain/shared/side';

import { WARM_LIGHT } from '@infrastructure/three/cards/duel-look';
import type { TablePoint } from '@infrastructure/three/layout/table-points';
import { DUEL_SLOTS, TABLE_Y } from '@infrastructure/three/layout/table-points';
import { glowLevel } from '@infrastructure/three/scene/pulses';

export interface DuelGlow {
  readonly material: MeshBasicMaterial;
  level: number;
}

export interface GlowFrame {
  readonly time: number;
  readonly deltaSeconds: number;
}

export interface GlowTarget {
  readonly duel: number;
  readonly side: Side;
  readonly level: number;
}

const POOL_SIZE = { width: 1.5, depth: 1.4 };
const GLOW_RATE = 9;

interface GlowKit {
  readonly scene: Scene;
  readonly geometry: PlaneGeometry;
  readonly map: Texture;
}

const createGlow = ({ scene, geometry, map }: GlowKit, point: TablePoint): DuelGlow => {
  const material = new MeshBasicMaterial({
    map,
    color: new Color().setRGB(WARM_LIGHT.r, WARM_LIGHT.g, WARM_LIGHT.b, SRGBColorSpace),
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(point.x, TABLE_Y + 0.003, point.z);
  scene.add(mesh);
  return { material, level: 0 };
};

export const createDuelGlows = (scene: Scene, glowTexture: Texture): DuelGlow[] => {
  const geometry = new PlaneGeometry(POOL_SIZE.width, POOL_SIZE.depth);
  const kit: GlowKit = { scene, geometry, map: glowTexture };
  return [...DUEL_SLOTS.player, ...DUEL_SLOTS.rival].map((point) => createGlow(kit, point));
};

export const resetGlows = (glows: readonly DuelGlow[]): void => {
  for (const glow of glows) {
    glow.material.opacity = 0;
    glow.level = 0;
  }
};

export const lightGlow = (glows: readonly DuelGlow[], { duel, side, level }: GlowTarget): void => {
  const glow = glows[(side === 'player' ? 0 : DUEL_SLOTS.player.length) + duel];
  if (glow !== undefined) glow.level = level;
};

export const updateGlows = (glows: readonly DuelGlow[], frame: GlowFrame, isReduced: boolean) => {
  const rate = isReduced ? 1 : Math.min(1, frame.deltaSeconds * GLOW_RATE);
  for (const glow of glows) {
    const target = glowLevel(glow.level > 0, frame.time) * glow.level;
    glow.material.opacity += (target - glow.material.opacity) * rate;
  }
};
