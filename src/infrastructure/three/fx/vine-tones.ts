import { itemAt } from '@domain/shared/random';

import { glslColor, glslFloat, hexRgb } from '@infrastructure/three/fx/glsl';

interface Tone {
  readonly at: number;
  readonly hex: string;
}

export const VINE_TONES = {
  outline: { at: 0, hex: '#5e4318' },
  core: { at: 0.2, hex: '#7a5a27' },
  leafDark: { at: 0.4, hex: '#9c7432' },
  leafMid: { at: 0.65, hex: '#cfa75a' },
  gold: { at: 0.8, hex: '#dcb76a' },
  leafLight: { at: 1, hex: '#f2d995' },
} as const satisfies Record<string, Tone>;

const RAMP: readonly Tone[] = Object.values(VINE_TONES);

const rampStep = (tone: Tone, index: number): string => {
  const from = itemAt(RAMP, index).at;
  const span = glslFloat(tone.at - from);
  return `  color = mix(color, ${glslColor(hexRgb(tone.hex))}, clamp((t - ${glslFloat(from)}) / ${span}, 0.0, 1.0));`;
};

export const GLSL_TONE = `vec3 tone(float t) {
  vec3 color = ${glslColor(hexRgb(itemAt(RAMP, 0).hex))};
${RAMP.slice(1)
  .map((tone, index) => rampStep(tone, index))
  .join('\n')}
  return color;
}`;
