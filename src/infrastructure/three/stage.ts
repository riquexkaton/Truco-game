import type {
  PerspectiveCamera,
  PointLight,
  Scene,
  Sprite,
  Texture,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';

import type { CardId } from '@domain/cards/card';
import type { FactionId } from '@domain/cards/faction';
import type { Side } from '@domain/shared/side';

import type { Scheduler } from '@application/ports/scheduler';
import type { GameStore } from '@application/store/game-store';

import type { ArtLibrary } from '@infrastructure/browser/art-library';
import type { DuelGlow } from '@infrastructure/three/cards/duel-glows';
import type { TableDeck } from '@infrastructure/three/cards/table-deck';
import type { CoinTable } from '@infrastructure/three/coins/coin-table';
import type { Layout, LayoutKey } from '@infrastructure/three/layout/layouts';
import type { Background } from '@infrastructure/three/scene/background';
import type { Candle } from '@infrastructure/three/scene/candles';

export interface StageView {
  readonly renderer: WebGLRenderer;
  readonly scene: Scene;
  readonly camera: PerspectiveCamera;
  readonly background: Background;
  readonly backgrounds: Readonly<Record<LayoutKey, Texture | null>>;
  readonly candles: readonly Candle[];
  readonly handLight: PointLight;
  readonly environment: WebGLRenderTarget;
}

export interface StagePieces {
  readonly glows: readonly DuelGlow[];
  readonly deck: TableDeck;
  readonly coins: CoinTable;
  readonly marks: Sprite[];
}

interface StageServices {
  readonly reducedMotion: boolean;
  readonly scheduler: Scheduler;
  readonly art: ArtLibrary<ImageBitmap>;
  readonly store: GameStore;
}

interface StageState {
  readonly hands: Record<Side, CardId[]>;
  readonly played: CardId[];
  vira: FactionId | null;
  layout: Layout;
  isClearing: boolean;
  shadowsDirty: boolean;
}

export interface Stage extends StageView, StagePieces, StageServices, StageState {}
