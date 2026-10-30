import type { CloseUpResult, ResultTone } from '@ui/copy/close-up-copy';

interface ResultStampProps {
  readonly result: CloseUpResult;
}

const RESULT_LOOKS: Readonly<Record<ResultTone, string>> = {
  win: 'bg-green shadow-[inset_0_0_0_2px_var(--color-green),inset_0_0_0_3px_var(--color-washi)]',
  lose: 'bg-red shadow-[inset_0_0_0_2px_var(--color-red),inset_0_0_0_3px_var(--color-washi)]',
  tie: 'bg-tie shadow-[inset_0_0_0_2px_var(--color-tie),inset_0_0_0_3px_var(--color-washi)]',
};

export const ResultStamp = ({ result }: ResultStampProps) => (
  <span
    class={`-rotate-6 py-1.5 pr-[9px] pl-3 text-[13px] font-extrabold tracking-[3px] text-washi2 ${RESULT_LOOKS[result.tone]}`}
  >
    {result.text}
  </span>
);
