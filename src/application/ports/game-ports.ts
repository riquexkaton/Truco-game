import type { HudPort } from '@application/ports/hud-port';
import type { Random } from '@application/ports/random';
import type { Scheduler } from '@application/ports/scheduler';
import type { TablePort } from '@application/ports/table-port';

export interface GamePorts {
  readonly table: TablePort;
  readonly hud: HudPort;
  readonly scheduler: Scheduler;
  readonly random: Random;
}
