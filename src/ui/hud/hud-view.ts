import type { ReadonlySignal, Signal } from '@preact/signals';
import { signal } from '@preact/signals';

import type { EffectId } from '@domain/effects/effect';
import type { PerSide, Side } from '@domain/shared/side';
import { bothSides } from '@domain/shared/side';

import type { BannerCopy, GameOverCopy, ToastCopy } from '@ui/copy/notice';
import type { PromptSpec } from '@ui/copy/prompt';

export interface BannerView extends BannerCopy {
  readonly id: number;
}

export interface StripView {
  readonly id: number;
  readonly side: Side;
}

export interface ToastView extends ToastCopy {
  readonly id: number;
  readonly duration: number;
  readonly leaving: boolean;
}

export interface RevealView {
  readonly id: number;
  readonly side: Side;
  readonly effect: EffectId;
  readonly shown: boolean;
}

export interface LifeHitView {
  readonly id: number;
  readonly delta: number;
  readonly hit: boolean;
}

export interface PromptView {
  readonly id: number;
  readonly spec: PromptSpec<unknown>;
  readonly choose: (answer: unknown) => void;
}

export interface PromptTimerView {
  readonly total: number;
  readonly left: number;
}

export interface HudSignals {
  readonly banner: Signal<BannerView | null>;
  readonly strip: Signal<StripView | null>;
  readonly toasts: Signal<readonly ToastView[]>;
  readonly reveal: Signal<RevealView | null>;
  readonly prompt: Signal<PromptView | null>;
  readonly promptTimer: Signal<PromptTimerView | null>;
  readonly lifeHits: Signal<PerSide<LifeHitView | null>>;
  readonly announcement: Signal<string>;
  readonly gameOver: Signal<GameOverCopy | null>;
}

type HudState = {
  readonly [K in keyof HudSignals]: ReadonlySignal<HudSignals[K]['value']>;
};

export interface HudView extends HudState {
  readonly dismissToast: (id: number) => void;
  readonly closeGameOver: () => void;
}

export const createHudSignals = (): HudSignals => ({
  banner: signal<BannerView | null>(null),
  strip: signal<StripView | null>(null),
  toasts: signal<readonly ToastView[]>([]),
  reveal: signal<RevealView | null>(null),
  prompt: signal<PromptView | null>(null),
  promptTimer: signal<PromptTimerView | null>(null),
  lifeHits: signal<PerSide<LifeHitView | null>>(bothSides(null)),
  announcement: signal(''),
  gameOver: signal<GameOverCopy | null>(null),
});
