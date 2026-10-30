import type { MusicControl } from '@ui/containers/music-control';
import { musicToggleOf } from '@ui/containers/music-control';
import type { SfxControl } from '@ui/containers/sfx-control';
import { sfxToggleOf } from '@ui/containers/sfx-control';
import { TableControls } from '@ui/organisms/TableControls';

interface TableControlsContainerProps {
  readonly music: MusicControl;
  readonly sfx: SfxControl;
}

export const TableControlsContainer = ({ music, sfx }: TableControlsContainerProps) => (
  <TableControls music={musicToggleOf(music)} sfx={sfxToggleOf(sfx)} />
);
