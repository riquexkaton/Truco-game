export interface BackgroundFlicker {
  readonly base: number;
  readonly left: number;
}

export const candleNoise = (time: number, seed: number): number =>
  Math.sin(time * 7.3 + seed) * 0.06 +
  Math.sin(time * 13.1 + seed * 2) * 0.05 +
  Math.sin(time * 23.7 + seed * 3) * 0.035;

export const backgroundFlicker = (noise: number): BackgroundFlicker => ({
  base: 1 + noise * 0.12,
  left: 1 + noise * 0.45,
});

export const glowLevel = (isLit: boolean, time: number): number =>
  isLit ? 0.75 + Math.sin(time * 2.2) * 0.12 : 0;
