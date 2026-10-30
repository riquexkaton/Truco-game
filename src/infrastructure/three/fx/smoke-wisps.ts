import type { Object3D } from 'three';
import { Mesh, PlaneGeometry, ShaderMaterial } from 'three';

import { FX_SECONDS, SMOKE_TIMING } from '@infrastructure/three/fx/fx-plan';
import type { FxSlot, NumberUniform } from '@infrastructure/three/fx/fx-slot';
import { parkedSlot } from '@infrastructure/three/fx/fx-slot';
import { GLSL_NOISE, glslColor, glslFloat } from '@infrastructure/three/fx/glsl';
import { DUEL_SLOTS } from '@infrastructure/three/layout/table-points';

const WISP = { width: 0.36, height: 0.56 };
const SMOKE_RGB = { r: 222 / 255, g: 212 / 255, b: 192 / 255 };
const SMOKE_ALPHA = 0.75;

const VERTEX = `varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 view = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  view.xy += position.xy;
  gl_Position = projectionMatrix * view;
}`;

const FRAGMENT = `uniform float uTime;
uniform float uStart;
uniform float uSeed;
varying vec2 vUv;
${GLSL_NOISE}
float strand(vec2 uv, float age, float seed) {
  float rise = uv.y * (0.35 + 0.65 * uv.y);
  float sway = (fbm(vec2(uv.y * 1.6 - age * 0.5, seed)) - 0.5) * 0.7 * rise;
  float curl = sin(uv.y * 12.5 - age * 3.0 + seed) * 0.13 * rise;
  float width = max(mix(0.022, 0.09, uv.y), fwidth(uv.x) * 1.6);
  return 1.0 - smoothstep(0.0, width, abs(uv.x - 0.5 - sway - curl));
}
void main() {
  float age = uTime - uStart;
  float head = age * ${glslFloat(SMOKE_TIMING.rise)};
  float tail = (age - ${glslFloat(SMOKE_TIMING.emitFor)}) * ${glslFloat(SMOKE_TIMING.rise)};
  float body = (1.0 - smoothstep(head - 0.2, head, vUv.y)) * smoothstep(tail, tail + 0.35, vUv.y);
  float ends = smoothstep(0.0, 0.08, vUv.y) * (1.0 - smoothstep(0.6, 1.0, vUv.y));
  float life = smoothstep(0.0, ${glslFloat(SMOKE_TIMING.fadeIn)}, age)
    * (1.0 - smoothstep(${glslFloat(SMOKE_TIMING.fadeOutFrom)}, ${glslFloat(FX_SECONDS)}, age));
  float wisp = max(strand(vUv, age, uSeed), strand(vUv, age + 0.9, uSeed + 3.1) * 0.65);
  float grain = 0.55 + 0.45 * fbm(vec2(vUv.x * 7.0, vUv.y * 5.0 - age * 1.4) + uSeed);
  float alpha = wisp * grain * body * ends * life * ${glslFloat(SMOKE_ALPHA)};
  gl_FragColor = vec4(${glslColor(SMOKE_RGB)}, alpha);
}`;

interface WispUniforms {
  readonly clock: NumberUniform;
  readonly start: NumberUniform;
  readonly seed: number;
}

const smokeMaterial = ({ clock, start, seed }: WispUniforms): ShaderMaterial =>
  new ShaderMaterial({
    uniforms: { uTime: clock, uStart: start, uSeed: { value: seed } },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
  });

export const createSmokeSlots = (parent: Object3D, clock: NumberUniform): FxSlot[] => {
  const geometry = new PlaneGeometry(WISP.width, WISP.height);
  geometry.translate(0, WISP.height / 2, 0);
  return DUEL_SLOTS.player.map(() => {
    const start = { value: 0 };
    const mesh = new Mesh(geometry, smokeMaterial({ clock, start, seed: Math.random() * 40 }));
    parent.add(mesh);
    return parkedSlot(mesh, start);
  });
};
