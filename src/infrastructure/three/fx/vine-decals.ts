import type { Object3D, Texture } from 'three';
import { CanvasTexture, Mesh, PlaneGeometry, ShaderMaterial } from 'three';

import { STILL_BURNING } from '@infrastructure/three/fx/fx-plan';
import type { FxSlot, NumberUniform } from '@infrastructure/three/fx/fx-slot';
import { parkedSlot } from '@infrastructure/three/fx/fx-slot';
import { VINE_SPECS, vineCanvasSize } from '@infrastructure/three/fx/vine-data';
import { paintVines } from '@infrastructure/three/fx/vine-paint';
import type { VinePlan, VineTurn } from '@infrastructure/three/fx/vine-plan';
import { VINE_FIELD, vinePlan } from '@infrastructure/three/fx/vine-plan';
import { VINE_FRAGMENT, VINE_VERTEX } from '@infrastructure/three/fx/vine-shader';
import type { LayoutKey } from '@infrastructure/three/layout/layouts';
import { CARD_WIDTH, DUEL_SLOTS, TABLE_Y } from '@infrastructure/three/layout/table-points';
import { paintCanvas } from '@infrastructure/three/textures/canvas-texture';

export interface VineKit {
  readonly map: { value: Texture };
  readonly maps: Readonly<Record<LayoutKey, Texture>>;
  readonly still: NumberUniform;
}

export interface VineSlots {
  readonly kit: VineKit;
  readonly slots: FxSlot[];
}

interface VineTimes {
  readonly clock: NumberUniform;
  readonly start: NumberUniform;
  readonly end: NumberUniform;
}

const VINE_LIFT = 0.003;

const vineTexture = (plan: VinePlan, layout: LayoutKey): Texture => {
  const spec = VINE_SPECS[layout];
  const canvas = paintCanvas({
    ...vineCanvasSize(spec),
    scale: 1,
    paint: (context) => {
      paintVines(context, plan, spec);
    },
  });
  const texture = new CanvasTexture(canvas);
  texture.premultiplyAlpha = true;
  return texture;
};

const createVineKit = (): VineKit => {
  const plan = vinePlan();
  const maps = { wide: vineTexture(plan, 'wide'), tall: vineTexture(plan, 'tall') };
  return { map: { value: maps.wide }, maps, still: { value: 0 } };
};

const vineMaterial = (kit: VineKit, { clock, start, end }: VineTimes): ShaderMaterial =>
  new ShaderMaterial({
    uniforms: { uMap: kit.map, uTime: clock, uStart: start, uEnd: end, uStill: kit.still },
    vertexShader: VINE_VERTEX,
    fragmentShader: VINE_FRAGMENT,
    transparent: true,
    depthWrite: false,
  });

const vineGeometry = (): PlaneGeometry => {
  const size = 2 * CARD_WIDTH;
  const geometry = new PlaneGeometry(VINE_FIELD.halfWidth * size, VINE_FIELD.halfHeight * size);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
};

export const createVineSlots = (parent: Object3D, clock: NumberUniform): VineSlots => {
  const kit = createVineKit();
  const geometry = vineGeometry();
  const slots = DUEL_SLOTS.player.map(() => {
    const start = { value: 0 };
    const end = { value: STILL_BURNING };
    const mesh = new Mesh(geometry, vineMaterial(kit, { clock, start, end }));
    mesh.position.y = TABLE_Y + VINE_LIFT;
    parent.add(mesh);
    return parkedSlot(mesh, start, end);
  });
  return { kit, slots };
};

export const turnVine = ({ object }: FxSlot, turn: VineTurn): void => {
  object.scale.set(turn.x, 1, turn.z);
};

export const fitVines = (kit: VineKit, layout: LayoutKey): void => {
  kit.map.value = kit.maps[layout];
};

export const disposeVines = (kit: VineKit): void => {
  for (const map of Object.values(kit.maps)) {
    map.dispose();
  }
};
