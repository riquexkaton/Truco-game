declare module '*format=webp' {
  const src: string;
  export default src;
}

declare module '*format=avif' {
  const src: string;
  export default src;
}

declare module '*as=srcset' {
  const srcset: string;
  export default srcset;
}

declare module '*as=metadata' {
  export const src: string;
  export const width: number;
  export const height: number;
  export const format: string;
}
