export type FactionId = 'carnero' | 'cayado' | 'velo' | 'lirio';

export interface Faction {
  readonly id: FactionId;
  readonly name: string;
  readonly shortName: string;
  readonly color: string;
  readonly glow: number;
}

export const FACTION_IDS: readonly FactionId[] = ['carnero', 'cayado', 'velo', 'lirio'];

export const FACTIONS: Readonly<Record<FactionId, Faction>> = {
  carnero: {
    id: 'carnero',
    name: 'CARNERO',
    shortName: 'EL CARNERO',
    color: '#2C4E7A',
    glow: 0x6f_9a_d6,
  },
  cayado: {
    id: 'cayado',
    name: 'CAYADO',
    shortName: 'EL CAYADO',
    color: '#4E6B2E',
    glow: 0x93_c0_62,
  },
  velo: {
    id: 'velo',
    name: 'VELO',
    shortName: 'VELO ESCARLATA',
    color: '#8E2A2A',
    glow: 0xe0_62_5a,
  },
  lirio: {
    id: 'lirio',
    name: 'LIRIO',
    shortName: 'LIRIO DORADO',
    color: '#A8701A',
    glow: 0xf0_b2_50,
  },
};
