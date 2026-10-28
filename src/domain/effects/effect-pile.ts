import type { EffectId } from '@domain/effects/effect';
import { EFFECT_COUNTS, EFFECT_IDS } from '@domain/effects/effect';
import type { Random } from '@domain/shared/random';
import { shuffle } from '@domain/shared/random';

export interface EffectPile {
  readonly deck: readonly EffectId[];
  readonly discard: readonly EffectId[];
}

export interface EffectDraw {
  readonly pile: EffectPile;
  readonly effect: EffectId | null;
}

export const newEffectDeck = (random: Random): EffectId[] =>
  shuffle(
    random,
    EFFECT_IDS.flatMap((effect) => Array.from({ length: EFFECT_COUNTS[effect] }, () => effect)),
  );

const restocked = (pile: EffectPile, random: Random): EffectPile =>
  pile.deck.length > 0 ? pile : { deck: shuffle(random, pile.discard), discard: [] };

export const drawFromPile = (pile: EffectPile, random: Random): EffectDraw => {
  const stocked = restocked(pile, random);
  const effect = stocked.deck.at(-1);
  return effect === undefined
    ? { pile: stocked, effect: null }
    : { pile: { ...stocked, deck: stocked.deck.slice(0, -1) }, effect };
};
