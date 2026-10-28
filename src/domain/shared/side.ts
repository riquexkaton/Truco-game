export type Side = 'player' | 'rival';

export type PerSide<T> = Readonly<Record<Side, T>>;

export const SIDES: readonly Side[] = ['player', 'rival'];

export const opponent = (side: Side): Side => (side === 'player' ? 'rival' : 'player');

export const bothSides = <T>(value: T): PerSide<T> => ({ player: value, rival: value });

export const withSide = <T>(record: PerSide<T>, side: Side, value: T): PerSide<T> => ({
  ...record,
  [side]: value,
});
