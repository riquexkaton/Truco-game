import type { GameCommands } from '@application/commands/game-commands';
import type { GameStore } from '@application/store/game-store';

import type { HudView } from '@ui/hud/hud-view';

export interface GameSession {
  readonly store: GameStore;
  readonly commands: GameCommands;
  readonly hud: HudView;
}

export interface Launcher {
  readonly prefetch: () => void;
  readonly launch: (canvas: HTMLCanvasElement) => Promise<GameSession>;
}
