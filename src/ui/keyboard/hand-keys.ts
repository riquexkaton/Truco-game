import type { CardId } from '@domain/cards/card';

import type { GameCommands } from '@application/commands/game-commands';
import type { GameStore } from '@application/store/game-store';

export interface HandKeyTarget {
  readonly store: Pick<GameStore, 'match' | 'prompting'>;
  readonly commands: Pick<GameCommands, 'playCard'>;
}

const HAND_KEYS = ['1', '2', '3'];

const cardForKey = (key: string, hand: readonly CardId[]): CardId | null => {
  const index = HAND_KEYS.indexOf(key);
  return index === -1 ? null : (hand[index] ?? null);
};

export const handleHandKey = ({ store, commands }: HandKeyTarget, key: string): void => {
  if (store.prompting.value) return;
  const cardId = cardForKey(key, store.match.value?.hands.player ?? []);
  if (cardId !== null) commands.playCard(cardId);
};
