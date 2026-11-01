import type { BetKind } from '@domain/pact/bet';

import type { GameEventOf } from '@application/ports/game-event';

import type { NoticeBuilders } from '@ui/copy/notice';
import { markNotice, sheetNotice, SILENT } from '@ui/copy/notice';
import { bySide, MINUS, num } from '@ui/copy/text';

type PactNotices = Pick<
  NoticeBuilders,
  'pactCalled' | 'pactRejected' | 'pactAccepted' | 'pactRevealed'
>;

const callVerb = (kind: BetKind, isOpening: boolean): string => {
  if (kind === 'repacto') return 'AVIVAS';
  return isOpening ? 'ENCIENDES' : 'SUBES';
};

const calledTitle = ({ bet, first }: GameEventOf<'pactCalled'>): string =>
  bet.kind === 'pacto'
    ? 'ENCIENDES LA LLAMA'
    : `${callVerb(bet.kind, first)} LA LLAMA · ${num(bet.amount)}`;

const pactCalledNotice = (event: GameEventOf<'pactCalled'>) => {
  if (event.by === 'rival') return SILENT;
  return markNotice({
    title: calledTitle(event),
    detail: `Quien pierda recibe ${num(event.bet.amount)}.`,
    tone: 'ink',
    isPending: true,
  });
};

const rejectedNotice = ({ by, damage }: GameEventOf<'pactRejected'>) => {
  const amount = num(damage);
  return markNotice(
    by === 'player'
      ? { title: 'NO QUIERES', detail: `Rechazas la Llama: pierdes ${amount}.`, tone: 'lose' }
      : { title: 'NO QUISO', detail: `El rival pierde ${amount}.`, tone: 'win', isRival: true },
  );
};

const acceptedNotice = ({ by, amount }: GameEventOf<'pactAccepted'>) => {
  const detail = `La Llama vale ${num(amount)}: se revela al final de la ronda.`;
  return markNotice(
    by === 'player'
      ? { title: 'QUIERES', detail, tone: 'ink' }
      : { title: 'EL RIVAL QUISO', detail, tone: 'ink', isRival: true },
  );
};

const valuesLine = ({ playerValue, rivalValue }: GameEventOf<'pactRevealed'>): string => {
  const values = `Tu Llama: ${num(playerValue)}. La del rival: ${num(rivalValue)}.`;
  return playerValue === rivalValue ? `${values} Empate: gana quien empezó la ronda.` : values;
};

const revealedNotice = (event: GameEventOf<'pactRevealed'>) => {
  const { winner } = event;
  const amount = num(event.amount);
  return sheetNotice({
    seal: `${MINUS}${amount}`,
    tone: bySide(winner, 'win', 'lose'),
    title: bySide(winner, 'LLAMA GANADA', 'LLAMA PERDIDA'),
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
