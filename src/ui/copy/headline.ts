export type Tone = 'win' | 'lose' | 'tie' | 'ink' | 'rule';

export interface SheetHeadline {
  readonly seal: string;
  readonly tone: Tone;
  readonly title: string;
  readonly body: string;
  readonly result: string;
}

export interface MarkCopy {
  readonly title: string;
  readonly detail: string;
  readonly tone: Tone;
  readonly isRival?: boolean;
}

const sentence = (text: string): string => (/[.!?»]$/.test(text) ? text : `${text}.`);

export const spoken = (...parts: readonly string[]): string =>
  parts
    .filter((part) => part !== '')
    .map((part) => sentence(part))
    .join(' ');
