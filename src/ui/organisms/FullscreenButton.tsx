import { Icon } from '@ui/atoms/Icon';
import { MENU_COPY } from '@ui/copy/menu-copy';
import { useFullscreen } from '@ui/organisms/use-fullscreen';

export const FullscreenButton = () => {
  const { isAvailable, isActive, toggle } = useFullscreen();
  if (!isAvailable) return null;
  return (
    <button
      type="button"
      aria-label={isActive ? MENU_COPY.exitFullscreen : MENU_COPY.fullscreen}
      onClick={toggle}
      class="grid size-11 cursor-pointer place-items-center text-washi/75 transition-colors duration-150 hover:text-washi focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-seal motion-reduce:transition-none"
    >
      <Icon
        name={isActive ? 'shrink' : 'expand'}
        class="size-[18px] fill-none stroke-current stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]"
      />
    </button>
  );
};
