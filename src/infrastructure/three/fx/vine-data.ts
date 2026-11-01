import { VINE_FIELD, VINE_TIMING } from '@infrastructure/three/fx/vine-plan';
import type { LayoutKey } from '@infrastructure/three/layout/layouts';

export interface VineSpec {
  readonly width: number;
  readonly core: number;
  readonly gold: number;
  readonly leaf: number;
  readonly outline: number;
}

export interface VineData {
  readonly tone: number;
  readonly grow: number;
  readonly glint: number;
}

export const VINE_SPECS: Readonly<Record<LayoutKey, VineSpec>> = {
  wide: { width: 1024, core: 0.016, gold: 0.0072, leaf: 1, outline: 0.0035 },
  tall: { width: 512, core: 0.045, gold: 0.026, leaf: 1.4, outline: 0.008 },
};

const byte = (value: number): string => {
  const unit = Math.min(1, Math.max(0, value));
  return String(Math.round(unit * 255));
};

export const dataColor = ({ tone, grow, glint }: VineData): string =>
  `rgb(${byte(tone)} ${byte(grow / VINE_TIMING.span)} ${byte(glint)})`;

export const vineCanvasSize = (spec: VineSpec): { width: number; height: number } => ({
  width: spec.width,
  height: Math.round((spec.width * VINE_FIELD.halfHeight) / VINE_FIELD.halfWidth),
});
