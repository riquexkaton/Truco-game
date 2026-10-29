import { useEffect, useState } from 'preact/hooks';

export const usePreloadedUrl = (url: string): string | null => {
  const [readyUrl, setReadyUrl] = useState<string | null>(null);
  useEffect(() => {
    const image = new Image();
    const settle = () => {
      setReadyUrl(url);
    };
    image.addEventListener('load', settle);
    image.addEventListener('error', settle);
    image.src = url;
    return () => {
      image.removeEventListener('load', settle);
      image.removeEventListener('error', settle);
    };
  }, [url]);
  return readyUrl;
};
