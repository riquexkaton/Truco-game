import { FX_FADE_OUT } from '@infrastructure/three/fx/fx-plan';
import { glslColor, glslFloat, hexRgb } from '@infrastructure/three/fx/glsl';
import { VINE_FIELD, VINE_TIMING } from '@infrastructure/three/fx/vine-plan';
import { GLSL_TONE } from '@infrastructure/three/fx/vine-tones';

const GLINT_RGB = hexRgb('#fff4d2');
const HALO_RGB = hexRgb('#c9a35a');

const LOOK = { halo: 0.55, haloBias: 2.5, shadow: 0.5, reveal: 0.08, glintSeconds: 0.07 } as const;

const SHADOW_SHIFT = { x: 0.0027, y: 0.008 } as const;

const ALL_GROWN = 1000;

const SHADOW_UV = `vec2(${glslFloat(SHADOW_SHIFT.x / (2 * VINE_FIELD.halfWidth))}, ${glslFloat(-SHADOW_SHIFT.y / (2 * VINE_FIELD.halfHeight))})`;

const GLINT_WIDTH = LOOK.glintSeconds / VINE_TIMING.glintEvery;

export const VINE_VERTEX = `varying vec2 vUv;
varying vec2 vFlip;
void main() {
  vUv = uv;
  vFlip = sign(vec2(modelMatrix[0][0], modelMatrix[2][2]));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const REVEAL = `float shown(vec4 texel, float grown) {
  float grow = texel.g / max(texel.a, 0.004);
  return texel.a * clamp((grown - grow) * ${glslFloat(VINE_TIMING.span / LOOK.reveal)}, 0.0, 1.0);
}
float glint(float phase, float age) {
  float cycle = (age - ${glslFloat(VINE_TIMING.glintFrom)}) / ${glslFloat(VINE_TIMING.glintEvery)};
  float lag = (fract(cycle - phase + 0.5) - 0.5) / ${glslFloat(GLINT_WIDTH)};
  return exp(-lag * lag) * smoothstep(0.0, 0.04, cycle) * (1.0 - uStill);
}`;

export const VINE_FRAGMENT = `uniform sampler2D uMap;
uniform float uTime;
uniform float uStart;
uniform float uEnd;
uniform float uStill;
varying vec2 vUv;
varying vec2 vFlip;
${GLSL_TONE}
${REVEAL}
void main() {
  float age = mix(uTime - uStart, ${glslFloat(ALL_GROWN)}, uStill);
  float gone = uEnd < 0.0 ? 0.0 : uTime - uEnd;
  float grown = age / ${glslFloat(VINE_TIMING.span)};
  vec4 thread = texture2D(uMap, vUv);
  float body = shown(thread, grown);
  float shadow = shown(texture2D(uMap, vUv - ${SHADOW_UV} * vFlip), grown) * ${glslFloat(LOOK.shadow)};
  float halo = shown(texture2D(uMap, vUv, ${glslFloat(LOOK.haloBias)}), grown) * ${glslFloat(LOOK.halo)};
  vec3 data = thread.rgb / max(thread.a, 0.004);
  float shine = glint(data.b, age) * smoothstep(0.1, 0.5, data.r);
  vec3 color = mix(tone(data.r), ${glslColor(GLINT_RGB)}, shine);
  float under = shadow + halo * (1.0 - shadow);
  float alpha = body + under * (1.0 - body);
  vec3 lit = color * body + ${glslColor(HALO_RGB)} * halo * (1.0 - shadow) * (1.0 - body);
  float life = 1.0 - smoothstep(0.0, ${glslFloat(FX_FADE_OUT)}, gone);
  gl_FragColor = vec4(lit / max(alpha, 0.004), alpha * life);
}`;
