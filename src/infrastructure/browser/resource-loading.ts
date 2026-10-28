export interface BitmapRequest {
  readonly url: string;
  readonly flipY: boolean;
}

const fetchOk = async (url: string): Promise<Response> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Cannot load ${url}: HTTP ${String(response.status)}`);
  }
  return response;
};

export const loadImageBitmap = async ({ url, flipY }: BitmapRequest): Promise<ImageBitmap> => {
  const response = await fetchOk(url);
  const blob = await response.blob();
  return createImageBitmap(blob, {
    imageOrientation: flipY ? 'flipY' : 'from-image',
    premultiplyAlpha: 'none',
    colorSpaceConversion: 'none',
  });
};

export const loadJson = async (url: string): Promise<unknown> => {
  const response = await fetchOk(url);
  const data: unknown = await response.json();
  return data;
};
