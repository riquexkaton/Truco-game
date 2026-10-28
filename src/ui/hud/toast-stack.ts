import type { NoticeOf } from '@ui/copy/notice';
import { MAX_TOASTS, TOAST_EXIT_MS } from '@ui/hud/hud-timing';
import type { HudSignals, ToastView } from '@ui/hud/hud-view';

export interface ToastStack {
  readonly push: (notice: NoticeOf<'toast'>) => Promise<void>;
  readonly dismiss: (id: number) => void;
}

const isLeaving = (toasts: readonly ToastView[], id: number): boolean =>
  toasts.find((toast) => toast.id === id)?.leaving ?? true;

export const createToastStack = (signals: HudSignals, duration: number): ToastStack => {
  let pushed = 0;
  const remove = (id: number) => {
    signals.toasts.value = signals.toasts.value.filter((toast) => toast.id !== id);
  };
  return {
    push: ({ toast, announcement }) => {
      pushed += 1;
      const view: ToastView = { ...toast, id: pushed, duration, leaving: false };
      signals.toasts.value = [view, ...signals.toasts.value].slice(0, MAX_TOASTS);
      signals.announcement.value = announcement;
      return Promise.resolve();
    },
    dismiss: (id) => {
      if (isLeaving(signals.toasts.value, id)) return;
      signals.toasts.value = signals.toasts.value.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast,
      );
      setTimeout(() => {
        remove(id);
      }, TOAST_EXIT_MS);
    },
  };
};
