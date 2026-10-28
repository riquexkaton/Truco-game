import type { Scene, Texture } from 'three';
import { AdditiveBlending, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

import type { PerSide } from '@domain/shared/side';

import type { DuelMark } from '@application/ports/table-port';

import type { TablePoint } from '@infrastructure/three/layout/table-points';
import { DUEL_SLOTS, TABLE_Y } from '@infrastructure/three/layout/table-points';
import { glowLevel } from '@infrastructure/three/scene/pulses';

export interface DuelGlow {
  readonly material: MeshBasicMaterial;
  isLit: boolean;
}

export interface GlowFrame {
  readonly time: number;
  readonly deltaSeconds: number;
}

const WINNER_COLORS: PerSide<number> = { player: 0xff_c6_70, rival: 0xc2_4a_3a };
const GLOW_RATE = 4;

interface GlowKit {
  readonly scene: Scene;
  readonly geometry: PlaneGeometry;
  readonly map: Texture;
}

const createGlow = ({ scene, geometry, map }: GlowKit, point: TablePoint): DuelGlow => {
  const material = new MeshBasicMaterial({
    map,
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const mesh = new Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(point.x, TABLE_Y + 0.003, point.z);
  scene.add(mesh);
  return { material, isLit: false };
};

export const createDuelGlows = (scene: Scene, glowTexture: Texture): DuelGlow[] => {
  const kit: GlowKit = { scene, geometry: new PlaneGeometry(1.35, 1.7), map: glowTexture };
  return [...DUEL_SLOTS.player, ...DUEL_SLOTS.rival].map((point) => createGlow(kit, point));
};

export const resetGlows = (glows: readonly DuelGlow[]): void => {
  for (const glow of glows) {
    glow.material.opacity = 0;
    glow.isLit = false;
  }
};

export const lightGlow = (glows: readonly DuelGlow[], mark: DuelMark): void => {
  const glow = glows[(mark.winner === 'player' ? 0 : DUEL_SLOTS.player.length) + mark.duel];
  if (glow === undefined) return;
  glow.material.color.set(WINNER_COLORS[mark.winner]);
  glow.isLit = true;
};

export const updateGlows = (glows: readonly DuelGlow[], frame: GlowFrame): void => {
  const rate = Math.min(1, frame.deltaSeconds * GLOW_RATE);
  for (const glow of glows) {
    const target = glowLevel(glow.isLit, frame.time);
    glow.material.opacity += (target - glow.material.opacity) * rate;
  }
};
