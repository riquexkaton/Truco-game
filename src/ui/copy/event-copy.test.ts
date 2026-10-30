import { describe, expect, it } from 'vitest';

import type { GameEvent, GameEventOf } from '@application/ports/game-event';

import { noticeFor } from '@ui/copy/event-copy';

const banner = (title: string, subtitle: string, extra: object = {}) => ({
  kind: 'banner',
  banner: { title, subtitle, ...extra },
});

const headline = (fields: object) => ({ kind: 'headline', headline: fields });

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
    },
  ],
  ['turnStarted', { type: 'turnStarted', side: 'player' }, { kind: 'strip', side: 'player' }],
  [
    'roundEnded with a winner',
    { type: 'roundEnded', winner: 'player', stake: 4 },
    headline({
      look: 'sheet',
      seal: '−4',
      tone: 'win',
      title: 'GANAS LA RONDA',
      result: 'EL RIVAL PIERDE 4',
    }),
  ],
  [
    'roundEnded tied',
    { type: 'roundEnded', winner: null, stake: 2 },
    headline({ seal: '=', tone: 'tie', title: 'RONDA EMPATADA', result: 'NADIE RECIBE DAÑO' }),
  ],
  [
    'the player folding',
    { type: 'retired', side: 'player', damage: 4, reason: 'fold' },
    headline({
      isRival: false,
      seal: '−4',
      tone: 'lose',
      title: 'TE VAS',
      result: 'PIERDES 4 DE VIDA',
    }),
  ],
  [
    'the rival retiring',
    { type: 'retired', side: 'rival', damage: 4, reason: 'retire' },
    headline({
      isRival: true,
      tone: 'win',
      title: 'EL RIVAL SE RETIRA',
      result: 'EL RIVAL PIERDE 4',
    }),
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
    headline({
      look: 'duel',
      tag: 'DUELO 1',
      title: 'DUELO GANADO',
      body: 'Garín (10) vence a Sor Inés (6).',
      result: 'LLEVAS 1 DE 3',
      tone: 'win',
      player: { cardId: 'garin', name: 'Garín', attack: '10' },
      rival: { cardId: 'ines', name: 'Sor Inés', attack: '6' },
    }),
  ],
  [
    'duel lost',
    duel('rival', 1),
    headline({
      tag: 'DUELO 2',
      title: 'DUELO PERDIDO',
      result: 'EL RIVAL LLEVA 2',
      tone: 'lose',
    }),
  ],
  [
    'duel tied',
    duel('tie'),
    headline({
      title: 'DUELO EMPATADO',
      body: 'Sor Inés y Garín se anulan (6).',
      result: 'DECIDE EL SIGUIENTE DUELO',
      tone: 'tie',
    }),
  ],
  [
    'effectEarned',
    { type: 'effectEarned', side: 'rival', cardId: 'garin' },
    mark({ title: 'SELLO', detail: 'Garín lleva sello: el rival gana un efecto.', tone: 'lose' }),
  ],
  [
    'ritualSung',
    { type: 'ritualSung', side: 'player' },
    banner('RITUAL', 'CANTAS RITUAL · EL RIVAL RECIBE 3 Y TOMAS UN EFECTO', { duration: 1600 }),
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

  it('reads a headline out as whole sentences', () => {
    expect(noticeFor(duel('rival'))).toMatchObject({
      announcement: 'DUELO PERDIDO. Sor Inés (6) cae ante Garín (10). EL RIVAL LLEVA 2.',
    });
  });
});
