interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export const glslFloat = (value: number): string => value.toFixed(3);

export const glslColor = ({ r, g, b }: Rgb): string =>
  `vec3(${glslFloat(r)}, ${glslFloat(g)}, ${glslFloat(b)})`;

export const GLSL_NOISE = `float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float bottom = mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x);
  float top = mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x);
  return mix(bottom, top, f.y);
}
float fbm(vec2 p) { return noise(p) * 0.55 + noise(p * 2.1) * 0.3 + noise(p * 4.3) * 0.15; }`;
