import { describe, expect, it } from 'vitest';

import type { GameEvent } from '@application/ports/game-event';

import { noticeFor } from '@ui/copy/event-copy';

const banner = (title: string, subtitle: string) => ({
  kind: 'banner',
  banner: { title, subtitle },
});

const toast = (fields: object) => ({ kind: 'toast', toast: fields });

const CHALLENGE_CASES: [string, GameEvent, object][] = [
  [
    'challengeCalled',
    { type: 'challengeCalled', by: 'player', level: 2 },
    banner('CONTRA-DESAFÍO', 'LA RONDA PASARÍA A VALER 6'),
  ],
  [
    'challengeAccepted with the word',
    { type: 'challengeAccepted', by: 'player', stake: 4, holder: 'player' },
    banner('ACEPTAS', 'LA RONDA VALE 4 · TIENES LA PALABRA'),
  ],
  [
    'challengeAccepted by the rival',
    { type: 'challengeAccepted', by: 'rival', stake: 6, holder: null },
    banner('EL RIVAL ACEPTA', 'LA RONDA VALE 6'),
  ],
];

const PACT_CASES: [string, GameEvent, object][] = [
  [
    'pactCalled by the player',
    { type: 'pactCalled', by: 'player', bet: { kind: 'pacto', amount: 2 }, first: true },
    toast({
      title: 'CANTAS PACTO',
      tag: 'PACTO',
      body: 'Esperando la respuesta del rival.',
      result: 'QUIEN PIERDA RECIBE 2',
      tone: 'ink',
      seal: '2',
    }),
  ],
  [
    'pactCalled as a raise',
    { type: 'pactCalled', by: 'player', bet: { kind: 'repacto', amount: 4 }, first: false },
    toast({ title: 'SUBES · RE-PACTO' }),
  ],
  [
    'pactCalled by the rival',
    { type: 'pactCalled', by: 'rival', bet: { kind: 'apuesta', amount: 7 }, first: false },
    toast({ title: 'EL RIVAL SUBE', body: 'APUESTA.', result: 'QUIEN PIERDA RECIBE 7' }),
  ],
  [
    'pactRejected',
    { type: 'pactRejected', by: 'rival', damage: 2 },
    toast({
      title: 'NO QUISO',
      body: 'El rival rechazó tu Pacto.',
      result: 'EL RIVAL PIERDE 2',
      tone: 'win',
    }),
  ],
  [
    'pactAccepted',
    { type: 'pactAccepted', by: 'rival', amount: 4 },
    toast({
      title: 'PACTO',
      tag: 'QUISO',
      body: 'El rival quiso tu Pacto. Se revela al final de la ronda.',
      result: 'EN JUEGO · VALE 4',
    }),
  ],
  [
    'pactAnnulled',
    { type: 'pactAnnulled', by: 'player' },
    toast({
      title: 'PACTO ANULADO',
      tag: 'RITUAL',
      body: 'Respondes con Ritual: el Pacto no cuenta.',
      result: 'NADIE RECIBE DAÑO DEL PACTO',
      tone: 'rule',
    }),
  ],
  [
    'pactRevealed',
    { type: 'pactRevealed', winner: 'rival', amount: 2, playerValue: 27, rivalValue: 31 },
    toast({
      title: 'PACTO PERDIDO',
      tag: 'REVELADO',
      body: 'Tu 27 contra su 31.',
      result: 'PIERDES 2 DE VIDA',
      tone: 'lose',
      seal: '27',
    }),
  ],
];

const EFFECT_CASES: [string, GameEvent, object][] = [
  ['effectGained', { type: 'effectGained', side: 'rival', effect: 'golpe' }, { kind: 'silent' }],
  [
    'effectUsed',
    { type: 'effectUsed', side: 'rival', effect: 'golpe' },
    { kind: 'reveal', side: 'rival', effect: 'golpe', announcement: 'El rival usa GOLPE' },
  ],
  ['effectAnnulled', { type: 'effectAnnulled', side: 'player' }, banner('ANULADO', 'POR UN SELLO')],
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
