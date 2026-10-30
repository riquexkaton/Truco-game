import { IconButton } from '@ui/atoms/IconButton';
import { MENU_COPY } from '@ui/copy/menu-copy';
import { useFullscreen } from '@ui/organisms/use-fullscreen';

export const FullscreenButton = () => {
  const { isAvailable, isActive, toggle } = useFullscreen();
  if (!isAvailable) return null;
  return (
    <IconButton
      label={isActive ? MENU_COPY.exitFullscreen : MENU_COPY.fullscreen}
      icon={isActive ? 'shrink' : 'expand'}
      onClick={toggle}
    />
  );
};
