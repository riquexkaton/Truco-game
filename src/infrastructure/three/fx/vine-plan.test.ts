import { describe, expect, it } from 'vitest';

import type { VinePoint } from '@infrastructure/three/fx/vine-plan';
import { VINE_FIELD, VINE_TIMING, vinePlan, vineTurn } from '@infrastructure/three/fx/vine-plan';
import { CARD_HEIGHT, CARD_WIDTH, DUEL_SLOTS } from '@infrastructure/three/layout/table-points';

const CARD_HALF = { x: 0.5, y: CARD_HEIGHT / CARD_WIDTH / 2 };
const plan = vinePlan();

const first = (thread: readonly VinePoint[]): VinePoint =>
  thread[0] ?? { x: 0, y: 0, grow: 0, glint: 0 };
const last = (thread: readonly VinePoint[]): VinePoint => thread.at(-1) ?? first(thread);

const isUnderCard = ({ x, y }: VinePoint): boolean =>
  Math.abs(x) < CARD_HALF.x && Math.abs(y) < CARD_HALF.y;

const leafTips = plan.leaves.map((leaf) => ({
  x: leaf.x + Math.cos(leaf.angle) * leaf.length * 1.4,
  y: leaf.y + Math.sin(leaf.angle) * leaf.length * 1.4,
}));

describe('the embroidered vines under the winning card', () => {
  it('grow out from under the card on both sides and curl away from it', () => {
    for (const thread of plan.threads) {
      expect(isUnderCard(first(thread))).toBe(true);
      expect(Math.abs(last(thread).x)).toBeGreaterThan(CARD_HALF.x);
    }
    expect(plan.threads.some((thread) => last(thread).x > 0)).toBe(true);
    expect(plan.threads.some((thread) => last(thread).x < 0)).toBe(true);
  });

  it('stay on the decal, clear of its edges, so nothing is cut off', () => {
    const margin = 0.06;
    const points = [...plan.threads.flat(), ...plan.leaves, ...leafTips];
    for (const { x, y } of points) {
      expect(Math.abs(x)).toBeLessThan(VINE_FIELD.halfWidth - margin);
      expect(Math.abs(y)).toBeLessThan(VINE_FIELD.halfHeight - margin);
    }
  });

  it('stay out of the neighbouring duel slots', () => {
    const [left, middle] = DUEL_SLOTS.player;
    const gap = Math.abs((middle?.x ?? 0) - (left?.x ?? 0)) / CARD_WIDTH;
    for (const { x } of [...plan.threads.flat(), ...leafTips]) {
      expect(Math.abs(x)).toBeLessThan(gap - CARD_HALF.x);
    }
  });

  it('grow thread by thread from the card outward within about 1.2 s', () => {
    for (const thread of plan.threads) {
      const grows = thread.map(({ grow }) => grow);
      expect(grows).toEqual(grows.toSorted((a, b) => a - b));
      expect(first(thread).grow).toBeGreaterThanOrEqual(0);
      expect(last(thread).grow).toBeLessThanOrEqual(1.25);
    }
    expect(Math.max(...plan.threads.map((thread) => last(thread).grow))).toBeGreaterThan(1.1);
  });

  it('unfurl each leaf just after its thread reaches it, all within the reveal', () => {
    expect(plan.leaves.length).toBeGreaterThanOrEqual(10);
    for (const leaf of plan.leaves) {
      expect(leaf.grow).toBeGreaterThan(VINE_TIMING.early);
      expect(leaf.grow + VINE_TIMING.unfurl).toBeLessThanOrEqual(VINE_TIMING.span);
    }
  });

  it('run a glint along each thread once every five seconds, after the growth', () => {
    expect(VINE_TIMING.glintEvery).toBe(5);
    expect(VINE_TIMING.glintFrom).toBeGreaterThan(1.2);
    for (const thread of plan.threads) {
      const phases = thread.map(({ glint }) => glint);
      expect(phases).toEqual(phases.toSorted((a, b) => a - b));
      expect(Math.min(...phases)).toBeGreaterThan(0);
      expect(Math.max(...phases)).toBeLessThan(1);
    }
  });
});

describe('turning the vines per duel', () => {
  it('sends the long side of the vines outward on the edge slots', () => {
    for (const count of [0, 1, 2, 3]) {
      expect(vineTurn(-0.92, count).x).toBe(-1);
      expect(vineTurn(0.92, count).x).toBe(1);
    }
  });

  it('never repeats the same pattern for two winners in a row', () => {
    const slotXs = [-0.92, 0, 0.92, 0, 0, -0.92];
    const turns = slotXs.map((x, count) => vineTurn(x, count));
    for (let index = 1; index < turns.length; index += 1) {
      expect(turns[index]).not.toEqual(turns[index - 1]);
    }
  });

  it('turns the middle slot both ways over a few rounds', () => {
    const sides = new Set([0, 1, 2, 3].map((count) => vineTurn(0, count).x));
    expect(sides).toEqual(new Set([1, -1]));
  });
});
