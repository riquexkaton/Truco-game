interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export const glslFloat = (value: number): string => value.toFixed(3);

export const glslColor = ({ r, g, b }: Rgb): string =>
  `vec3(${glslFloat(r)}, ${glslFloat(g)}, ${glslFloat(b)})`;

const hexByte = (hex: string, at: number): number =>
  Number.parseInt(hex.slice(at, at + 2), 16) / 255;

export const hexRgb = (hex: string): Rgb => ({
  r: hexByte(hex, 1),
  g: hexByte(hex, 3),
  b: hexByte(hex, 5),
});

export const GLSL_NOISE = `float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float bottom = mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x);
  float top = mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x);
  return mix(bottom, top, f.y);
}
const mat2 TURN = mat2(0.8, 0.6, -0.6, 0.8);
float fbm(vec2 p) { return noise(p) * 0.55 + noise(TURN * p * 2.1) * 0.3 + noise(TURN * TURN * p * 4.3) * 0.15; }`;
