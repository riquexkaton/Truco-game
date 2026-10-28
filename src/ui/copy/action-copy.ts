import type { ChallengeView } from '@application/store/action-models';

import { num } from '@ui/copy/text';

export interface MenuItemCopy {
  readonly label: string;
  readonly note: string;
  readonly description: string;
}

export interface PactState {
  readonly ritualSung: boolean;
  readonly pendingAmount: number | null;
}

export const FOLD_COPY = {
  label: 'ME VOY',
  description: 'Me voy: abandonas la ronda y pierdes 1 de vida',
};

export const CANTAR_COPY = {
  label: 'CANTAR',
  description: 'Cantar: Ritual, Pacto o Desafío',
  menu: 'Cantar',
  ready: 'Ritual listo',
};

export const RITUAL_ITEM: MenuItemCopy = {
  label: 'RITUAL',
  note: 'LISTO',
  description:
    'Ritual: tus 3 cartas son de la misma facción. Hace 3 de daño y te da un efecto. Cántalo antes de jugar o lo pierdes',
};

const isContra = ({ level, holder }: ChallengeView): boolean => level === 1 && holder === 'player';

export const challengeItemCopy = (challenge: ChallengeView): MenuItemCopy => {
  const stake = num(challenge.stake);
  if (challenge.level === 0) {
    return { label: 'DESAFÍO', note: 'VALE 4', description: 'Desafío: subir la ronda a 4' };
  }
  if (isContra(challenge)) {
    return {
      label: 'CONTRA',
      note: 'VALE 6',
      description: `La ronda vale ${stake}. Contra-desafío: subirla a 6`,
    };
  }
  return { label: 'DESAFÍO', note: `VALE ${stake}`, description: `La ronda vale ${stake}` };
};

export const pactItemCopy = ({ ritualSung, pendingAmount }: PactState): MenuItemCopy => {
  if (ritualSung) {
    return {
      label: 'PACTO',
      note: 'ANULADO',
      description: 'Se cantó Ritual en esta ronda: el Ritual anula el Pacto',
    };
  }
  if (pendingAmount !== null) {
    const amount = num(pendingAmount);
    return {
      label: 'PACTO',
      note: `EN JUEGO · ${amount}`,
      description: `Pacto aceptado por ${amount}: el ganador se revela al final de la ronda`,
    };
  }
  return {
    label: 'PACTO',
    note: 'VALE 2',
    description:
      'Pacto (como el envido): 2 cartas de la misma facción suman +20; las de ataque 10 o más valen 0',
  };
};

export const pactStakeLabel = (amount: number): string => `PACTO · ${num(amount)}`;

export const roundStakeLabel = (stake: number): string => `RONDA · VALE ${num(stake)}`;
