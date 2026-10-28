export type ModuleUrls = Readonly<Record<string, string>>;

export type UrlCatalog = ReadonlyMap<string, string>;

const stemOf = (path: string): string => {
  const name = path.slice(path.lastIndexOf('/') + 1);
  const dot = name.lastIndexOf('.');
  return dot === -1 ? name : name.slice(0, dot);
};

export const urlsByStem = (modules: ModuleUrls, prefix: string): UrlCatalog =>
  new Map(
    Object.entries(modules)
      .filter(([path]) => stemOf(path).startsWith(prefix))
      .map(([path, url]): [string, string] => [stemOf(path).slice(prefix.length), url]),
  );

export const requireUrl = (catalog: UrlCatalog, key: string): string => {
  const url = catalog.get(key);
  if (url === undefined) {
    throw new RangeError(`Missing asset: ${key}`);
  }
  return url;
};
