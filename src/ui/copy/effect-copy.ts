import type { EffectId } from '@domain/effects/effect';
import type { Side } from '@domain/shared/side';

import { bySide, plural } from '@ui/copy/text';

export interface EffectCopy {
  readonly name: string;
  readonly description: string;
}

export const EFFECT_COPY: Readonly<Record<EffectId, EffectCopy>> = {
  golpe: { name: 'GOLPE', description: '2 de daño al campeón rival.' },
  sanacion: { name: 'SANACIÓN', description: 'Recuperas 2 de vida.' },
  saqueo: { name: 'SAQUEO', description: 'Robas una carta al azar al rival y le das una tuya.' },
  maldicion: { name: 'MALDICIÓN', description: '−4 de ataque a la próxima carta del rival.' },
  sello: { name: 'SELLO', description: 'Anula el próximo efecto del rival.' },
};

export const effectLabel = (effect: EffectId): string =>
  `${EFFECT_COPY[effect].name}: ${EFFECT_COPY[effect].description}`;

export const effectTitle = (effect: EffectId): string =>
  `${EFFECT_COPY[effect].name} · ${EFFECT_COPY[effect].description}`;

export const revealOwner = (side: Side): string => bySide(side, 'TÚ', 'RIVAL');

export const rivalEffectsLabel = (count: number): string =>
  `El rival guarda ${plural(count, 'efecto', 's')}`;
