import { describe, expect, it } from 'vitest';

import type { PactAnswerQuestion, Question } from '@application/ports/hud-port';

import type { PromptSpec } from '@ui/copy/prompt';
import { optionName, phrasesText, promptAnnouncement } from '@ui/copy/prompt';
import { promptFor } from '@ui/copy/question-copy';

const namesOf = (spec: PromptSpec<unknown>) => spec.options.map((option) => optionName(option));

const RETIRE = { seconds: 10, answer: 'retire' } as const;

const REJECT = { seconds: 10, answer: { kind: 'reject' } } as const;

const pactAnswer = (fields: Partial<PactAnswerQuestion>): Question => ({
  kind: 'pactAnswer',
  bet: { kind: 'pacto', amount: 2 },
  previousAmount: 0,
  first: true,
  canRitual: false,
  canRepacto: false,
  range: null,
  timeout: REJECT,
  ...fields,
});

describe('question copy', () => {
  it('voices a rival challenge with its stake and a retire countdown', () => {
    const question: Question = {
      kind: 'challengeResponse',
      stake: 4,
      counterStake: 6,
      retireDamage: 1,
      timeout: RETIRE,
    };
    const spec = promptFor(question);
    expect(spec).toMatchObject({
      voice: 'desafio',
      seal: 'DESAFÍO',
      timeout: RETIRE,
      timeoutLead: 'TE RETIRAS EN ',
    });
    expect(spec.message).toEqual([
      { text: 'El rival quiere que la ronda valga ', emphasis: 'none' },
      { text: '4', emphasis: 'alarm' },
      { text: '.', emphasis: 'none' },
    ]);
    expect(namesOf(spec)).toEqual(['ACEPTAR · VALE 4', 'CONTRA · VALE 6', 'RETIRARSE · −1']);
    expect(spec.options.map((option) => option.answer)).toEqual(['accept', 'counter', 'retire']);
  });

  it('strikes the old stake of a counter challenge', () => {
    const spec = promptFor({ kind: 'counterResponse', stake: 6, retireDamage: 4, timeout: RETIRE });
    expect(spec).toMatchObject({ voice: 'contra', seal: 'CONTRA-DESAFÍO' });
    expect(spec.message.find((phrase) => phrase.emphasis === 'struck')?.text).toBe('4');
    expect(promptAnnouncement(spec)).toBe('CONTRA-DESAFÍO. El rival sube la ronda de 4 a 6.');
    expect(namesOf(spec)).toEqual(['ACEPTAR · VALE 6', 'RETIRARSE · −4']);
  });

  it('offers the pact bets, a wager behind APOSTAR and a way out', () => {
    const spec = promptFor({
      kind: 'pactCall',
      range: { min: 4, max: 20 },
      timeout: { seconds: 15, answer: null },
    });
    expect(spec).toMatchObject({ voice: 'plain', seal: 'PACTO', timeoutLead: '' });
    expect(namesOf(spec)).toEqual(['PACTO · 2', 'RE-PACTO · 4']);
    expect(spec.aside).toMatchObject({ label: 'CANCELAR', answer: null });
    expect(spec.raise).toMatchObject({ toggle: 'APOSTAR', min: 4, max: 20 });
    expect(spec.raise?.go(9)).toBe('APOSTAR 9');
    expect(phrasesText(spec.raise?.summary(9) ?? [])).toBe('Apuestas 9 de daño.');
    expect(spec.raise?.make(9)).toEqual({ kind: 'apuesta', amount: 9 });
  });

  it('answers a rival pact with every allowed reply', () => {
    const spec = promptFor(
      pactAnswer({ canRitual: true, canRepacto: true, range: { min: 4, max: 18 } }),
    );
    expect(spec).toMatchObject({ voice: 'pacto', seal: 'PACTO' });
    expect(phrasesText(spec.message)).toBe('«Quien tenga menos Pacto recibe 2 de daño.»');
    expect(namesOf(spec)).toEqual(['ACEPTAR', 'RECHAZAR · −1', 'RE-PACTO · 4']);
    expect(spec.aside).toMatchObject({
      label: 'RITUAL',
      detail: 'LO ANULA',
      answer: { kind: 'ritual' },
    });
    expect(spec.raise?.toggle).toBe('SUBIR');
    expect(spec.raise?.go(6)).toBe('SUBIR A 6');
    expect(phrasesText(spec.raise?.summary(6) ?? [])).toBe('Subes a 6 de daño.');
    expect(spec.raise?.make(6)).toEqual({ kind: 'raise', bet: { kind: 'apuesta', amount: 6 } });
  });

  it('answers a raised wager without further raises', () => {
    const spec = promptFor(
      pactAnswer({ bet: { kind: 'apuesta', amount: 7 }, previousAmount: 4, first: false }),
    );
    expect(spec.seal).toBe('APUESTA · 7');
    expect(phrasesText(spec.message)).toBe('El rival sube. «Quien pierda recibe 7 de daño.»');
    expect(namesOf(spec)).toEqual(['ACEPTAR', 'RECHAZAR · −4']);
    expect(spec.raise).toBeNull();
  });

  it('describes a re-pact the rival opens with', () => {
    const spec = promptFor(
      pactAnswer({ bet: { kind: 'repacto', amount: 4 }, range: { min: 5, max: 20 } }),
    );
    expect(spec.seal).toBe('RE-PACTO');
    expect(promptAnnouncement(spec)).toBe('RE-PACTO. «Quien pierda recibe 4 de daño.»');
  });

  it('confirms folding and picks an effect to discard', () => {
    const fold = promptFor({ kind: 'foldConfirm', damage: 4 });
    expect(fold).toMatchObject({ voice: 'plain', seal: '¿TE VAS?', timeout: null });
    expect(phrasesText(fold.message)).toBe(
      'Abandonas la ronda: el rival la gana y tú pierdes 4 de vida.',
    );
    expect(fold.options.map((option) => [optionName(option), option.answer])).toEqual([
      ['ME VOY · −4', true],
      ['SEGUIR', false],
    ]);
    const discard = promptFor({ kind: 'discardEffect', effects: ['golpe', 'sello', 'saqueo'] });
    expect(discard).toMatchObject({ seal: 'DESCARTA UNO' });
    expect(phrasesText(discard.message)).toBe('Solo puedes guardar 2 efectos.');
    expect(discard.options.map(({ effect, answer }) => [effect, answer])).toEqual([
      ['golpe', 0],
      ['sello', 1],
      ['saqueo', 2],
    ]);
  });
});
