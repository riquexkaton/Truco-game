import type { RefObject } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

import { useMenuDismiss } from '@ui/organisms/use-menu-dismiss';

type TipMode = 'touch' | 'hover';

interface OpenTip {
  readonly index: number;
  readonly mode: TipMode;
}

interface KeyedTip {
  readonly key: string;
  readonly tip: OpenTip | null;
}

export interface TipOptions {
  readonly resetKey: string;
  readonly isUsable: (index: number) => boolean;
  readonly onUse: (index: number) => void;
}

export interface TipControl {
  readonly tip: OpenTip | null;
  readonly pointerRef: RefObject<string | null>;
  readonly open: (index: number, mode: TipMode) => void;
  readonly hoverIn: (index: number) => void;
  readonly hoverOut: (index: number) => void;
  readonly close: () => void;
  readonly isUsable: (index: number) => boolean;
  readonly use: (index: number) => void;
}

type ShowTip = (tip: OpenTip | null) => void;

const HOVER_DELAY_MS = 150;

const useKeyedTip = (resetKey: string) => {
  const [state, setState] = useState<KeyedTip>({ key: resetKey, tip: null });
  if (state.key !== resetKey) setState({ key: resetKey, tip: null });
  const show: ShowTip = useCallback(
    (tip) => {
      setState({ key: resetKey, tip });
    },
    [resetKey],
  );
  const hide = (index: number) => {
    setState((current) =>
      current.tip?.mode === 'hover' && current.tip.index === index
        ? { ...current, tip: null }
        : current,
    );
  };
  return { tip: state.key === resetKey ? state.tip : null, show, hide };
};

const useHoverIntent = (show: ShowTip, hide: (index: number) => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
  }, []);
  useEffect(() => cancel, [cancel]);
  const hoverIn = (index: number) => {
    cancel();
    timerRef.current = setTimeout(() => {
      show({ index, mode: 'hover' });
    }, HOVER_DELAY_MS);
  };
  const hoverOut = (index: number) => {
    cancel();
    hide(index);
  };
  return { cancel, hoverIn, hoverOut };
};

export const useEffectTip = ({ resetKey, isUsable, onUse }: TipOptions) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<string | null>(null);
  const { tip, show, hide } = useKeyedTip(resetKey);
  const { cancel, hoverIn, hoverOut } = useHoverIntent(show, hide);
  const close = useCallback(() => {
    show(null);
  }, [show]);
  useMenuDismiss({ isOpen: tip !== null, rootRef, triggerRef: rootRef, onClose: close });
  const open = (index: number, mode: TipMode) => {
    cancel();
    show({ index, mode });
  };
  const use = (index: number) => {
    cancel();
    close();
    onUse(index);
  };
  const control: TipControl = { tip, pointerRef, open, hoverIn, hoverOut, close, isUsable, use };
  return { rootRef, control };
};
