import type { ToastView } from '@ui/hud/hud-view';
import { Toast } from '@ui/molecules/Toast';

interface ToastsProps {
  readonly toasts: readonly ToastView[];
  readonly onDismiss: (id: number) => void;
}

export const Toasts = ({ toasts, onDismiss }: ToastsProps) => (
  <div class="pointer-events-none fixed top-[calc(56px+env(safe-area-inset-top,0px))] right-[max(20px,env(safe-area-inset-right,0px))] z-5 flex w-80 flex-col gap-2.5 narrow:top-[calc(130px+env(safe-area-inset-top,0px))] narrow:right-3 narrow:left-3 narrow:w-auto">
    {toasts.map((toast) => (
      <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
    ))}
  </div>
);
