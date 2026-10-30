import type { ReadonlySignal } from '@preact/signals';
import { signal } from '@preact/signals';

import type { Side } from '@domain/shared/side';

import type { PlayedCardPick, SealHover, TableListener } from '@application/ports/table-listener';

export interface CloseUpView {
  readonly id: number;
  readonly pick: PlayedCardPick;
  readonly shown: Side;
}

export interface TableView {
  readonly closeUp: ReadonlySignal<CloseUpView | null>;
  readonly sealHover: ReadonlySignal<SealHover | null>;
  readonly showCloseUpSide: (side: Side) => void;
  readonly closeCloseUp: () => void;
}

export interface TableWatch {
  readonly listener: TableListener;
  readonly view: TableView;
}

export const createTableWatch = (prompt: ReadonlySignal<unknown>): TableWatch => {
  const closeUp = signal<CloseUpView | null>(null);
  const sealHover = signal<SealHover | null>(null);
  let opened = 0;
  const close = () => {
    closeUp.value = null;
  };
  prompt.subscribe((asked) => {
    if (asked !== null) close();
  });
  const inspect = (pick: PlayedCardPick) => {
    if (prompt.value !== null) return;
    opened += 1;
    closeUp.value = { id: opened, pick, shown: pick.side };
  };
  const show = (side: Side) => {
    const current = closeUp.value;
    if (current !== null) closeUp.value = { ...current, shown: side };
  };
  return {
    listener: {
      cardInspected: inspect,
      sealHovered: (hover) => {
        sealHover.value = hover;
      },
      tableCleared: close,
    },
    view: { closeUp, sealHover, showCloseUpSide: show, closeCloseUp: close },
  };
};
