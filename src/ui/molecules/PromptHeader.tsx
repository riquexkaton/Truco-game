import type { ComponentChildren } from 'preact';

import { Phrases } from '@ui/atoms/Phrases';
import type { Phrase } from '@ui/copy/prompt';

interface PromptHeaderProps {
  readonly seal: string;
  readonly sealClass: string;
  readonly phrases: readonly Phrase[];
  readonly messageClass: string;
  readonly ids: { readonly seal: string; readonly message: string };
  readonly aside: ComponentChildren;
}

export const PromptHeader = (props: PromptHeaderProps) => (
  <div class="flex min-h-11 items-center gap-3.5 tall:gap-3">
    <h2
      id={props.ids.seal}
      class={`shrink-0 leading-none font-extrabold whitespace-nowrap text-washi2 ${props.sealClass}`}
    >
      {props.seal}
    </h2>
    <p
      id={props.ids.message}
      class={`min-w-0 flex-1 leading-[1.35] font-semibold ${props.messageClass}`}
    >
      <Phrases phrases={props.phrases} />
    </p>
    {props.aside}
  </div>
);
