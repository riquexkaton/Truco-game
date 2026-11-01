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
  description: (damage: number): string =>
    `Me voy: abandonas la ronda y pierdes ${num(damage)} de vida`,
};

export const CANTAR_COPY = {
  label: 'CLAMAR',
  description: 'Clamar: Procesión, Llama o Desafío',
  menu: 'Clamar',
  ready: 'Procesión lista',
};

export const RITUAL_ITEM: MenuItemCopy = {
  label: 'PROCESIÓN',
  note: 'LISTA',
  description:
    'Procesión: tus 3 cartas son de la misma facción. Hace 3 de daño y te da un efecto. Sácala antes de jugar o la pierdes',
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
      label: 'LLAMA',
      note: 'ANULADA',
      description: 'Se sacó la Procesión en esta ronda: la Procesión anula la Llama',
    };
  }
  if (pendingAmount !== null) {
    const amount = num(pendingAmount);
    return {
      label: 'LLAMA',
      note: `EN JUEGO · ${amount}`,
      description: `Llama aceptada por ${amount}: el ganador se revela al final de la ronda`,
    };
  }
  return {
    label: 'LLAMA',
    note: 'VALE 2',
    description: 'Llama: 2 cartas de la misma facción suman +20; las de ataque 10 o más valen 0',
  };
};

export const pactStakeLabel = (amount: number): string => `LLAMA · ${num(amount)}`;

export const roundStakeLabel = (stake: number): string => `RONDA · VALE ${num(stake)}`;
