import type { GameEventOf } from '@application/ports/game-event';

import type { NoticeBuilders } from '@ui/copy/notice';
import { markNotice, sheetNotice, SILENT } from '@ui/copy/notice';
import { BET_NAMES, bySide, MINUS, num } from '@ui/copy/text';

type PactNotices = Pick<
  NoticeBuilders,
  'pactCalled' | 'pactRejected' | 'pactAccepted' | 'pactRevealed'
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
  return markNotice(
    by === 'player'
      ? { title: 'NO QUIERES', detail: `Rechazas el Pacto: pierdes ${amount}.`, tone: 'lose' }
      : { title: 'NO QUISO', detail: `El rival pierde ${amount}.`, tone: 'win', isRival: true },
  );
};

const acceptedNotice = ({ by, amount }: GameEventOf<'pactAccepted'>) => {
  const detail = `El Pacto vale ${num(amount)}: se revela al final de la ronda.`;
  return markNotice(
    by === 'player'
      ? { title: 'QUIERES', detail, tone: 'ink' }
      : { title: 'EL RIVAL QUISO', detail, tone: 'ink', isRival: true },
  );
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
  pactRevealed: revealedNotice,
};
