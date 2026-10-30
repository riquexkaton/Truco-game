import type { MusicToggle } from '@ui/molecules/MusicButton';
import { MusicButton } from '@ui/molecules/MusicButton';
import type { SoundEffectsToggle } from '@ui/molecules/SoundEffectsButton';
import { SoundEffectsButton } from '@ui/molecules/SoundEffectsButton';

interface TableControlsProps {
  readonly music: MusicToggle;
  readonly sfx: SoundEffectsToggle;
}

export const TableControls = ({ music, sfx }: TableControlsProps) => (
  <div class="fixed top-[calc(10px+env(safe-area-inset-top,0px))] left-[max(10px,env(safe-area-inset-left,0px))] flex rounded-full bg-black/45 shadow-[0_6px_18px_rgb(0_0_0/0.5)]">
    <MusicButton {...music} />
    <SoundEffectsButton {...sfx} />
  </div>
);
