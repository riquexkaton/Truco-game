import { describe, expect, it } from 'vitest';

import type { GameEvent, GameEventOf } from '@application/ports/game-event';

import { noticeFor } from '@ui/copy/event-copy';

const banner = (title: string, subtitle: string, extra: object = {}) => ({
  kind: 'banner',
  banner: { title, subtitle, ...extra },
});

const toast = (fields: object) => ({ kind: 'toast', toast: fields });

const duel = (result: 'player' | 'rival' | 'tie', duelIndex = 0): GameEventOf<'duelResolved'> => ({
  type: 'duelResolved',
  duel: duelIndex,
  result,
  player: { cardId: 'ines', attack: 6 },
  rival: { cardId: 'garin', attack: 10 },
  wins: { player: 1, rival: 2 },
});

const ROUND_CASES: [string, GameEvent, object][] = [
  [
    'roundStarted',
    { type: 'roundStarted', round: 2, lead: 'rival', vira: 'velo' },
    {
      ...banner('RONDA 2', 'SE REPARTEN 3 CARTAS · EMPIEZA EL RIVAL', {
        seal: { value: 'II', caption: '' },
        duration: 1500,
      }),
      announcement: 'Vira: VELO. RONDA 2. SE REPARTEN 3 CARTAS · EMPIEZA EL RIVAL',
    },
  ],
  ['turnStarted', { type: 'turnStarted', side: 'player' }, { kind: 'strip', side: 'player' }],
  [
    'roundEnded with a winner',
    { type: 'roundEnded', winner: 'player', stake: 4 },
    banner('GANAS LA RONDA', 'EL RIVAL PIERDE 4', {
      kind: 'win',
      seal: { value: '4', caption: 'VALÍA' },
      duration: 1400,
    }),
  ],
  [
    'roundEnded tied',
    { type: 'roundEnded', winner: null, stake: 2 },
    banner('RONDA EMPATADA', 'NADIE RECIBE DAÑO', { duration: 1300 }),
  ],
  [
    'retired by folding',
    { type: 'retired', side: 'player', damage: 1, reason: 'fold' },
    banner('TE VAS', 'PIERDES 1 DE VIDA', { kind: 'lose', seal: { value: '−1', caption: '' } }),
  ],
  [
    'retired rival',
    { type: 'retired', side: 'rival', damage: 4, reason: 'retire' },
    banner('EL RIVAL SE RETIRA', 'EL RIVAL PIERDE 4', { kind: 'win' }),
  ],
  [
    'matchOver',
    { type: 'matchOver', winner: 'rival', life: 0, rounds: 1 },
    {
      kind: 'gameOver',
      gameOver: { winner: 'rival', title: 'DERROTA', subtitle: '0 DE VIDA · 1 RONDA' },
      announcement: 'Derrota',
    },
  ],
];

const DUEL_CASES: [string, GameEvent, object][] = [
  [
    'duel won',
    {
      ...duel('player'),
      player: { cardId: 'garin', attack: 10 },
      rival: { cardId: 'ines', attack: 6 },
    },
    toast({
      title: 'DUELO GANADO',
      tag: 'DUELO 1',
      body: 'Garín (10) vence a Sor Inés (6).',
      result: 'LLEVAS 1 DE 3',
      tone: 'win',
      seal: '10',
    }),
  ],
  [
    'duel lost',
    duel('rival', 1),
    toast({
      title: 'DUELO PERDIDO',
      tag: 'DUELO 2',
      body: 'Sor Inés (6) cae ante Garín (10).',
      result: 'EL RIVAL LLEVA 2',
      tone: 'lose',
      seal: '6',
    }),
  ],
  [
    'duel tied',
    duel('tie'),
    toast({
      title: 'EMPATE',
      body: 'Sor Inés y Garín se anulan (6).',
      result: 'DECIDE EL SIGUIENTE DUELO',
      tone: 'tie',
    }),
  ],
  [
    'effectEarned',
    { type: 'effectEarned', side: 'rival', cardId: 'garin' },
    toast({
      title: 'SELLO',
      tag: 'EFECTO',
      body: 'Garín lleva sello.',
      result: 'EL RIVAL GANA UN EFECTO',
      tone: 'lose',
      seal: '★',
    }),
  ],
  [
    'ritualSung',
    { type: 'ritualSung', side: 'player' },
    banner('RITUAL', 'CANTAS RITUAL · EL RIVAL RECIBE 3 Y TOMAS UN EFECTO', { duration: 1600 }),
  ],
  [
    'ritualLost',
    { type: 'ritualLost' },
    toast({
      title: 'RITUAL PERDIDO',
      tag: 'RITUAL',
      body: 'No lo cantaste antes de jugar.',
      tone: 'rule',
      seal: '×',
    }),
  ],
  [
    'turnTimedOut',
    { type: 'turnTimedOut', cardId: 'teo' },
    toast({
      title: 'SE ACABÓ EL TIEMPO',
      body: 'Se jugó Teo, tu carta más baja.',
      tone: 'lose',
      seal: '0',
    }),
  ],
];

describe('round and duel copy', () => {
  it.each([...ROUND_CASES, ...DUEL_CASES])('maps %s', (_, event, expected) => {
    expect(noticeFor(event)).toMatchObject(expected);
  });

  it('announces toasts with title, body and result', () => {
    expect(noticeFor(duel('rival'))).toMatchObject({
      announcement: 'DUELO PERDIDO. Sor Inés (6) cae ante Garín (10).. EL RIVAL LLEVA 2',
    });
  });
});
