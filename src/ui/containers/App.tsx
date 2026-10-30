import { useState } from 'preact/hooks';

import type { Launcher } from '@ui/containers/game-session';
import { GameScreen } from '@ui/containers/GameScreen';
import type { MusicControl } from '@ui/containers/music-control';
import { musicToggleOf } from '@ui/containers/music-control';
import type { SfxControl } from '@ui/containers/sfx-control';
import { sfxToggleOf } from '@ui/containers/sfx-control';
import { TitleScreen } from '@ui/organisms/TitleScreen';

interface AppProps {
  readonly launcher: Launcher;
  readonly music: MusicControl;
  readonly sfx: SfxControl;
}

export const App = ({ launcher, music, sfx }: AppProps) => {
  const [isStarted, setStarted] = useState(false);
  if (isStarted) return <GameScreen launcher={launcher} music={music} sfx={sfx} />;
  return (
    <TitleScreen
      music={musicToggleOf(music)}
      sfx={sfxToggleOf(sfx)}
      onIntent={launcher.prefetch}
      onStart={() => {
        setStarted(true);
      }}
    />
  );
};
