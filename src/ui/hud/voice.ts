import type { Signal } from '@preact/signals';

import { spoken } from '@ui/copy/headline';

export interface Voice {
  readonly say: (text: string) => void;
  readonly add: (text: string) => void;
}

export const createVoice = (announcement: Signal<string>): Voice => {
  let isFresh = false;
  const say = (text: string): void => {
    announcement.value = text;
    isFresh = true;
    setTimeout(() => {
      isFresh = false;
    }, 0);
  };
  return {
    say,
    add: (text) => {
      say(isFresh ? spoken(announcement.peek(), text) : text);
    },
  };
};
