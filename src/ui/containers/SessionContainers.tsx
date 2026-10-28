import { LiveRegion } from '@ui/atoms/LiveRegion';
import type { GameSession } from '@ui/containers/game-session';
import { GameOver } from '@ui/organisms/GameOver';

interface SessionProps {
  readonly session: GameSession | null;
}

export const GameOverContainer = ({ session }: SessionProps) => {
  if (session === null) return null;
  const restart = () => {
    session.hud.closeGameOver();
    session.commands.restart();
  };
  return <GameOver gameOver={session.hud.gameOver.value} onRestart={restart} />;
};

export const AnnouncementContainer = ({ session }: SessionProps) => (
  <LiveRegion text={session?.hud.announcement.value ?? ''} />
);
