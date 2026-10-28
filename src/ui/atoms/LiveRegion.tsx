interface LiveRegionProps {
  readonly text: string;
}

export const LiveRegion = ({ text }: LiveRegionProps) => (
  <div class="sr-only" aria-live="polite">
    {text}
  </div>
);
