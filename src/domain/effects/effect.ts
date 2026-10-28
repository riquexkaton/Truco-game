export type EffectId = 'golpe' | 'sanacion' | 'saqueo' | 'maldicion' | 'sello';

export const EFFECT_IDS: readonly EffectId[] = [
  'golpe',
  'sanacion',
  'saqueo',
  'maldicion',
  'sello',
];

export const EFFECT_COUNTS: Readonly<Record<EffectId, number>> = {
  golpe: 5,
  sanacion: 5,
  saqueo: 3,
  maldicion: 4,
  sello: 3,
};

export const MAX_STORED_EFFECTS = 2;

export const STRIKE_DAMAGE = 2;

export const HEAL_AMOUNT = 2;

export const removeFirst = (effects: readonly EffectId[], effect: EffectId): EffectId[] => {
  const index = effects.indexOf(effect);
  return index === -1 ? [...effects] : effects.toSpliced(index, 1);
};
