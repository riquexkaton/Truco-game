import type { FactionId } from '@domain/cards/faction';

type Entry = readonly [id: string, name: string, attack: number];

export interface FactionRoster {
  readonly legend: Entry;
  readonly perico: readonly [id: string, name: string];
  readonly perica: readonly [id: string, name: string];
  readonly normals: readonly Entry[];
}

export const ROSTER: Readonly<Record<FactionId, FactionRoster>> = {
  carnero: {
    legend: ['baltasar', 'BALTASAR', 12],
    perico: ['gaspar', 'GASPAR'],
    perica: ['brunilda', 'BRUNILDA'],
    normals: [
      ['garin', 'GARÍN', 10],
      ['ferran', 'FERRÁN', 8],
      ['morgana', 'MORGANA', 7],
      ['osric', 'OSRIC', 5],
      ['vidal', 'VIDAL', 3],
      ['rui', 'RUI', 2],
      ['teo', 'TEO', 1],
    ],
  },
  cayado: {
    legend: ['oriana', 'ORIANA', 11],
    perico: ['fermin', 'FERMÍN'],
    perica: ['rosalba', 'ROSALBA'],
    normals: [
      ['elio', 'ELIO', 10],
      ['saul', 'SAÚL', 9],
      ['tobias', 'TOBÍAS', 7],
      ['nilo', 'NILO', 6],
      ['bruno', 'BRUNO', 4],
      ['iraia', 'IRAIA', 2],
      ['paula', 'PAULA', 1],
    ],
  },
  velo: {
    legend: ['brigida', 'SOR BRÍGIDA', 11],
    perico: ['anselmo', 'FRAY ANSELMO'],
    perica: ['ursula', 'ÚRSULA'],
    normals: [
      ['isolda', 'SOR ISOLDA', 9],
      ['elvira', 'SOR ELVIRA', 8],
      ['ines', 'SOR INÉS', 6],
      ['noemi', 'SOR NOEMÍ', 5],
      ['ada', 'SOR ADA', 3],
      ['irene', 'SOR IRENE', 2],
      ['lucia', 'LUCÍA', 1],
    ],
  },
  lirio: {
    legend: ['alba', 'ALBA', 11],
    perico: ['melquiades', 'MELQUÍADES'],
    perica: ['barbara', 'BÁRBARA'],
    normals: [
      ['rafael', 'RAFAEL', 10],
      ['celia', 'CELIA', 9],
      ['matias', 'MATÍAS', 7],
      ['elena', 'ELENA', 6],
      ['leonor', 'LEONOR', 4],
      ['claudio', 'CLAUDIO', 3],
      ['amaia', 'AMAIA', 2],
    ],
  },
};
