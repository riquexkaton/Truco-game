import { useEffect, useRef, useState } from 'preact/hooks';

import { ActionsContainer } from '@ui/containers/ActionsContainer';
import type { GameSession, Launcher } from '@ui/containers/game-session';
import { MatchHudContainer } from '@ui/containers/MatchHudContainer';
import { NoticesContainer } from '@ui/containers/NoticesContainer';
import { AnnouncementContainer, GameOverContainer } from '@ui/containers/SessionContainers';
import { TABLE_LABEL } from '@ui/copy/hud-copy';
import { useHandKeys } from '@ui/keyboard/use-hand-keys';
import { LoadingScreen } from '@ui/organisms/LoadingScreen';

interface GameScreenProps {
  readonly launcher: Launcher;
}

const HudLayer = ({ session }: { readonly session: GameSession }) => {
  useHandKeys(session);
  return (
    <>
      <MatchHudContainer session={session} />
      <ActionsContainer session={session} />
      <NoticesContainer session={session} />
    </>
  );
};

const useSession = (launcher: Launcher) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const report = (fraction: number) => {
      setProgress((current) => Math.max(current, fraction));
    };
    const launch = async () => {
      setSession(await launcher.launch(canvas, report));
    };
    void launch();
  }, [launcher]);
  return { canvasRef, session, progress };
};

export const GameScreen = ({ launcher }: GameScreenProps) => {
  const { canvasRef, session, progress } = useSession(launcher);
  return (
    <main>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={TABLE_LABEL}
        class="fixed inset-0 block size-full touch-none"
      />
      {session === null ? null : <HudLayer session={session} />}
      <LoadingScreen progress={progress} isReady={session !== null} />
      <GameOverContainer session={session} />
      <AnnouncementContainer session={session} />
    </main>
  );
};
