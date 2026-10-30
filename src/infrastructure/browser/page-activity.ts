interface VisibilitySource extends EventTarget {
  readonly visibilityState: DocumentVisibilityState;
}

interface PageActivity {
  readonly onFirstGesture: (listener: () => void) => void;
  readonly onVisibilityChange: (listener: (isVisible: boolean) => void) => void;
}

const GESTURES = ['pointerdown', 'pointerup', 'keydown'];
const CAPTURE = { capture: true };

const listenOnce = (target: EventTarget, listener: () => void): void => {
  const handle = () => {
    for (const type of GESTURES) target.removeEventListener(type, handle, CAPTURE);
    listener();
  };
  for (const type of GESTURES) target.addEventListener(type, handle, CAPTURE);
};

export const createPageActivity = (
  target: EventTarget,
  visibility: VisibilitySource,
): PageActivity => ({
  onFirstGesture: (listener) => {
    listenOnce(target, listener);
  },
  onVisibilityChange: (listener) => {
    visibility.addEventListener('visibilitychange', () => {
      listener(visibility.visibilityState === 'visible');
    });
  },
});
