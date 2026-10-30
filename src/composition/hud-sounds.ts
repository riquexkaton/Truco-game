import type { GameEventType } from '@application/ports/game-event';
import type { HudPort, Question } from '@application/ports/hud-port';

export type HudSound = 'call' | 'round';

type PlayHudSound = (sound: HudSound) => void;

const EVENT_SOUNDS: Partial<Record<GameEventType, HudSound>> = {
  turnStarted: 'call',
  challengeCalled: 'call',
  pactCalled: 'call',
  roundStarted: 'round',
  roundEnded: 'round',
  matchOver: 'round',
};

const isRivalCall = (question: Question): boolean =>
  question.kind === 'challengeResponse' ||
  question.kind === 'counterResponse' ||
  (question.kind === 'pactAnswer' && question.first);

export const withHudSounds = (hud: HudPort, play: PlayHudSound): HudPort => ({
  notify: (event) => {
    const sound = EVENT_SOUNDS[event.type];
    if (sound !== undefined) play(sound);
    return hud.notify(event);
  },
  ask: <Q extends Question>(question: Q) => {
    if (isRivalCall(question)) play('call');
    return hud.ask(question);
  },
});
