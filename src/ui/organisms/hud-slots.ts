export const VOICE_ANCHOR =
  'right-[max(20px,env(safe-area-inset-right,0px))] bottom-[calc(50%+40px)]';

export const SIDE_SLOT = `fixed z-6 ${VOICE_ANCHOR} w-[min(424px,calc(100vw-40px))] translate-y-[max(0px,calc(100%+52px-50dvh))] tall:top-[calc(72px+env(safe-area-inset-top,0px))] tall:bottom-auto tall:right-3.5 tall:left-3.5 tall:w-auto tall:translate-y-0`;

const TALL_QUERY = '(aspect-ratio < 4/5)';

export const isTallScreen = (): boolean => globalThis.matchMedia(TALL_QUERY).matches;
