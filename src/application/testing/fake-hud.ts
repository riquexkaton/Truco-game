import type { GameEvent, GameEventOf, GameEventType } from '@application/ports/game-event';
import type { Answer, HudPort, Question, QuestionKind } from '@application/ports/hud-port';
import type { Deferred } from '@application/shared/deferred';
import { deferred } from '@application/shared/deferred';

export interface FakeHud extends HudPort {
  readonly events: GameEvent[];
  readonly questions: Question[];
  readonly script: <K extends QuestionKind>(kind: K, ...answers: Answer<K>[]) => void;
  readonly hold: (kind: QuestionKind) => void;
  readonly release: <K extends QuestionKind>(kind: K, answer: Answer<K>) => void;
  readonly holdEvent: (type: GameEventType) => void;
  readonly releaseEvent: (type: GameEventType) => void;
  readonly eventsOf: <T extends GameEventType>(type: T) => GameEventOf<T>[];
}

const createEventHolds = () => {
  const held = new Map<GameEventType, Deferred<void> | null>();
  return {
    shown: (type: GameEventType): Promise<void> => {
      if (!held.has(type)) return Promise.resolve();
      const pending: Deferred<void> = deferred();
      held.set(type, pending);
      return pending.promise;
    },
    holdEvent: (type: GameEventType) => {
      held.set(type, null);
    },
    releaseEvent: (type: GameEventType) => {
      held.get(type)?.resolve();
      held.delete(type);
    },
  };
};

interface AnswerBook {
  readonly scripts: Map<QuestionKind, unknown[]>;
  readonly held: Map<QuestionKind, Deferred<unknown> | null>;
}

const fallbackAnswer = (question: Question): Promise<unknown> =>
  'timeout' in question
    ? Promise.resolve(question.timeout.answer)
    : Promise.reject(new Error(`Unscripted question: ${question.kind}`));

const answerFor = ({ scripts, held }: AnswerBook, question: Question): Promise<unknown> => {
  if (held.has(question.kind)) {
    const pending = deferred<unknown>();
    held.set(question.kind, pending);
    return pending.promise;
  }
  const queue = scripts.get(question.kind) ?? [];
  return queue.length > 0 ? Promise.resolve(queue.shift()) : fallbackAnswer(question);
};

const scriptControls = ({ scripts, held }: AnswerBook) => ({
  script: <K extends QuestionKind>(kind: K, ...answers: Answer<K>[]) => {
    scripts.set(kind, [...(scripts.get(kind) ?? []), ...answers]);
  },
  hold: (kind: QuestionKind) => {
    held.set(kind, null);
  },
  release: <K extends QuestionKind>(kind: K, answer: Answer<K>) => {
    held.get(kind)?.resolve(answer);
    held.delete(kind);
  },
});

export const createFakeHud = (): FakeHud => {
  const events: GameEvent[] = [];
  const questions: Question[] = [];
  const book: AnswerBook = { scripts: new Map(), held: new Map() };
  const { shown, holdEvent, releaseEvent } = createEventHolds();
  return {
    events,
    questions,
    holdEvent,
    releaseEvent,
    notify: (event) => {
      events.push(event);
      return shown(event.type);
    },
    ask: <Q extends Question>(question: Q) => {
      questions.push(question);
      return answerFor(book, question) as Promise<Answer<Q['kind']>>;
    },
    eventsOf: <T extends GameEventType>(type: T) =>
      events.filter((event): event is GameEventOf<T> => event.type === type),
    ...scriptControls(book),
  };
};
