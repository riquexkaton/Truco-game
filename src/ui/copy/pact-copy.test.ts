import { describe, expect, it } from 'vitest';

import type { GameEvent } from '@application/ports/game-event';

import { noticeFor } from '@ui/copy/event-copy';

const headline = (fields: object) => ({ kind: 'headline', headline: fields });

const rivalMark = (fields: object) => mark({ ...fields, isRival: true });

const mark = (fields: object) => ({ kind: 'mark', mark: fields });

const CHALLENGE_CASES: [string, GameEvent, object][] = [
  [
    'challengeCalled',
    { type: 'challengeCalled', by: 'player', level: 2 },
    {
      ...mark({
        title: 'CONTRA-DESAFÍO',
        detail: 'La ronda pasaría a valer 6.',
        tone: 'lose',
        isPending: true,
      }),
      announcement: 'CONTRA-DESAFÍO. La ronda pasaría a valer 6.',
    },
  ],
  [
    'challengeAccepted with the word',
    { type: 'challengeAccepted', by: 'player', stake: 4, holder: 'player' },
    mark({ title: 'ACEPTAS', detail: 'LA RONDA VALE 4 · TIENES LA PALABRA' }),
  ],
  [
    'challengeAccepted by the rival',
    { type: 'challengeAccepted', by: 'rival', stake: 6, holder: null },
    {
      ...rivalMark({ title: 'EL RIVAL ACEPTA', detail: 'La ronda vale 6.', tone: 'lose' }),
      announcement: 'EL RIVAL ACEPTA. La ronda vale 6.',
    },
  ],
];

const PACT_CASES: [string, GameEvent, object][] = [
  [
    'pactCalled by the player',
    { type: 'pactCalled', by: 'player', bet: { kind: 'pacto', amount: 2 }, first: true },
    {
      ...mark({
        title: 'ENCIENDES LA LLAMA',
        detail: 'Quien pierda recibe 2.',
        tone: 'ink',
        isPending: true,
      }),
      announcement: 'ENCIENDES LA LLAMA. Quien pierda recibe 2.',
    },
  ],
  [
    'pactCalled as a raise',
    { type: 'pactCalled', by: 'player', bet: { kind: 'repacto', amount: 4 }, first: false },
    mark({ title: 'AVIVAS LA LLAMA · 4', detail: 'Quien pierda recibe 4.', isPending: true }),
  ],
  [
    'pactCalled with a wager',
    { type: 'pactCalled', by: 'player', bet: { kind: 'apuesta', amount: 9 }, first: true },
    mark({ title: 'ENCIENDES LA LLAMA · 9', detail: 'Quien pierda recibe 9.' }),
  ],
  [
    'pactCalled as a raised wager',
    { type: 'pactCalled', by: 'player', bet: { kind: 'apuesta', amount: 7 }, first: false },
    mark({ title: 'SUBES LA LLAMA · 7', detail: 'Quien pierda recibe 7.' }),
  ],
  [
    'a rival raise, told by its prompt',
    { type: 'pactCalled', by: 'rival', bet: { kind: 'apuesta', amount: 7 }, first: false },
    { kind: 'silent' },
  ],
  [
    'pactRejected by the rival',
    { type: 'pactRejected', by: 'rival', damage: 2 },
    rivalMark({ title: 'NO QUISO', detail: 'El rival pierde 2.', tone: 'win' }),
  ],
  [
    'pactRejected by the player',
    { type: 'pactRejected', by: 'player', damage: 1 },
    mark({ title: 'NO QUIERES', detail: 'Rechazas la Llama: pierdes 1.', tone: 'lose' }),
  ],
  [
    'pactAccepted by the rival',
    { type: 'pactAccepted', by: 'rival', amount: 4 },
    rivalMark({
      title: 'EL RIVAL QUISO',
      detail: 'La Llama vale 4: se revela al final de la ronda.',
      tone: 'ink',
    }),
  ],
  [
    'pactRevealed',
    { type: 'pactRevealed', winner: 'rival', amount: 2, playerValue: 27, rivalValue: 31 },
    headline({
      seal: '−2',
      tone: 'lose',
      title: 'LLAMA PERDIDA',
      body: 'Tu Llama: 27. La del rival: 31.',
      result: 'PIERDES 2 DE VIDA',
    }),
  ],
  [
    'a tied pactRevealed',
    { type: 'pactRevealed', winner: 'player', amount: 4, playerValue: 25, rivalValue: 25 },
    headline({
      tone: 'win',
      title: 'LLAMA GANADA',
      body: 'Tu Llama: 25. La del rival: 25. Empate: gana quien empezó la ronda.',
      result: 'EL RIVAL PIERDE 4',
    }),
  ],
];

const EFFECT_CASES: [string, GameEvent, object][] = [
  ['effectGained', { type: 'effectGained', side: 'rival', effect: 'golpe' }, { kind: 'silent' }],
  [
    'effectUsed by the player',
    { type: 'effectUsed', side: 'player', effect: 'golpe' },
    {
      kind: 'reveal',
      side: 'player',
      effect: 'golpe',
      line: '2 de daño al campeón rival.',
      announcement: 'Usas GOLPE',
    },
  ],
  [
    'effectUsed by the rival',
    { type: 'effectUsed', side: 'rival', effect: 'golpe' },
    {
      kind: 'reveal',
      side: 'rival',
      effect: 'golpe',
      line: 'El rival te golpea: recibes 2 de daño.',
      announcement: 'El rival usa GOLPE. El rival te golpea: recibes 2 de daño.',
    },
  ],
  [
    'the player’s effect annulled',
    { type: 'effectAnnulled', side: 'player' },
    { kind: 'annul', side: 'player', line: 'El Sello del rival lo anula.' },
  ],
  [
    'the rival’s effect annulled',
    { type: 'effectAnnulled', side: 'rival' },
    {
      kind: 'annul',
      side: 'rival',
      line: 'Tu Sello lo anula.',
      announcement: 'ANULADO. Tu Sello lo anula.',
    },
  ],
  [
    'plundered',
    { type: 'plundered', side: 'rival' },
    { kind: 'announce', announcement: 'Saqueo: el rival te quitó una carta' },
  ],
  [
    'lifeChanged',
    { type: 'lifeChanged', side: 'player', delta: -2, life: 18 },
    { kind: 'life', side: 'player', delta: -2, announcement: 'Tu vida: 18' },
  ],
];

const ANSWERS: GameEvent[] = [
  { type: 'challengeAccepted', by: 'rival', stake: 4, holder: null },
  { type: 'pactAccepted', by: 'rival', amount: 4 },
  { type: 'pactRejected', by: 'rival', damage: 2 },
];

describe('challenge, pact and effect copy', () => {
  it.each([...CHALLENGE_CASES, ...PACT_CASES, ...EFFECT_CASES])('maps %s', (_, event, expected) => {
    expect(noticeFor(event)).toMatchObject(expected);
  });

  it.each(ANSWERS)('shows the rival’s $type as settled, not pending', (event) => {
    const notice = noticeFor(event);
    expect(notice).toMatchObject({ kind: 'mark' });
    expect(notice).not.toMatchObject({ mark: { isPending: true } });
  });
});
