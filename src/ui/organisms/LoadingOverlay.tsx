import { LOADING_TEXT } from '@ui/copy/hud-copy';

interface LoadingOverlayProps {
  readonly isVisible: boolean;
}

export const LoadingOverlay = ({ isVisible }: LoadingOverlayProps) => (
  <div
    role="status"
    class={`pointer-events-none fixed inset-0 flex items-center justify-center text-[11px] tracking-[0.5em] text-washi-dim transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
  >
    {isVisible ? LOADING_TEXT : ''}
  </div>
);
