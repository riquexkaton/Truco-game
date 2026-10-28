import type { CardId } from '@domain/cards/card';
import type { FactionId } from '@domain/cards/faction';
import type { Challenge } from '@domain/challenge/challenge';
import type { DuelResult } from '@domain/duel/duel';
import type { EffectId } from '@domain/effects/effect';
import type { Lives } from '@domain/life/life';
import type { PerSide, Side } from '@domain/shared/side';

export interface PlayedCard {
  readonly cardId: CardId;
  readonly cursed: boolean;
}

interface PendingPact {
  readonly winner: Side;
  readonly amount: number;
  readonly playerValue: number;
  readonly rivalValue: number;
}

interface PactState {
  readonly done: boolean;
  readonly pending: PendingPact | null;
}

interface RitualState {
  readonly sung: boolean;
  readonly available: PerSide<boolean>;
}

interface EffectsState {
  readonly stored: PerSide<readonly EffectId[]>;
  readonly deck: readonly EffectId[];
  readonly discard: readonly EffectId[];
}

export interface MatchState {
  readonly lives: Lives;
  readonly vira: FactionId;
  readonly hands: PerSide<readonly CardId[]>;
  readonly played: PerSide<readonly PlayedCard[]>;
  readonly duel: number;
  readonly results: readonly DuelResult[];
  readonly lead: Side;
  readonly roundLead: Side;
  readonly round: number;
  readonly challenge: Challenge;
  readonly stake: number;
  readonly pact: PactState;
  readonly ritual: RitualState;
  readonly effects: EffectsState;
  readonly curse: PerSide<boolean>;
  readonly seal: PerSide<boolean>;
  readonly usedEffectThisTurn: boolean;
  readonly roundOver: boolean;
  readonly roundWinner: Side | null;
  readonly retired: boolean;
  readonly over: boolean;
}
