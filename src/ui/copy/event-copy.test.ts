import { describe, expect, it } from 'vitest';

import type { GameEvent, GameEventOf } from '@application/ports/game-event';

import { noticeFor } from '@ui/copy/event-copy';

const banner = (title: string, subtitle: string, extra: object = {}) => ({
  kind: 'banner',
  banner: { title, subtitle, ...extra },
});

const mark = (fields: object) => ({ kind: 'mark', mark: fields });

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
      clearsSheet: true,
    },
  ],
  ['turnStarted', { type: 'turnStarted', side: 'player' }, { kind: 'strip', side: 'player' }],
  [
    'roundEnded with a winner',
    { type: 'roundEnded', winner: 'player', stake: 4 },
    {
      ...banner('GANAS LA RONDA', 'EL RIVAL PIERDE 4', {
        kind: 'win',
        seal: { value: '−4', caption: '' },
        duration: 1400,
      }),
      clearsSheet: false,
    },
  ],
  [
    'roundEnded lost',
    { type: 'roundEnded', winner: 'rival', stake: 2 },
    banner('PIERDES LA RONDA', 'PIERDES 2 DE VIDA', { kind: 'lose' }),
  ],
  [
    'roundEnded tied',
    { type: 'roundEnded', winner: null, stake: 2 },
    banner('RONDA EMPATADA', 'NADIE RECIBE DAÑO', { kind: 'plain', seal: null, duration: 1400 }),
  ],
  [
    'the player folding',
    { type: 'retired', side: 'player', damage: 4, reason: 'fold' },
    banner('TE VAS', 'PIERDES 4 DE VIDA', { kind: 'lose', seal: { value: '−4', caption: '' } }),
  ],
  [
    'the player retiring',
    { type: 'retired', side: 'player', damage: 1, reason: 'retire' },
    banner('TE RETIRAS', 'PIERDES 1 DE VIDA', { kind: 'lose' }),
  ],
  [
    'the rival retiring',
    { type: 'retired', side: 'rival', damage: 1, reason: 'retire' },
    {
      ...banner('EL RIVAL SE RETIRA', 'EL RIVAL PIERDE 1', { kind: 'win', duration: 1400 }),
      announcement: 'EL RIVAL SE RETIRA. EL RIVAL PIERDE 1',
    },
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
    'a duel won, told only to the screen reader',
    {
      ...duel('player'),
      player: { cardId: 'garin', attack: 10 },
      rival: { cardId: 'ines', attack: 6 },
    },
    {
      kind: 'announce',
      announcement: 'DUELO 1 GANADO. Garín (10) vence a Sor Inés (6). LLEVAS 1 DE 3.',
    },
  ],
  [
    'a duel lost, told only to the screen reader',
    duel('rival', 1),
    {
      kind: 'announce',
      announcement: 'DUELO 2 PERDIDO. Sor Inés (6) cae ante Garín (10). EL RIVAL LLEVA 2.',
    },
  ],
  [
    'a duel tied',
    duel('tie'),
    mark({ title: 'EMPATE', detail: 'Sor Inés y Garín se anulan (6).', tone: 'tie' }),
  ],
  [
    'effectEarned',
    { type: 'effectEarned', side: 'rival', cardId: 'garin' },
    mark({ title: 'SELLO', detail: 'Garín lleva sello: el rival gana un efecto.', tone: 'lose' }),
  ],
  [
    'ritualSung',
    { type: 'ritualSung', side: 'player', annulsPact: false },
    banner('RITUAL', 'CANTAS RITUAL · EL RIVAL RECIBE 3 Y TOMAS UN EFECTO', { duration: 1600 }),
  ],
  [
    'a rival Ritual that annuls the Pacto',
    { type: 'ritualSung', side: 'rival', annulsPact: true },
    banner('RITUAL', 'EL RIVAL CANTA RITUAL Y ANULA TU PACTO · RECIBES 3'),
  ],
  [
    'a Ritual answer that annuls the rival’s Pacto',
    { type: 'ritualSung', side: 'player', annulsPact: true },
    banner('RITUAL', 'CANTAS RITUAL Y ANULAS SU PACTO · EL RIVAL RECIBE 3'),
  ],
  [
    'ritualLost',
    { type: 'ritualLost' },
    mark({ title: 'RITUAL PERDIDO', detail: 'No lo cantaste antes de jugar.', tone: 'rule' }),
  ],
  [
    'turnTimedOut',
    { type: 'turnTimedOut', cardId: 'teo' },
    mark({ title: 'SE ACABÓ EL TIEMPO', detail: 'Se jugó Teo, tu carta más baja.', tone: 'lose' }),
  ],
];

describe('round and duel copy', () => {
  it.each([...ROUND_CASES, ...DUEL_CASES])('maps %s', (_, event, expected) => {
    expect(noticeFor(event)).toMatchObject(expected);
  });

  it('reads a tie out as whole sentences', () => {
    expect(noticeFor(duel('tie'))).toMatchObject({
      announcement: 'EMPATE. Sor Inés y Garín se anulan (6).',
    });
  });
});
