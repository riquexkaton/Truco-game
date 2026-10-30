import type { Phrase } from '@ui/copy/prompt';

interface PhrasesProps {
  readonly phrases: readonly Phrase[];
}

const PhraseText = ({ phrase }: { readonly phrase: Phrase }) => {
  if (phrase.emphasis === 'struck') return <s class="text-ink/50">{phrase.text}</s>;
  if (phrase.emphasis === 'none') return <>{phrase.text}</>;
  return (
    <b class={`font-extrabold ${phrase.emphasis === 'alarm' ? 'text-red' : ''}`}>{phrase.text}</b>
  );
};

export const Phrases = ({ phrases }: PhrasesProps) => (
  <>
    {phrases.map((phrase, index) => (
      <PhraseText key={String(index)} phrase={phrase} />
    ))}
  </>
);
