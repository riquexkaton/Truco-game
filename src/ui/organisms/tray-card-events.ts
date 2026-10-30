import type { TipControl } from '@ui/organisms/use-effect-tip';

export interface TrayCardEvents {
  readonly onPointerDown: (event: PointerEvent) => void;
  readonly onPointerEnter: (event: PointerEvent) => void;
  readonly onPointerLeave: (event: PointerEvent) => void;
  readonly onFocus: () => void;
  readonly onBlur: () => void;
  readonly onClick: () => void;
}

const isLiftedByTouch = ({ tip }: TipControl, index: number): boolean =>
  tip?.mode === 'touch' && tip.index === index;

const tap = (control: TipControl, index: number) => {
  if (!isLiftedByTouch(control, index)) control.open(index, 'touch');
  else if (control.isUsable(index)) control.use(index);
  else control.close();
};

const press = (control: TipControl, index: number) => {
  if (control.isUsable(index)) control.use(index);
  else control.open(index, 'hover');
};

const isMouse = (event: PointerEvent): boolean => event.pointerType === 'mouse';

export const trayCardEvents = (control: TipControl, index: number): TrayCardEvents => ({
  onPointerDown: (event) => {
    control.pointerRef.current = event.pointerType;
  },
  onPointerEnter: (event) => {
    if (isMouse(event)) control.hoverIn(index);
  },
  onPointerLeave: (event) => {
    if (isMouse(event)) control.hoverOut(index);
  },
  onFocus: () => {
    if (control.pointerRef.current === null) control.hoverIn(index);
  },
  onBlur: () => {
    control.hoverOut(index);
  },
  onClick: () => {
    const pointer = control.pointerRef.current;
    control.pointerRef.current = null;
    if (pointer === 'touch') tap(control, index);
    else press(control, index);
  },
});
