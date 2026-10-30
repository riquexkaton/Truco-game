import { describe, expect, it, vi } from 'vitest';

import { PACT_BET } from '@domain/pact/bet';

import type { GameEvent } from '@application/ports/game-event';
import type { Question } from '@application/ports/hud-port';
import { createFakeHud } from '@application/testing/fake-hud';

import { withHudSounds } from './hud-sounds';

const TIMEOUT = { seconds: 10, answer: 'retire' } as const;

const setup = () => {
  const hud = createFakeHud();
  const play = vi.fn();
  return { hud, play, port: withHudSounds(hud, play) };
};

const pactAnswer = (isFirst: boolean): Question => ({
  kind: 'pactAnswer',
  bet: PACT_BET,
  previousAmount: 0,
  first: isFirst,
  canRitual: false,
  canRepacto: true,
  range: null,
  timeout: { seconds: 10, answer: { kind: 'reject' } },
});

describe('the HUD sounds', () => {
  it.each<[GameEvent, string]>([
    [{ type: 'turnStarted', side: 'rival' }, 'call'],
    [{ type: 'challengeCalled', by: 'player', level: 2 }, 'call'],
    [{ type: 'pactCalled', by: 'rival', bet: PACT_BET, first: false }, 'call'],
    [{ type: 'roundStarted', round: 1, lead: 'player', vira: 'lirio' }, 'round'],
    [{ type: 'roundEnded', winner: null, stake: 2 }, 'round'],
    [{ type: 'matchOver', winner: 'player', life: 12, rounds: 5 }, 'round'],
  ])('plays a cue for %o and still shows it', async (event, sound) => {
    const { hud, play, port } = setup();
    await port.notify(event);
    expect(play.mock.calls).toEqual([[sound]]);
    expect(hud.events).toEqual([event]);
  });

  it('waits for the notice to appear before playing its cue', async () => {
    const { hud, play, port } = setup();
    hud.holdEvent('roundEnded');
    const shown = port.notify({ type: 'roundEnded', winner: 'player', stake: 2 });
    await Promise.resolve();
    expect(play).not.toHaveBeenCalled();
    hud.releaseEvent('roundEnded');
    await shown;
    expect(play.mock.calls).toEqual([['round']]);
  });

  it('stays quiet for events without a cue', async () => {
    const { play, port } = setup();
    await port.notify({ type: 'lifeChanged', side: 'player', delta: -2, life: 18 });
    expect(play).not.toHaveBeenCalled();
  });

  it.each<[string, Question]>([
    [
      'a rival Desafío',
      { kind: 'challengeResponse', stake: 4, counterStake: 6, retireDamage: 1, timeout: TIMEOUT },
    ],
    ['a rival Contra', { kind: 'counterResponse', stake: 6, retireDamage: 4, timeout: TIMEOUT }],
    ['a rival opening Pacto', pactAnswer(true)],
  ])('plays the call cue when the player must answer %s', async (_, question) => {
    const { play, port } = setup();
    await port.ask(question);
    expect(play.mock.calls).toEqual([['call']]);
  });

  it('does not repeat the cue for an announced Pacto raise or the player’s own choices', async () => {
    const { hud, play, port } = setup();
    hud.script('foldConfirm', true);
    await port.ask(pactAnswer(false));
    await expect(port.ask({ kind: 'foldConfirm', damage: 1 })).resolves.toBe(true);
    expect(play).not.toHaveBeenCalled();
  });
});
