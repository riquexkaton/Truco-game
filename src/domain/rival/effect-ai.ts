import type { EffectId } from '@domain/effects/effect';
import type { MatchState } from '@domain/match/match-state';
import type { Random } from '@domain/shared/random';
import { willHappen } from '@domain/shared/random';

const HEAL_BELOW_LIFE = 18;

interface EffectRule {
  readonly effect: EffectId;
  readonly wanted: (state: MatchState, random: Random) => boolean;
}

const EFFECT_RULES: readonly EffectRule[] = [
  { effect: 'golpe', wanted: () => true },
  { effect: 'sanacion', wanted: (state) => state.lives.rival <= HEAL_BELOW_LIFE },
  { effect: 'maldicion', wanted: (state) => state.hands.player.length > 0 },
  { effect: 'sello', wanted: (state) => state.effects.stored.player.length > 0 },
  {
    effect: 'saqueo',
    wanted: (state, random) =>
      state.hands.player.length > 0 && state.hands.rival.length > 0 && willHappen(random, 0.6),
  },
];

const preferredEffect = (state: MatchState, random: Random): EffectId | null =>
  EFFECT_RULES.find(
    (rule) => state.effects.stored.rival.includes(rule.effect) && rule.wanted(state, random),
  )?.effect ?? null;

export const rivalEffectChoice = (state: MatchState, random: Random): EffectId | null => {
  const effect = preferredEffect(state, random);
  return effect !== null && willHappen(random, 0.8) ? effect : null;
};

const DISCARD_PRIORITY: Readonly<Record<EffectId, number>> = {
  golpe: 5,
  maldicion: 4,
  sanacion: 3,
  saqueo: 2,
  sello: 1,
};

export const rivalDiscardIndex = (stored: readonly EffectId[]): number => {
  const lowest = Math.min(...stored.map((effect) => DISCARD_PRIORITY[effect]));
  return stored.findIndex((effect) => DISCARD_PRIORITY[effect] === lowest);
};
