import type { RefObject } from 'preact';
import { useEffect, useState } from 'preact/hooks';

interface Size {
  readonly width: number;
  readonly height: number;
}

interface FitTargets {
  readonly slot: RefObject<HTMLElement | null>;
  readonly box: RefObject<HTMLElement | null>;
}

const isEmpty = ({ width, height }: Size): boolean => width <= 0 || height <= 0;

export const fitScale = (slot: Size, box: Size): number =>
  isEmpty(slot) || isEmpty(box) ? 1 : Math.min(1, slot.width / box.width, slot.height / box.height);

export const useFitScale = ({ slot, box }: FitTargets): number => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const slotElement = slot.current;
    const boxElement = box.current;
    if (slotElement === null || boxElement === null) return;
    const observer = new ResizeObserver(() => {
      setScale(
        fitScale(
          { width: slotElement.clientWidth, height: slotElement.clientHeight },
          { width: boxElement.offsetWidth, height: boxElement.offsetHeight },
        ),
      );
    });
    observer.observe(slotElement);
    return () => {
      observer.disconnect();
    };
  }, [slot, box]);
  return scale;
};
