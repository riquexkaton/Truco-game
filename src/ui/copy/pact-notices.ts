import type { GameEventOf } from '@application/ports/game-event';

import type { NoticeBuilders } from '@ui/copy/notice';
import { markNotice, sheetNotice, SILENT } from '@ui/copy/notice';
import { BET_NAMES, bySide, MINUS, num } from '@ui/copy/text';

type PactNotices = Pick<
  NoticeBuilders,
  'pactCalled' | 'pactRejected' | 'pactAccepted' | 'pactAnnulled' | 'pactRevealed'
>;

const pactCalledNotice = ({ by, bet, first }: GameEventOf<'pactCalled'>) => {
  if (by === 'rival') return SILENT;
  const name = BET_NAMES[bet.kind];
  return markNotice({
    title: first ? `CANTAS ${name}` : `SUBES · ${name}`,
    detail: `Quien pierda recibe ${num(bet.amount)}. Esperas la respuesta del rival.`,
    tone: 'ink',
  });
};

const rejectedNotice = ({ by, damage }: GameEventOf<'pactRejected'>) => {
  const amount = num(damage);
  if (by === 'player') {
    return markNotice({
      title: 'NO QUIERES',
      detail: `Rechazas el Pacto: pierdes ${amount}.`,
      tone: 'lose',
    });
  }
  return sheetNotice({
    isRival: true,
    seal: `${MINUS}${amount}`,
    tone: 'win',
    title: 'NO QUISO',
    body: 'El rival rechazó tu Pacto.',
    result: `EL RIVAL PIERDE ${amount}`,
  });
};

const acceptedNotice = ({ by, amount }: GameEventOf<'pactAccepted'>) => {
  const reveal = 'se revela al final de la ronda.';
  if (by === 'player') {
    return markNotice({
      title: 'QUIERES',
      detail: `El Pacto vale ${num(amount)}: ${reveal}`,
      tone: 'ink',
    });
  }
  return sheetNotice({
    isRival: true,
    seal: num(amount),
    tone: 'ink',
    title: 'EL RIVAL QUISO',
    body: `Acepta tu Pacto: ${reveal}`,
    result: `EN JUEGO · VALE ${num(amount)}`,
  });
};

const annulledNotice = ({ by }: GameEventOf<'pactAnnulled'>) => {
  if (by === 'player') {
    return markNotice({
      title: 'PACTO ANULADO',
      detail: 'Respondes con Ritual: el Pacto no cuenta.',
      tone: 'rule',
    });
  }
  return sheetNotice({
    isRival: true,
    seal: '×',
    tone: 'rule',
    title: 'PACTO ANULADO',
    body: 'El rival responde con Ritual.',
    result: 'NADIE RECIBE DAÑO',
  });
};

const valuesLine = ({ playerValue, rivalValue }: GameEventOf<'pactRevealed'>): string => {
  const values = `Tu Pacto: ${num(playerValue)}. El del rival: ${num(rivalValue)}.`;
  return playerValue === rivalValue ? `${values} Empate: gana quien empezó la ronda.` : values;
};

const revealedNotice = (event: GameEventOf<'pactRevealed'>) => {
  const { winner } = event;
  const amount = num(event.amount);
  return sheetNotice({
    seal: `${MINUS}${amount}`,
    tone: bySide(winner, 'win', 'lose'),
    title: bySide(winner, 'PACTO GANADO', 'PACTO PERDIDO'),
    body: valuesLine(event),
    result: bySide(winner, `EL RIVAL PIERDE ${amount}`, `PIERDES ${amount} DE VIDA`),
  });
};

export const PACT_NOTICES: PactNotices = {
  pactCalled: pactCalledNotice,
  pactRejected: rejectedNotice,
  pactAccepted: acceptedNotice,
  pactAnnulled: annulledNotice,
  pactRevealed: revealedNotice,
};
