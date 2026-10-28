import type { Texture } from 'three';
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector4 } from 'three';

import type { BackgroundFlicker } from '@infrastructure/three/scene/pulses';

interface Uniform<T> {
  value: T;
}

interface BackgroundUniforms {
  readonly map: Uniform<Texture | null>;
  readonly uvRect: Uniform<Vector4>;
  readonly flick: Uniform<number>;
  readonly flickL: Uniform<number>;
}

export interface Background {
  readonly scene: Scene;
  readonly camera: OrthographicCamera;
  readonly uniforms: BackgroundUniforms;
}

const VERTEX_SHADER = `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `uniform sampler2D map;
uniform vec4 uvRect;
uniform float flick, flickL;
varying vec2 vUv;
void main() {
  vec2 uv = uvRect.xy + vUv * uvRect.zw;
  vec3 c = texture2D(map, uv).rgb;
  float left = smoothstep(0.7, 0.0, uv.x) * smoothstep(0.0, 0.5, uv.y);
  c *= mix(flick, flickL, left);
  gl_FragColor = vec4(c, 1.0);
}`;

export const createBackground = (): Background => {
  const uniforms: BackgroundUniforms = {
    map: { value: null },
    uvRect: { value: new Vector4(0, 0, 1, 1) },
    flick: { value: 1 },
    flickL: { value: 1 },
  };
  const material = new ShaderMaterial({
    uniforms: { ...uniforms },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    depthTest: false,
    depthWrite: false,
  });
  const scene = new Scene();
  scene.add(new Mesh(new PlaneGeometry(2, 2), material));
  return { scene, camera: new OrthographicCamera(-1, 1, 1, -1, 0, 1), uniforms };
};

export const setBackgroundFlicker = (background: Background, flicker: BackgroundFlicker): void => {
  background.uniforms.flick.value = flicker.base;
  background.uniforms.flickL.value = flicker.left;
};

export interface BackgroundView {
  readonly map: Texture | null;
  readonly uvRect: readonly [number, number, number, number];
}

export const setBackgroundView = (background: Background, view: BackgroundView): void => {
  background.uniforms.map.value = view.map;
  background.uniforms.uvRect.value.set(...view.uvRect);
};
