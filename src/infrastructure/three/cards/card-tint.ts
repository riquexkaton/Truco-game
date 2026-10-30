import type { MeshStandardMaterial } from 'three';

import type { TintTrait } from '@infrastructure/three/cards/duel-look';
import { TINT_TRAITS, WARM_LIGHT } from '@infrastructure/three/cards/duel-look';
import { glslColor } from '@infrastructure/three/fx/glsl';

export type CardTint = Readonly<Record<TintTrait, { value: number }>>;

const DECLARE_AT = '#include <common>';
const APPLY_AT = '#include <colorspace_fragment>';

const DECLARATIONS = `${DECLARE_AT}
uniform float cardShade;
uniform float cardGrey;
uniform float cardSepia;
uniform float cardGlow;
const vec3 CARD_GLOW = ${glslColor(WARM_LIGHT)};
vec3 cardLook(vec3 color) {
  color = 1.0 - (1.0 - color) * (1.0 - CARD_GLOW * cardGlow);
  color = mix(color, vec3(dot(color, vec3(0.2126, 0.7152, 0.0722))), cardGrey);
  vec3 sepia = vec3(
    dot(color, vec3(0.393, 0.769, 0.189)),
    dot(color, vec3(0.349, 0.686, 0.168)),
    dot(color, vec3(0.272, 0.534, 0.131)));
  return clamp(mix(color, sepia, cardSepia), 0.0, 1.0) * cardShade;
}`;

const APPLY = `${APPLY_AT}
gl_FragColor.rgb = cardLook(gl_FragColor.rgb);`;

export const createCardTint = (): CardTint => ({
  shade: { value: 1 },
  grey: { value: 0 },
  sepia: { value: 0 },
  glow: { value: 0 },
});

export const tintMaterial = (material: MeshStandardMaterial, tint: CardTint): void => {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.cardShade = tint.shade;
    shader.uniforms.cardGrey = tint.grey;
    shader.uniforms.cardSepia = tint.sepia;
    shader.uniforms.cardGlow = tint.glow;
    shader.fragmentShader = shader.fragmentShader
      .replace(DECLARE_AT, () => DECLARATIONS)
      .replace(APPLY_AT, () => APPLY);
  };
};

export const resetTint = (tint: CardTint): void => {
  for (const trait of TINT_TRAITS) {
    tint[trait].value = trait === 'shade' ? 1 : 0;
  }
};
