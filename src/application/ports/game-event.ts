import type { CardId } from '@domain/cards/card';
import type { FactionId } from '@domain/cards/faction';
import type { RaisedLevel } from '@domain/challenge/challenge';
import type { DuelResult } from '@domain/duel/duel';
import type { EffectId } from '@domain/effects/effect';
import type { Bet } from '@domain/pact/bet';
import type { PerSide, Side } from '@domain/shared/side';

export interface DuelCard {
  readonly cardId: CardId;
  readonly attack: number;
}

export type RetireReason = 'retire' | 'fold';

export type GameEvent =
  | {
      readonly type: 'roundStarted';
      readonly round: number;
      readonly lead: Side;
      readonly vira: FactionId;
    }
  | { readonly type: 'turnStarted'; readonly side: Side }
  | { readonly type: 'ritualSung'; readonly side: Side }
  | { readonly type: 'ritualLost' }
  | {
      readonly type: 'duelResolved';
      readonly duel: number;
      readonly result: DuelResult;
      readonly player: DuelCard;
      readonly rival: DuelCard;
      readonly wins: PerSide<number>;
    }
  | { readonly type: 'effectEarned'; readonly side: Side; readonly cardId: CardId }
  | { readonly type: 'effectGained'; readonly side: Side; readonly effect: EffectId }
  | { readonly type: 'challengeCalled'; readonly by: Side; readonly level: RaisedLevel }
  | {
      readonly type: 'challengeAccepted';
      readonly by: Side;
      readonly stake: number;
      readonly holder: Side | null;
    }
  | {
      readonly type: 'retired';
      readonly side: Side;
      readonly damage: number;
      readonly reason: RetireReason;
    }
  | { readonly type: 'pactCalled'; readonly by: Side; readonly bet: Bet; readonly first: boolean }
  | { readonly type: 'pactRejected'; readonly by: Side; readonly damage: number }
  | { readonly type: 'pactAccepted'; readonly by: Side; readonly amount: number }
  | { readonly type: 'pactAnnulled'; readonly by: Side }
  | {
      readonly type: 'pactRevealed';
      readonly winner: Side;
      readonly amount: number;
      readonly playerValue: number;
      readonly rivalValue: number;
    }
  | { readonly type: 'roundEnded'; readonly winner: Side | null; readonly stake: number }
  | { readonly type: 'effectUsed'; readonly side: Side; readonly effect: EffectId }
  | { readonly type: 'effectAnnulled'; readonly side: Side }
  | { readonly type: 'plundered'; readonly side: Side }
  | {
      readonly type: 'lifeChanged';
      readonly side: Side;
      readonly delta: number;
      readonly life: number;
    }
  | { readonly type: 'turnTimedOut'; readonly cardId: CardId }
  | {
      readonly type: 'matchOver';
      readonly winner: Side;
      readonly life: number;
      readonly rounds: number;
    };

export type GameEventType = GameEvent['type'];

export type GameEventOf<T extends GameEventType> = Extract<GameEvent, { readonly type: T }>;
