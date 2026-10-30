import type { AnswerAction, RowLayout } from '@ui/molecules/AnswerButton';
import { AnswerButton } from '@ui/molecules/AnswerButton';

interface AnswerRowProps {
  readonly actions: readonly AnswerAction[];
  readonly layout: RowLayout;
}

const isPicking = (actions: readonly AnswerAction[]): boolean =>
  actions.some((action) => action.effect !== null);

export const AnswerRow = ({ actions, layout }: AnswerRowProps) => {
  const buttons = actions.map((action, index) => (
    <AnswerButton key={action.name} action={action} index={index} layout={layout} />
  ));
  if (isPicking(actions)) {
    return <div class="flex justify-center gap-3">{buttons}</div>;
  }
  if (layout === 'line') {
    return <div class="flex h-[46px] gap-2.5 tall:h-11 tall:gap-2">{buttons}</div>;
  }
  return (
    <div
      class="grid h-[52px] gap-2.5 tall:gap-2"
      style={{ gridTemplateColumns: `repeat(${String(actions.length)}, minmax(0, 1fr))` }}
    >
      {buttons}
    </div>
  );
};
