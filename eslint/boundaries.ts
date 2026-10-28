import type { Linter } from 'eslint';
import boundaries from 'eslint-plugin-boundaries';
import type {
  DependenciesPolicy,
  DependenciesRuleOptions,
  ElementDescriptor,
  FileDescriptor,
} from 'eslint-plugin-boundaries';

const layer = (type: string, pattern: string): ElementDescriptor => ({
  type,
  pattern,
  partialMatch: false,
});

const elements: ElementDescriptor[] = [
  layer('domain', 'src/domain'),
  layer('application-ports', 'src/application/ports'),
  layer('application-store', 'src/application/store'),
  layer('application-commands', 'src/application/commands'),
  layer('application', 'src/application'),
  layer('infrastructure-three', 'src/infrastructure/three'),
  layer('infrastructure-browser', 'src/infrastructure/browser'),
  layer('ui', 'src/ui'),
  layer('assets', 'src/assets'),
  layer('composition', 'src/composition'),
];

const files: FileDescriptor[] = [
  { pattern: 'src/main.tsx', category: 'main' },
  { pattern: 'src/*.d.ts', category: 'ambient' },
  { pattern: 'src/**/*.test.{ts,tsx}', category: 'test' },
];

const external = (source: string | string[]) => ({
  to: { module: { origin: 'external', source } },
});

const element = (type: string | string[]) => ({ to: { element: { type } } });

const from = (type: string) => ({ element: { type } });

const policies: DependenciesPolicy[] = [
  { from: from('domain'), allow: element('domain') },
  {
    from: from('application*'),
    allow: [element(['domain', 'application*']), external('@preact/signals-core')],
  },
  {
    from: from('infrastructure-*'),
    allow: element([
      'domain',
      'application-ports',
      'application-store',
      'infrastructure-*',
      'assets',
    ]),
  },
  { from: from('infrastructure-three'), allow: external('three') },
  {
    from: from('ui'),
    allow: [
      element([
        'domain',
        'application-ports',
        'application-store',
        'application-commands',
        'ui',
        'assets',
      ]),
      external(['preact', '@preact/signals']),
    ],
  },
  {
    from: { file: { categories: 'main' } },
    allow: { to: { module: { origin: ['local', 'external', 'core'] } } },
  },
  {
    from: from('composition'),
    allow: { to: { module: { origin: ['local', 'external', 'core'] } } },
  },
  {
    from: { file: { categories: 'test' } },
    allow: external(['vitest', '@testing-library/preact']),
  },
  { disallow: { to: { file: { categories: 'test' } } } },
];

const dependencies: DependenciesRuleOptions = {
  default: 'disallow',
  checkAllOrigins: true,
  policies,
};

export const boundariesConfig = (rootPath: string): Linter.Config => ({
  files: ['src/**/*.{ts,tsx}'],
  plugins: { boundaries },
  settings: {
    'boundaries/root-path': rootPath,
    'boundaries/elements': elements,
    'boundaries/files': files,
    'import/resolver': {
      typescript: { alwaysTryTypes: true, project: './tsconfig.json' },
    },
  },
  rules: {
    'boundaries/dependencies': ['error', dependencies],
    'boundaries/no-unknown-files': 'error',
    'boundaries/no-unknown-dependencies': 'error',
  },
});
