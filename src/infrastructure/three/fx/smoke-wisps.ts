import type { Object3D } from 'three';
import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';

import { STILL_BURNING } from '@infrastructure/three/fx/fx-plan';
import type { FxSlot, NumberUniform } from '@infrastructure/three/fx/fx-slot';
import { parkedSlot } from '@infrastructure/three/fx/fx-slot';
import { SMOKE_FRAGMENT, SMOKE_PLANE, SMOKE_VERTEX } from '@infrastructure/three/fx/smoke-shader';
import { smokeStrands } from '@infrastructure/three/fx/smoke-strands';
import { CARD_Y, DUEL_SLOTS } from '@infrastructure/three/layout/table-points';

const SEED_SPREAD = 40;
const SMOKE_LIFT = 0.03;

interface SmokeTimes {
  readonly clock: NumberUniform;
  readonly start: NumberUniform;
  readonly end: NumberUniform;
}

const smokeMaterial = ({ clock, start, end }: SmokeTimes): ShaderMaterial => {
  const { shapes, motions } = smokeStrands(() => Math.random());
  return new ShaderMaterial({
    uniforms: {
      uTime: clock,
      uStart: start,
      uEnd: end,
      uSeed: { value: Math.random() * SEED_SPREAD },
      uShape: { value: shapes },
      uMotion: { value: motions },
    },
    vertexShader: SMOKE_VERTEX,
    fragmentShader: SMOKE_FRAGMENT,
    transparent: true,
    depthWrite: false,
  });
};

export const createSmokeSlots = (parent: Object3D, clock: NumberUniform): FxSlot[] => {
  const geometry = new PlaneGeometry(SMOKE_PLANE.width, SMOKE_PLANE.height);
  geometry.translate(0, SMOKE_PLANE.height / 2, 0);
  return DUEL_SLOTS.player.map(() => {
    const start = { value: 0 };
    const end = { value: STILL_BURNING };
    const mesh = new Mesh(geometry, smokeMaterial({ clock, start, end }));
    mesh.position.y = CARD_Y + SMOKE_LIFT;
    parent.add(mesh);
    return parkedSlot(mesh, start, end);
  });
};
