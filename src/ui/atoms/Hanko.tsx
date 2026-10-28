import type { ComponentChildren } from 'preact';

interface HankoProps {
  readonly class: string;
  readonly children: ComponentChildren;
}

export const Hanko = ({ class: className, children }: HankoProps) => (
  <span class={`hanko ${className}`}>{children}</span>
);
