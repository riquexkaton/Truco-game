import { describe, expect, it } from 'vitest';

import type { Question } from '@application/ports/hud-port';

import type { PromptSpec } from '@ui/copy/prompt';
import { promptFor } from '@ui/copy/question-copy';

const labelsOf = (spec: PromptSpec<unknown>) => spec.options.map((option) => option.label);

const RETIRE = { seconds: 10, answer: 'retire' } as const;

describe('question copy', () => {
  it('asks to answer a challenge', () => {
    const question: Question = {
      kind: 'challengeResponse',
      stake: 4,
      counterStake: 6,
      retireDamage: 1,
      timeout: RETIRE,
    };
    const spec = promptFor(question);
    expect(spec).toMatchObject({ tone: 'desafio', title: 'DESAFÍO', timeout: RETIRE });
    expect(spec.subtitle).toBe(
      'El rival quiere que la ronda valga 4. Si no respondes a tiempo, te retiras.',
    );
    expect(labelsOf(spec)).toEqual(['ACEPTAR · VALE 4', 'CONTRA · VALE 6', 'RETIRARSE · −1']);
    expect(spec.options.map((option) => option.answer)).toEqual(['accept', 'counter', 'retire']);
  });

  it('asks to answer a counter challenge', () => {
    const spec = promptFor({ kind: 'counterResponse', stake: 6, retireDamage: 4, timeout: RETIRE });
    expect(spec.title).toBe('CONTRA-DESAFÍO');
    expect(spec.subtitle).toBe('El rival sube la ronda a 6. Si no respondes a tiempo, te retiras.');
    expect(labelsOf(spec)).toEqual(['ACEPTAR · VALE 6', 'RETIRARSE · −4']);
  });

  it('offers the pact bets with a free wager', () => {
    const spec = promptFor({
      kind: 'pactCall',
      range: { min: 4, max: 20 },
      timeout: { seconds: 15, answer: null },
    });
    expect(labelsOf(spec)).toEqual(['PACTO · 2', 'RE-PACTO · 4', 'CANCELAR']);
    expect(spec).toMatchObject({ tone: 'pacto', title: 'PACTO', subtitle: '' });
    expect(spec.wager).toMatchObject({ label: 'O APUESTA', min: 4, max: 20, go: 'APOSTAR' });
    expect(spec.wager?.make(9)).toEqual({ kind: 'apuesta', amount: 9 });
  });

  it('answers a rival pact with every allowed reply', () => {
    const spec = promptFor({
      kind: 'pactAnswer',
      bet: { kind: 'pacto', amount: 2 },
      previousAmount: 0,
      first: true,
      canRitual: true,
      canRepacto: true,
      range: { min: 4, max: 18 },
      timeout: { seconds: 10, answer: { kind: 'reject' } },
    });
    expect(spec.title).toBe('PACTO');
    expect(spec.subtitle).toBe('El rival canta Pacto: quien tenga menos Pacto recibe 2 de daño.');
    expect(labelsOf(spec)).toEqual([
      'ACEPTAR',
      'RECHAZAR · −1',
      'RE-PACTO · 4',
      'RITUAL · LO ANULA',
    ]);
    expect(spec.wager?.go).toBe('SUBIR');
    expect(spec.wager?.make(6)).toEqual({ kind: 'raise', bet: { kind: 'apuesta', amount: 6 } });
  });

  it('answers a raised wager without further raises', () => {
    const spec = promptFor({
      kind: 'pactAnswer',
      bet: { kind: 'apuesta', amount: 7 },
      previousAmount: 4,
      first: false,
      canRitual: false,
      canRepacto: false,
      range: null,
      timeout: { seconds: 10, answer: { kind: 'reject' } },
    });
    expect(spec.title).toBe('APUESTA · 7');
    expect(spec.subtitle).toBe(
      'El rival sube la apuesta a 7: quien pierda el Pacto recibe 7 de daño.',
    );
    expect(labelsOf(spec)).toEqual(['ACEPTAR', 'RECHAZAR · −4']);
    expect(spec.wager).toBeNull();
  });

  it('describes a re-pact raise', () => {
    const spec = promptFor({
      kind: 'pactAnswer',
      bet: { kind: 'repacto', amount: 4 },
      previousAmount: 2,
      first: false,
      canRitual: false,
      canRepacto: false,
      range: { min: 5, max: 20 },
      timeout: { seconds: 10, answer: { kind: 'reject' } },
    });
    expect(spec.title).toBe('RE-PACTO');
    expect(spec.subtitle).toBe('El rival sube a Re-pacto: quien pierda recibe 4 de daño.');
  });

  it('confirms folding and picks an effect to discard', () => {
    const fold = promptFor({ kind: 'foldConfirm' });
    expect(fold).toMatchObject({ title: '¿TE VAS?', timeout: null });
    expect(fold.options.map(({ label, answer }) => [label, answer])).toEqual([
      ['ME VOY · −1', true],
      ['SEGUIR', false],
    ]);
    const discard = promptFor({ kind: 'discardEffect', effects: ['golpe', 'sello', 'saqueo'] });
    expect(discard).toMatchObject({
      title: 'DESCARTA UNO',
      subtitle: 'Solo puedes guardar 2 efectos.',
    });
    expect(discard.options.map(({ effect, answer }) => [effect, answer])).toEqual([
      ['golpe', 0],
      ['sello', 1],
      ['saqueo', 2],
    ]);
  });
});
