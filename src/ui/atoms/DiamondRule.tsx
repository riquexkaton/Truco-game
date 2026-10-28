interface DiamondRuleProps {
  readonly class: string;
  readonly isFlipped?: boolean;
}

export const DiamondRule = ({ class: className, isFlipped = false }: DiamondRuleProps) => (
  <span aria-hidden="true" class={`diamond-rule ${isFlipped ? '-scale-x-100' : ''} ${className}`} />
);
