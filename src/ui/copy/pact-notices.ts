import type { GameEventOf } from '@application/ports/game-event';

import type { NoticeBuilders } from '@ui/copy/notice';
import { toastNotice } from '@ui/copy/notice';
import { BET_NAMES, bySide, num } from '@ui/copy/text';

type PactNotices = Pick<
  NoticeBuilders,
  'pactCalled' | 'pactRejected' | 'pactAccepted' | 'pactAnnulled' | 'pactRevealed'
>;

const pactCalledTitle = ({ by, bet, first }: GameEventOf<'pactCalled'>): string => {
  if (by === 'rival') return 'EL RIVAL SUBE';
  return first ? `CANTAS ${BET_NAMES[bet.kind]}` : `SUBES · ${BET_NAMES[bet.kind]}`;
};

const pactCalledNotice = (event: GameEventOf<'pactCalled'>) =>
  toastNotice({
    title: pactCalledTitle(event),
    tag: 'PACTO',
    body: bySide(event.by, 'Esperando la respuesta del rival.', `${BET_NAMES[event.bet.kind]}.`),
    result: `QUIEN PIERDA RECIBE ${num(event.bet.amount)}`,
    tone: 'ink',
    seal: num(event.bet.amount),
  });

const pactRevealedNotice = ({
  winner,
  amount,
  playerValue,
  rivalValue,
}: GameEventOf<'pactRevealed'>) =>
  toastNotice({
    title: bySide(winner, 'PACTO GANADO', 'PACTO PERDIDO'),
    tag: 'REVELADO',
    body: `Tu ${num(playerValue)} contra su ${num(rivalValue)}.`,
    result: bySide(winner, `EL RIVAL PIERDE ${num(amount)}`, `PIERDES ${num(amount)} DE VIDA`),
    tone: bySide(winner, 'win', 'lose'),
    seal: num(playerValue),
  });

export const PACT_NOTICES: PactNotices = {
  pactCalled: pactCalledNotice,
  pactRejected: ({ by, damage }) =>
    toastNotice({
      title: bySide(by, 'NO QUIERES', 'NO QUISO'),
      tag: 'PACTO',
      body: bySide(by, 'Rechazaste el Pacto.', 'El rival rechazó tu Pacto.'),
      result: bySide(by, `PIERDES ${num(damage)}`, `EL RIVAL PIERDE ${num(damage)}`),
      tone: bySide(by, 'lose', 'win'),
      seal: num(damage),
    }),
  pactAccepted: ({ by, amount }) =>
    toastNotice({
      title: 'PACTO',
      tag: bySide(by, 'QUIERES', 'QUISO'),
      body: `${bySide(by, 'Aceptaste el Pacto.', 'El rival quiso tu Pacto.')} Se revela al final de la ronda.`,
      result: `EN JUEGO · VALE ${num(amount)}`,
      tone: 'ink',
      seal: num(amount),
    }),
  pactAnnulled: ({ by }) =>
    toastNotice({
      title: 'PACTO ANULADO',
      tag: 'RITUAL',
      body: `${bySide(by, 'Respondes', 'El rival responde')} con Ritual: el Pacto no cuenta.`,
      result: 'NADIE RECIBE DAÑO DEL PACTO',
      tone: 'rule',
      seal: '×',
    }),
  pactRevealed: pactRevealedNotice,
};
