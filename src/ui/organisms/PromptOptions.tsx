import type { PaperButtonVariant } from '@ui/atoms/PaperButton';
import { PaperButton } from '@ui/atoms/PaperButton';
import { effectLabel } from '@ui/copy/effect-copy';
import type { PromptOption } from '@ui/copy/prompt';
import { EffectCard } from '@ui/molecules/EffectCard';

interface PromptOptionsProps {
  readonly options: readonly PromptOption<unknown>[];
  readonly onChoose: (answer: unknown) => void;
}

interface OptionProps {
  readonly option: PromptOption<unknown>;
  readonly onChoose: (answer: unknown) => void;
}

const OptionButton = ({ option, onChoose }: OptionProps) => {
  const choose = () => {
    onChoose(option.answer);
  };
  if (option.effect === null) {
    const variant: PaperButtonVariant = option.variant === 'pick' ? 'plain' : option.variant;
    return (
      <PaperButton variant={variant} onClick={choose}>
        {option.label}
      </PaperButton>
    );
  }
  return (
    <button
      type="button"
      aria-label={effectLabel(option.effect)}
      onClick={choose}
      class="group cursor-pointer rounded-[4px] p-0 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink"
    >
      <span class="block transition-transform duration-200 group-hover:-translate-y-1.5">
        <EffectCard effect={option.effect} size="big" />
      </span>
    </button>
  );
};

export const PromptOptions = ({ options, onChoose }: PromptOptionsProps) => (
  <div class="mt-1 flex flex-wrap justify-center gap-2.5">
    {options.map((option) => (
      <OptionButton key={option.label} option={option} onChoose={onChoose} />
    ))}
  </div>
);
