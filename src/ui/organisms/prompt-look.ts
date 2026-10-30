import type { PromptVoice } from '@ui/copy/prompt';
import type { BandLook } from '@ui/molecules/CardDecor';

export interface VoiceLook {
  readonly frame: string;
  readonly band: BandLook;
  readonly isRival: boolean;
  readonly seal: string;
  readonly message: string;
  readonly isAlarm: boolean;
}

const PAD = 'gap-3 px-[18px] pt-[22px] pb-4 tall:gap-[11px] tall:px-3.5 tall:pt-5 tall:pb-3.5';

const SEAL_BIG = '-rotate-4 py-[7px] pr-2 pl-3 text-[15px] tracking-[4px]';

const SEAL_SMALL = `${SEAL_BIG} tall:py-1.5 tall:pr-[7px] tall:pl-2.5 tall:text-[13px] tall:tracking-[3px]`;

const RED_RING = 'bg-red shadow-[inset_0_0_0_2px_#8e2a2a,inset_0_0_0_3px_#f2e8d5]';

export const VOICE_LOOKS: Readonly<Record<PromptVoice, VoiceLook>> = {
  desafio: {
    frame: `${PAD} shadow-[inset_0_0_0_1.5px_#8e2a2a,0_16px_36px_rgb(0_0_0/0.65),0_0_24px_rgb(142_42_42/0.35)]`,
    band: 'red',
    isRival: true,
    seal: `${SEAL_BIG} ${RED_RING}`,
    message: 'text-[15px] tall:text-[13px]',
    isAlarm: true,
  },
  contra: {
    frame:
      'gap-3 px-[18px] pt-[22px] pb-4 tall:gap-[11px] tall:px-4 shadow-[inset_0_0_0_2px_#8e2a2a,inset_0_0_0_4px_#f2e8d5,inset_0_0_0_5px_#c9a35a,0_16px_36px_rgb(0_0_0/0.65),0_0_30px_rgb(255_140_60/0.35)]',
    band: 'gilt',
    isRival: true,
    seal: '-rotate-5 bg-red py-[7px] pr-[7px] pl-2.5 text-[12px] tracking-[2.5px] shadow-[inset_0_0_0_2px_#8e2a2a,inset_0_0_0_3px_#c9a35a]',
    message: 'text-[15px] tall:text-[13px] [&_b]:text-[1.25em]',
    isAlarm: true,
  },
  pacto: {
    frame: `${PAD} shadow-[inset_0_0_0_1.5px_#8e2a2a,0_16px_36px_rgb(0_0_0/0.65)]`,
    band: 'red',
    isRival: true,
    seal: `${SEAL_SMALL} ${RED_RING}`,
    message: 'text-[15px] tall:text-[12.5px]',
    isAlarm: false,
  },
  plain: {
    frame: `${PAD} shadow-[inset_0_0_0_1.5px_#1e1a16,0_16px_36px_rgb(0_0_0/0.65)]`,
    band: 'ink',
    isRival: false,
    seal: `${SEAL_SMALL} bg-ink shadow-[inset_0_0_0_2px_#1e1a16,inset_0_0_0_3px_#f2e8d5]`,
    message: 'text-[15px] tall:text-[13px]',
    isAlarm: false,
  },
};
