import type { ReadonlySignal, Signal } from '@preact/signals';
import { signal } from '@preact/signals';

import type { EffectId } from '@domain/effects/effect';
import type { PerSide, Side } from '@domain/shared/side';
import { bothSides } from '@domain/shared/side';

import type { MarkCopy, SheetHeadline } from '@ui/copy/headline';
import type { BannerCopy, GameOverCopy } from '@ui/copy/notice';
import type { PromptSpec } from '@ui/copy/prompt';
import type { TableView } from '@ui/hud/table-watch';

export interface BannerView extends BannerCopy {
  readonly id: number;
}

export interface StripView {
  readonly id: number;
  readonly side: Side;
}

export interface HeadlineView {
  readonly id: number;
  readonly headline: SheetHeadline;
  readonly text: string;
}

export interface MarkView extends MarkCopy {
  readonly id: number;
}

export interface RevealView {
  readonly id: number;
  readonly side: Side;
  readonly effect: EffectId;
  readonly line: string;
  readonly annulled: boolean;
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
  readonly headline: Signal<HeadlineView | null>;
  readonly mark: Signal<MarkView | null>;
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

export interface HudView extends HudState, TableView {
  readonly dismissHeadline: () => void;
  readonly closeGameOver: () => void;
}

export const createHudSignals = (): HudSignals => ({
  banner: signal<BannerView | null>(null),
  strip: signal<StripView | null>(null),
  headline: signal<HeadlineView | null>(null),
  mark: signal<MarkView | null>(null),
  reveal: signal<RevealView | null>(null),
  prompt: signal<PromptView | null>(null),
  promptTimer: signal<PromptTimerView | null>(null),
  lifeHits: signal<PerSide<LifeHitView | null>>(bothSides(null)),
  announcement: signal(''),
  gameOver: signal<GameOverCopy | null>(null),
});
