import type { PerSide, Side } from '@domain/shared/side';
import { bothSides, withSide } from '@domain/shared/side';

export const MAX_LIFE = 20;

export type Lives = PerSide<number>;

export interface LifeChange {
  readonly side: Side;
  readonly amount: number;
}

export interface AppliedLifeChange {
  readonly lives: Lives;
  readonly change: number;
}

export const fullLives = (): Lives => bothSides(MAX_LIFE);

const clampLife = (value: number): number => Math.max(0, Math.min(MAX_LIFE, value));

export const applyLifeChange = (lives: Lives, { side, amount }: LifeChange): AppliedLifeChange => {
  const after = clampLife(lives[side] + amount);
  return { lives: withSide(lives, side, after), change: after - lives[side] };
};

export const isDefeated = (lives: Lives): boolean => lives.player <= 0 || lives.rival <= 0;

export const survivorOf = (lives: Lives): Side | null => {
  if (lives.rival <= 0) return 'player';
  if (lives.player <= 0) return 'rival';
  return null;
};
