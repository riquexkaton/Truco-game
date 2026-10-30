import type { Texture } from 'three';
import { Sprite, SpriteMaterial } from 'three';

import type { PerSide, Side } from '@domain/shared/side';

import type { TableCard } from '@infrastructure/three/cards/table-card';
import { CARD_HEIGHT, CARD_WIDTH, DUEL_SLOTS } from '@infrastructure/three/layout/table-points';
import { BADGE_CANVAS, paintAttackBadge } from '@infrastructure/three/textures/badge-paint';
import type { TextureKit } from '@infrastructure/three/textures/canvas-texture';
import { paintedTexture } from '@infrastructure/three/textures/canvas-texture';

export interface DuelBadges {
  readonly kit: TextureKit;
  readonly sprites: PerSide<readonly Sprite[]>;
  readonly numbers: Map<number, Texture>;
}

export interface BadgeRequest {
  readonly side: Side;
  readonly duel: number;
  readonly card: TableCard;
  readonly value: number;
}

const BADGE_SIZE = 0.2;
const BADGE_ORDER = 6;
const BADGE_POINT = { x: (118 / 280 - 0.5) * CARD_WIDTH, y: (0.5 - 268 / 400) * CARD_HEIGHT };
const BADGE_DEPTH = 0.006;

const badgeRow = (): Sprite[] =>
  DUEL_SLOTS.player.map(() => {
    const material = new SpriteMaterial({ transparent: true, opacity: 0, depthTest: false });
    const sprite = new Sprite(material);
    sprite.scale.set(BADGE_SIZE, BADGE_SIZE, 1);
    sprite.position.set(BADGE_POINT.x, BADGE_POINT.y, BADGE_DEPTH);
    sprite.renderOrder = BADGE_ORDER;
    return sprite;
  });

export const createDuelBadges = (kit: TextureKit): DuelBadges => ({
  kit,
  sprites: { player: badgeRow(), rival: badgeRow() },
  numbers: new Map(),
});

const numberMap = (badges: DuelBadges, value: number): Texture => {
  const cached = badges.numbers.get(value);
  if (cached !== undefined) return cached;
  const map = paintedTexture(badges.kit, {
    width: BADGE_CANVAS,
    height: BADGE_CANVAS,
    scale: 1,
    paint: (context) => {
      paintAttackBadge(context, value);
    },
  });
  badges.numbers.set(value, map);
  return map;
};

export const showBadge = (badges: DuelBadges, { side, duel, card, value }: BadgeRequest): void => {
  const sprite = badges.sprites[side][duel];
  if (sprite === undefined) return;
  sprite.material.map = numberMap(badges, value);
  sprite.material.needsUpdate = true;
  card.group.add(sprite);
};

const setOpacity = (sprite: Sprite | undefined, level: number): void => {
  if (sprite !== undefined) sprite.material.opacity = level;
};

export const setBadgeLevel = (badges: DuelBadges, duel: number, level: number): void => {
  setOpacity(badges.sprites.player[duel], level);
  setOpacity(badges.sprites.rival[duel], level);
};

const allBadges = ({ sprites }: DuelBadges): Sprite[] => [...sprites.player, ...sprites.rival];

export const hideBadges = (badges: DuelBadges): void => {
  for (const sprite of allBadges(badges)) {
    sprite.removeFromParent();
    sprite.material.opacity = 0;
  }
};

export const disposeDuelBadges = (badges: DuelBadges): void => {
  for (const sprite of allBadges(badges)) {
    sprite.material.dispose();
  }
  for (const map of badges.numbers.values()) {
    map.dispose();
  }
};
