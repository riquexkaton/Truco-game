import type { GameCommands } from '@application/commands/game-commands';
import { createCommands } from '@application/commands/game-commands';
import type { GameContext } from '@application/game-context';
import type { GamePorts } from '@application/ports/game-ports';
import { createSignals } from '@application/store/game-signals';
import type { GameStore } from '@application/store/game-store';
import { createStore } from '@application/store/game-store';

export interface Game {
  readonly store: GameStore;
  readonly commands: GameCommands;
}

export const createGame = (ports: GamePorts): Game => {
  const game: GameContext = {
    ports,
    signals: createSignals(),
    pending: { turn: null, give: null, ending: Promise.resolve() },
  };
  return { store: createStore(game.signals), commands: createCommands(game) };
};
