import type { MeshStandardMaterial } from 'three';

import type { TintTrait } from '@infrastructure/three/cards/duel-look';
import { TINT_TRAITS } from '@infrastructure/three/cards/duel-look';

export type CardTint = Readonly<Record<TintTrait, { value: number }>>;

const DECLARE_AT = '#include <common>';
const APPLY_AT = '#include <colorspace_fragment>';

const DECLARATIONS = `${DECLARE_AT}
uniform float cardShade;
uniform float cardGrey;
vec3 cardLook(vec3 color) {
  return mix(color, vec3(dot(color, vec3(0.2126, 0.7152, 0.0722))), cardGrey) * cardShade;
}`;

const APPLY = `${APPLY_AT}
gl_FragColor.rgb = cardLook(gl_FragColor.rgb);`;

export const createCardTint = (): CardTint => ({
  shade: { value: 1 },
  grey: { value: 0 },
});

export const tintMaterial = (material: MeshStandardMaterial, tint: CardTint): void => {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.cardShade = tint.shade;
    shader.uniforms.cardGrey = tint.grey;
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
