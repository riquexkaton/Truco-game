import type { LayoutKey } from '@infrastructure/three/layout/layouts';

export interface Shadow {
  readonly y: number;
  readonly blur: number;
  readonly color: string;
}

export interface WaxSealSpec {
  readonly size: number;
  readonly overhang: number;
  readonly rings: readonly [number, number, number];
  readonly drop: Shadow;
  readonly glow: Shadow;
  readonly star: number;
}

export interface RibbonSpec {
  readonly font: number;
  readonly spacing: number;
  readonly padY: number;
  readonly padX: number;
  readonly below: number;
  readonly drop: Shadow;
}

export interface SealMarkSpec {
  readonly cardPx: number;
  readonly border: number;
  readonly glow: Shadow;
  readonly seal: WaxSealSpec;
  readonly ribbon: RibbonSpec;
}

const DROP = 'rgba(0,0,0,0.6)';
const RIBBON_DROP = 'rgba(0,0,0,0.5)';
const CARD_GLOW = 'rgba(255,178,87,0.6)';
const SEAL_GLOW = 'rgba(255,178,87,0.7)';

export const SEAL_MARK_SPECS: Readonly<Record<LayoutKey, SealMarkSpec>> = {
  tall: {
    cardPx: 101,
    border: 2,
    glow: { y: 0, blur: 24, color: CARD_GLOW },
    seal: {
      size: 36,
      overhang: 12,
      rings: [2, 4, 5],
      drop: { y: 3, blur: 8, color: DROP },
      glow: { y: 0, blur: 14, color: SEAL_GLOW },
      star: 16,
    },
    ribbon: {
      font: 8,
      spacing: 2,
      padY: 2,
      padX: 7,
      below: 10,
      drop: { y: 2, blur: 6, color: RIBBON_DROP },
    },
  },
  wide: {
    cardPx: 170,
    border: 2.5,
    glow: { y: 0, blur: 34, color: CARD_GLOW },
    seal: {
      size: 48,
      overhang: 16,
      rings: [2.5, 5, 6],
      drop: { y: 4, blur: 10, color: DROP },
      glow: { y: 0, blur: 18, color: SEAL_GLOW },
      star: 22,
    },
    ribbon: {
      font: 10,
      spacing: 2.5,
      padY: 3,
      padX: 10,
      below: 12,
      drop: { y: 3, blur: 8, color: RIBBON_DROP },
    },
  },
};
