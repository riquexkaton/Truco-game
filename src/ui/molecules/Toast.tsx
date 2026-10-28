import { Hanko } from '@ui/atoms/Hanko';
import type { Tone } from '@ui/copy/notice';
import type { ToastView } from '@ui/hud/hud-view';

interface ToastProps {
  readonly toast: ToastView;
  readonly onDismiss: (id: number) => void;
}

const TONE_BG: Readonly<Record<Tone, string>> = {
  win: 'bg-green',
  lose: 'bg-red',
  tie: 'bg-tie',
  ink: 'bg-ink',
  rule: 'bg-rule',
};

const TONE_TEXT: Readonly<Record<Tone, string>> = {
  win: 'text-green',
  lose: 'text-red',
  tie: 'text-tie',
  ink: 'text-ink',
  rule: 'text-rule',
};

const ToastText = ({ toast }: { readonly toast: ToastView }) => (
  <span class="relative flex min-w-0 flex-1 flex-col gap-[3px]">
    <span class="flex items-center justify-between gap-2">
      <b class="text-[12px] font-extrabold tracking-[0.2em]">{toast.title}</b>
      {toast.tag === '' ? null : (
        <span class="bg-washi2 px-1.5 py-px text-[8px] font-extrabold tracking-[0.2em] whitespace-nowrap shadow-[inset_0_0_0_1px_var(--color-ink)]">
          {toast.tag}
        </span>
      )}
    </span>
    {toast.body === '' ? null : (
      <span class="text-[12px] leading-[1.4] font-semibold text-ink/80">{toast.body}</span>
    )}
    {toast.result === '' ? null : (
      <span class={`text-[10px] font-extrabold tracking-[0.14em] ${TONE_TEXT[toast.tone]}`}>
        {toast.result}
      </span>
    )}
  </span>
);

export const Toast = ({ toast, onDismiss }: ToastProps) => {
  const dismiss = () => {
    onDismiss(toast.id);
  };
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={dismiss}
      class={`group paper-rule pointer-events-auto relative flex cursor-pointer items-center gap-3.5 bg-washi px-4 pt-3.5 pb-4 text-left font-mincho text-ink shadow-[0_12px_30px_rgb(0_0_0/0.55)] [--rule-inset:6px] narrow:px-[13px] narrow:pt-[11px] narrow:pb-[13px] ${toast.leaving ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <Hanko
        class={`size-[42px] flex-none animate-stamp rounded-[7px] shadow-[2px_3px_0_rgb(0_0_0/0.22)] narrow:size-9 ${TONE_BG[toast.tone]}`}
      >
        <b class={toast.seal.length > 1 ? 'text-[14px]' : 'text-[17px]'}>{toast.seal}</b>
      </Hanko>
      <ToastText toast={toast} />
      <i
        aria-hidden="true"
        onAnimationEnd={dismiss}
        class="absolute right-[7.5px] bottom-[7.5px] left-[7.5px] h-[2px] origin-left animate-toast-time bg-ink opacity-55 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${String(toast.duration)}ms` }}
      />
    </button>
  );
};
