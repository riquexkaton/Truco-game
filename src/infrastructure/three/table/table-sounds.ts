export type TableSound = 'cardDealt' | 'cardPlaced' | 'tableCleared' | 'coinLanded' | 'effectTaken';

export interface TableSounds {
  readonly play: (sound: TableSound) => void;
}
