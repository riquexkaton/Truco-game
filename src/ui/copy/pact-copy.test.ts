import { describe, expect, it } from 'vitest';

import type { GameEvent } from '@application/ports/game-event';

import { noticeFor } from '@ui/copy/event-copy';

const headline = (fields: object) => ({ kind: 'headline', headline: fields });

const mark = (fields: object) => ({ kind: 'mark', mark: fields });

const CHALLENGE_CASES: [string, GameEvent, object][] = [
  [
    'challengeCalled',
    { type: 'challengeCalled', by: 'player', level: 2 },
    mark({ title: 'CONTRA-DESAFÍO', detail: 'LA RONDA PASARÍA A VALER 6' }),
  ],
  [
    'challengeAccepted with the word',
    { type: 'challengeAccepted', by: 'player', stake: 4, holder: 'player' },
    mark({ title: 'ACEPTAS', detail: 'LA RONDA VALE 4 · TIENES LA PALABRA' }),
  ],
  [
    'challengeAccepted by the rival',
    { type: 'challengeAccepted', by: 'rival', stake: 6, holder: null },
    headline({
      isRival: true,
      seal: '6',
      tone: 'lose',
      title: 'EL RIVAL ACEPTA',
      result: 'LA RONDA VALE 6',
    }),
  ],
];

const PACT_CASES: [string, GameEvent, object][] = [
  [
    'pactCalled by the player',
    { type: 'pactCalled', by: 'player', bet: { kind: 'pacto', amount: 2 }, first: true },
    mark({
      title: 'CANTAS PACTO',
      detail: 'Quien pierda recibe 2. Esperas la respuesta del rival.',
      tone: 'ink',
    }),
  ],
  [
    'pactCalled as a raise',
    { type: 'pactCalled', by: 'player', bet: { kind: 'repacto', amount: 4 }, first: false },
    mark({ title: 'SUBES · RE-PACTO' }),
  ],
  [
    'a rival raise, told by its prompt',
    { type: 'pactCalled', by: 'rival', bet: { kind: 'apuesta', amount: 7 }, first: false },
    { kind: 'silent' },
  ],
  [
    'pactRejected by the rival',
    { type: 'pactRejected', by: 'rival', damage: 2 },
    headline({
      isRival: true,
      seal: '−2',
      tone: 'win',
      title: 'NO QUISO',
      body: 'El rival rechazó tu Pacto.',
      result: 'EL RIVAL PIERDE 2',
    }),
  ],
  [
    'pactRejected by the player',
    { type: 'pactRejected', by: 'player', damage: 1 },
    mark({ title: 'NO QUIERES', detail: 'Rechazas el Pacto: pierdes 1.', tone: 'lose' }),
  ],
  [
    'pactAccepted by the rival',
    { type: 'pactAccepted', by: 'rival', amount: 4 },
    headline({ title: 'EL RIVAL QUISO', result: 'EN JUEGO · VALE 4' }),
  ],
  [
    'pactAnnulled by the player',
    { type: 'pactAnnulled', by: 'player' },
    mark({ title: 'PACTO ANULADO', detail: 'Respondes con Ritual: el Pacto no cuenta.' }),
  ],
  [
    'pactAnnulled by the rival',
    { type: 'pactAnnulled', by: 'rival' },
    headline({
      isRival: true,
      seal: '×',
      title: 'PACTO ANULADO',
      body: 'El rival responde con Ritual.',
      result: 'NADIE RECIBE DAÑO',
    }),
  ],
  [
    'pactRevealed',
    { type: 'pactRevealed', winner: 'rival', amount: 2, playerValue: 27, rivalValue: 31 },
    headline({
      seal: '−2',
      tone: 'lose',
      title: 'PACTO PERDIDO',
      body: 'Tu Pacto: 27. El del rival: 31.',
      result: 'PIERDES 2 DE VIDA',
    }),
  ],
  [
    'a tied pactRevealed',
    { type: 'pactRevealed', winner: 'player', amount: 4, playerValue: 25, rivalValue: 25 },
    headline({
      tone: 'win',
      title: 'PACTO GANADO',
      body: 'Tu Pacto: 25. El del rival: 25. Empate: gana quien empezó la ronda.',
      result: 'EL RIVAL PIERDE 4',
    }),
  ],
];

const EFFECT_CASES: [string, GameEvent, object][] = [
  ['effectGained', { type: 'effectGained', side: 'rival', effect: 'golpe' }, { kind: 'silent' }],
  [
    'effectUsed by the player',
    { type: 'effectUsed', side: 'player', effect: 'golpe' },
    { kind: 'reveal', side: 'player', effect: 'golpe', announcement: 'Usas GOLPE' },
  ],
  [
    'effectUsed by the rival',
    { type: 'effectUsed', side: 'rival', effect: 'golpe' },
    {
      ...headline({
        isRival: true,
        effect: 'golpe',
        title: 'GOLPE',
        body: 'El rival te golpea: recibes 2 de daño.',
      }),
      announcement: 'GOLPE. El rival te golpea: recibes 2 de daño.',
    },
  ],
  [
    'effectAnnulled',
    { type: 'effectAnnulled', side: 'player' },
    headline({ isRival: true, seal: '×', title: 'TU EFECTO, ANULADO' }),
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

describe('challenge, pact and effect copy', () => {
  it.each([...CHALLENGE_CASES, ...PACT_CASES, ...EFFECT_CASES])('maps %s', (_, event, expected) => {
    expect(noticeFor(event)).toMatchObject(expected);
  });
});
