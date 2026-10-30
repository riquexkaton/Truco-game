import { describe, expect, it, vi } from 'vitest';

import { createPageActivity } from '@infrastructure/browser/page-activity';

class FakeDocument extends EventTarget {
  visibilityState: DocumentVisibilityState = 'visible';
}

const createPage = () => {
  const target = new EventTarget();
  const visibility = new FakeDocument();
  const show = (state: DocumentVisibilityState) => {
    visibility.visibilityState = state;
    visibility.dispatchEvent(new Event('visibilitychange'));
  };
  return { target, show, activity: createPageActivity(target, visibility) };
};

describe('the page activity', () => {
  it.each(['pointerdown', 'pointerup', 'keydown'])('reports a first %s once', (type) => {
    const { target, activity } = createPage();
    const listener = vi.fn();
    activity.onFirstGesture(listener);
    target.dispatchEvent(new Event(type));
    target.dispatchEvent(new Event('pointerdown'));
    target.dispatchEvent(new Event('keydown'));
    expect(listener).toHaveBeenCalledOnce();
  });

  it('ignores events that are not gestures', () => {
    const { target, activity } = createPage();
    const listener = vi.fn();
    activity.onFirstGesture(listener);
    target.dispatchEvent(new Event('pointermove'));
    expect(listener).not.toHaveBeenCalled();
  });

  it('reports when the page is hidden and shown again', () => {
    const { show, activity } = createPage();
    const listener = vi.fn();
    activity.onVisibilityChange(listener);
    show('hidden');
    show('visible');
    expect(listener.mock.calls).toEqual([[false], [true]]);
  });
});
