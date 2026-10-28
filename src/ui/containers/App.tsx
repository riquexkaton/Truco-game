import { useState } from 'preact/hooks';

import type { Launcher } from '@ui/containers/game-session';
import { GameScreen } from '@ui/containers/GameScreen';
import { TitleScreen } from '@ui/organisms/TitleScreen';

interface AppProps {
  readonly launcher: Launcher;
}

export const App = ({ launcher }: AppProps) => {
  const [isStarted, setStarted] = useState(false);
  if (isStarted) return <GameScreen launcher={launcher} />;
  return (
    <TitleScreen
      onIntent={launcher.prefetch}
      onStart={() => {
        setStarted(true);
      }}
    />
  );
};
