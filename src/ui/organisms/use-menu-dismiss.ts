import type { RefObject } from 'preact';
import { useEffect } from 'preact/hooks';

interface MenuDismissal {
  readonly isOpen: boolean;
  readonly rootRef: RefObject<HTMLElement | null>;
  readonly triggerRef: RefObject<HTMLElement | null>;
  readonly onClose: () => void;
}

export const useMenuDismiss = ({ isOpen, rootRef, triggerRef, onClose }: MenuDismissal): void => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      onClose();
      triggerRef.current?.focus();
    };
    const onPointer = (event: PointerEvent) => {
      const { target } = event;
      if (target instanceof Node && rootRef.current?.contains(target) === true) return;
      onClose();
    };
    globalThis.addEventListener('keydown', onKey);
    globalThis.addEventListener('pointerdown', onPointer);
    return () => {
      globalThis.removeEventListener('keydown', onKey);
      globalThis.removeEventListener('pointerdown', onPointer);
    };
  }, [isOpen, rootRef, triggerRef, onClose]);
};
