export const SIDE_SLOT =
  'fixed z-6 top-1/2 right-[max(20px,env(safe-area-inset-right,0px))] w-[min(424px,calc(100vw-40px))] -translate-y-1/2 tall:top-[calc(72px+env(safe-area-inset-top,0px))] tall:right-3.5 tall:left-3.5 tall:w-auto tall:translate-y-0';

export const CORNER_SLOT =
  'fixed z-6 top-[calc(16px+env(safe-area-inset-top,0px))] right-[max(40px,env(safe-area-inset-right,0px))] w-[min(516px,calc(100vw-56px))] tall:top-[calc(68px+env(safe-area-inset-top,0px))] tall:right-2.5 tall:left-2.5 tall:w-auto';

const TALL_QUERY = '(aspect-ratio < 4/5)';

export const isTallScreen = (): boolean => globalThis.matchMedia(TALL_QUERY).matches;
