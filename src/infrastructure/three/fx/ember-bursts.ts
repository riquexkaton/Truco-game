import type { Object3D } from 'three';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial } from 'three';

import { emberSeeds } from '@infrastructure/three/fx/ember-seeds';
import type { FxSlot, NumberUniform } from '@infrastructure/three/fx/fx-slot';
import { parkedSlot } from '@infrastructure/three/fx/fx-slot';
import { glslColor, glslFloat } from '@infrastructure/three/fx/glsl';
import { DUEL_SLOTS } from '@infrastructure/three/layout/table-points';

const EMBER_RISE = 0.34;
const EMBER_CORE = { r: 1, g: 210 / 255, b: 122 / 255 };
const EMBER_HALO = { r: 1, g: 160 / 255, b: 60 / 255 };

const VERTEX = `uniform float uTime;
uniform float uStart;
uniform float uSize;
attribute vec4 aMotion;
varying float vFade;
void main() {
  float t = (uTime - uStart - aMotion.x) / aMotion.y;
  float alive = step(0.0, t) * step(t, 1.0);
  float rise = clamp(t, 0.0, 1.0);
  vec4 view = modelViewMatrix * vec4(position, 1.0);
  view.x += aMotion.z * rise + sin(rise * 5.0 + aMotion.w) * 0.012;
  view.y += rise * ${glslFloat(EMBER_RISE)};
  gl_Position = projectionMatrix * view;
  gl_PointSize = uSize * (1.0 - 0.6 * rise) * alive;
  vFade = alive * smoothstep(0.0, 0.15, t) * (1.0 - smoothstep(0.5, 1.0, t));
}`;

const FRAGMENT = `varying float vFade;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float core = 1.0 - smoothstep(0.22, 0.36, d);
  float halo = pow(max(1.0 - d, 0.0), 2.0) * 0.75;
  vec3 color = ${glslColor(EMBER_CORE)} * core + ${glslColor(EMBER_HALO)} * halo * (1.0 - core);
  gl_FragColor = vec4(color, vFade);
}`;

export interface EmberUniforms {
  readonly clock: NumberUniform;
  readonly size: NumberUniform;
}

const emberMaterial = (uniforms: EmberUniforms, start: NumberUniform): ShaderMaterial =>
  new ShaderMaterial({
    uniforms: { uTime: uniforms.clock, uStart: start, uSize: uniforms.size },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
  });

const emberGeometry = (): BufferGeometry => {
  const { positions, motions } = emberSeeds(() => Math.random());
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('aMotion', new BufferAttribute(motions, 4));
  return geometry;
};

export const createEmberSlots = (parent: Object3D, uniforms: EmberUniforms): FxSlot[] =>
  DUEL_SLOTS.player.map(() => {
    const start = { value: 0 };
    const points = new Points(emberGeometry(), emberMaterial(uniforms, start));
    parent.add(points);
    return parkedSlot(points, start);
  });
