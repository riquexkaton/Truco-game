import { SMOKE_TIMING } from '@infrastructure/three/fx/fx-plan';
import { GLSL_NOISE, glslColor, glslFloat } from '@infrastructure/three/fx/glsl';
import { STRAND_COUNT } from '@infrastructure/three/fx/smoke-strands';

export const SMOKE_PLANE = { width: 0.9, height: 1.4 } as const;

const NEAR_RGB = { r: 0.74, g: 0.68, b: 0.6 };
const HIGH_RGB = { r: 0.68, g: 0.71, b: 0.76 };
const SMOKE_ALPHA = 0.8;

const HEIGHT = glslFloat(SMOKE_PLANE.height);

export const SMOKE_VERTEX = `varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 view = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  view.xy += position.xy;
  gl_Position = projectionMatrix * view;
}`;

const STRAND = `float strand(vec2 p, float flow, vec4 shape, vec4 motion, float age, float pixel) {
  float y = p.y / ${HEIGHT};
  float rise = age * motion.y;
  float n = noise(vec2(p.y * 3.2 - rise * 1.1, motion.x * 3.7));
  float wave = sin(p.y * motion.z - rise * 4.0 + motion.x + flow * 5.0);
  float sway = wave * motion.w * (0.1 + 2.2 * y) + ((n - 0.5) * 0.34 + flow * 0.35) * y * y;
  float width = max(shape.y * (1.0 + 3.0 * y + 9.0 * y * y), pixel);
  float d = (p.x - shape.x - sway) / width;
  float body = smoothstep(shape.w, shape.w + 0.1, y) * (1.0 - smoothstep(shape.z * 0.3, shape.z, y));
  float wisp = 0.3 + n * (0.7 + 0.5 * sin(p.y * 9.0 - rise * 3.0 + motion.x * 2.0));
  return exp(-d * d) * body * wisp / (1.0 + 2.5 * y);
}`;

const MASKS = `float column(float y, float age, float gone) {
  float head = age * ${glslFloat(SMOKE_TIMING.rise)};
  float tail = gone * ${glslFloat(SMOKE_TIMING.rise)};
  return (1.0 - smoothstep(head - 0.3, head, y)) * smoothstep(tail - 0.3, tail, y);
}
float edges(vec2 uv) {
  return smoothstep(0.0, 0.03, uv.y) * smoothstep(0.0, 0.15, uv.x) * (1.0 - smoothstep(0.85, 1.0, uv.x));
}
float haze(vec2 p, float flow) {
  float y = p.y / ${HEIGHT};
  float spread = 0.08 + 0.2 * y;
  float rise = smoothstep(0.05, 0.4, y) * (1.0 - smoothstep(0.4, 0.9, y));
  return (flow + 0.5) * exp(-(p.x * p.x) / (spread * spread)) * rise * 0.16;
}
float life(float age, float gone) {
  return smoothstep(0.0, ${glslFloat(SMOKE_TIMING.fadeIn)}, age)
    * (1.0 - smoothstep(0.0, ${glslFloat(SMOKE_TIMING.fadeOut)}, gone));
}`;

export const SMOKE_FRAGMENT = `uniform float uTime;
uniform float uStart;
uniform float uEnd;
uniform float uSeed;
uniform vec4 uShape[${String(STRAND_COUNT)}];
uniform vec4 uMotion[${String(STRAND_COUNT)}];
varying vec2 vUv;
${GLSL_NOISE}
${STRAND}
${MASKS}
void main() {
  float age = uTime - uStart;
  float gone = uEnd < 0.0 ? 0.0 : uTime - uEnd;
  vec2 p = vec2(vUv.x - 0.5, vUv.y) * vec2(${glslFloat(SMOKE_PLANE.width)}, ${HEIGHT});
  float pixel = fwidth(p.x) * 1.5;
  float flow = fbm(vec2(p.x * 2.4 + uSeed, p.y * 1.7 - age * 0.5)) - 0.5;
  float density = haze(p, flow);
  for (int i = 0; i < ${String(STRAND_COUNT)}; i++) {
    density += strand(p, flow, uShape[i], uMotion[i], age, pixel);
  }
  float puffs = noise(vec2(p.x * 8.0 + flow * 3.0, p.y * 5.5 - age * 1.7) + uSeed);
  density *= 0.45 + 0.75 * puffs;
  float mask = column(vUv.y, age, gone) * edges(vUv) * life(age, gone);
  float alpha = (1.0 - exp(-density * 2.8)) * mask * ${glslFloat(SMOKE_ALPHA)};
  vec3 tone = mix(${glslColor(NEAR_RGB)}, ${glslColor(HIGH_RGB)}, smoothstep(0.05, 0.75, vUv.y));
  gl_FragColor = vec4(tone * (0.85 + 0.25 * puffs), alpha);
}`;
