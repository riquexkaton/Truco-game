import { useState } from 'preact/hooks';

import type { TitleCard } from '@ui/art/title-deck';
import { Icon } from '@ui/atoms/Icon';
import { MENU_COPY } from '@ui/copy/menu-copy';
import { MenuInfo } from '@ui/molecules/MenuInfo';
import type { MusicToggle } from '@ui/molecules/MusicButton';
import { MusicButton } from '@ui/molecules/MusicButton';
import type { SoundEffectsToggle } from '@ui/molecules/SoundEffectsButton';
import { SoundEffectsButton } from '@ui/molecules/SoundEffectsButton';
import { TitleBackdrop } from '@ui/molecules/TitleBackdrop';
import { FullscreenButton } from '@ui/organisms/FullscreenButton';
import { MenuFan } from '@ui/organisms/MenuFan';

interface TitleScreenProps {
  readonly music: MusicToggle;
  readonly sfx: SoundEffectsToggle;
  readonly onIntent: () => void;
  readonly onStart: () => void;
}

const TitleHeader = ({ music, sfx }: Pick<TitleScreenProps, 'music' | 'sfx'>) => (
  <header class="relative z-20 flex h-[88px] shrink-0 items-center justify-between px-12 motion-safe:animate-drop-in narrow:h-16 narrow:px-4">
    <div class="flex items-center gap-3.5">
      <span
        aria-hidden="true"
        class="relative grid size-[34px] -rotate-4 place-items-center rounded-[6px] bg-red"
      >
        <span class="absolute inset-[3px] rounded-[4px] shadow-[inset_0_0_0_1px_var(--color-washi)]" />
        <Icon
          name="candle"
          class="relative size-[18px] fill-none stroke-washi stroke-[1.7] [stroke-linecap:round] [stroke-linejoin:round]"
        />
      </span>
      <h1 class="text-[15px] leading-none font-extrabold tracking-[0.32em] narrow:text-[13px] narrow:tracking-[0.24em]">
        {MENU_COPY.title}
      </h1>
    </div>
    <div class="flex items-center">
      <MusicButton {...music} />
      <SoundEffectsButton {...sfx} />
      <FullscreenButton />
    </div>
  </header>
);

export const TitleScreen = ({ music, sfx, onIntent, onStart }: TitleScreenProps) => {
  const [hint, setHint] = useState<TitleCard | null>(null);
  return (
    <main class="fixed inset-0 flex flex-col overflow-clip bg-night font-mincho text-washi">
      <TitleBackdrop />
      <TitleHeader music={music} sfx={sfx} />
      <p class="relative mt-[clamp(12px,8.7vh,78px)] shrink-0 pl-[0.4em] text-center text-[14px] leading-[1.2] font-extrabold tracking-[0.4em] [text-shadow:0_2px_16px_rgb(0_0_0/0.8)] motion-safe:animate-prompt">
        {MENU_COPY.prompt}
      </p>
      <MenuFan onIntent={onIntent} onStart={onStart} onHint={setHint} />
      <MenuInfo card={hint} />
    </main>
  );
};
