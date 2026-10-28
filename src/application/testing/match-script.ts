import type { CardId } from '@domain/cards/card';
import { CARD_IDS } from '@domain/cards/deck';
import type { FactionId } from '@domain/cards/faction';
import { FACTION_IDS } from '@domain/cards/faction';
import type { EffectId } from '@domain/effects/effect';
import { EFFECT_COUNTS, EFFECT_IDS, removeFirst } from '@domain/effects/effect';
import { itemAt } from '@domain/shared/random';
import type { ScriptedRandom } from '@domain/shared/scripted-random';
import { scriptedRandom } from '@domain/shared/scripted-random';
import type { Side } from '@domain/shared/side';

interface RoundScript {
  readonly lead: Side;
  readonly vira: FactionId;
  readonly player: readonly CardId[];
  readonly rival: readonly CardId[];
}

export interface MatchScript {
  readonly round: RoundScript;
  readonly draws?: readonly EffectId[];
  readonly rolls?: readonly number[];
}

export const ALWAYS = 0.01;
export const NEVER = 0.99;

const EFFECT_POOL: readonly EffectId[] = EFFECT_IDS.flatMap((effect) =>
  Array.from({ length: EFFECT_COUNTS[effect] }, () => effect),
);

const shuffleValues = <T>(items: readonly T[], target: readonly T[]): number[] => {
  const current = [...items];
  const values: number[] = [];
  for (let index = current.length - 1; index > 0; index -= 1) {
    const from = current.indexOf(itemAt(target, index));
    values.push((from + 0.5) / (index + 1));
    const moved = itemAt(current, from);
    current[from] = itemAt(current, index);
    current[index] = moved;
  }
  return values;
};

const effectDeckValues = (draws: readonly EffectId[]): number[] => {
  let rest: readonly EffectId[] = EFFECT_POOL;
  for (const effect of draws) {
    rest = removeFirst(rest, effect);
  }
  return shuffleValues(EFFECT_POOL, [...rest, ...draws.toReversed()]);
};

const roundValues = ({ lead, vira, player, rival }: RoundScript): number[] => {
  const dealt = [...player, ...rival];
  const order = [...dealt, ...CARD_IDS.filter((id) => !dealt.includes(id))];
  return [
    lead === 'player' ? 0.25 : 0.75,
    (FACTION_IDS.indexOf(vira) + 0.5) / FACTION_IDS.length,
    ...shuffleValues(CARD_IDS, order),
  ];
};

export const matchRandom = ({ round, draws = [], rolls = [] }: MatchScript): ScriptedRandom =>
  scriptedRandom(...effectDeckValues(draws), ...roundValues(round), ...rolls, NEVER);
