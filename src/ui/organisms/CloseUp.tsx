import { useEffect, useRef } from 'preact/hooks';

import type { Side } from '@domain/shared/side';

import type { CloseUpModel } from '@ui/copy/close-up-copy';
import { CLOSE_UP_COPY } from '@ui/copy/close-up-copy';
import { useCapturedKey } from '@ui/keyboard/captured-keys';
import { CloseUpDuel } from '@ui/organisms/CloseUpDuel';
import { isTallScreen } from '@ui/organisms/hud-slots';

interface CloseUpProps {
  readonly model: CloseUpModel | null;
  readonly onShow: (side: Side) => void;
  readonly onClose: () => void;
}

interface DialogProps extends CloseUpProps {
  readonly model: CloseUpModel;
}

const useDesktopDialogFocus = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isTallScreen()) ref.current?.focus();
  }, []);
  return ref;
};

const CloseUpDialog = ({ model, onShow, onClose }: DialogProps) => {
  useCapturedKey((event) => (event.key === 'Escape' ? onClose : null));
  const ref = useDesktopDialogFocus();
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={model.label}
      tabIndex={-1}
      class="fixed inset-0 z-5 font-mincho text-washi outline-none"
    >
      <button
        type="button"
        aria-label={CLOSE_UP_COPY.close}
        onClick={onClose}
        class="absolute inset-0 size-full animate-[fade-in_180ms_ease-out] cursor-pointer bg-night/84 motion-reduce:animate-none tall:bg-night/80"
      />
      <CloseUpDuel model={model} onShow={onShow} />
    </div>
  );
};

export const CloseUp = ({ model, onShow, onClose }: CloseUpProps) =>
  model === null ? null : <CloseUpDialog model={model} onShow={onShow} onClose={onClose} />;
