import type { Linter } from 'eslint';

const countedLines = { skipBlankLines: true, skipComments: true };

export const sizeLimits: Linter.RulesRecord = {
  'max-lines': ['error', { max: 100, ...countedLines }],
  'max-lines-per-function': ['error', { max: 30, ...countedLines }],
  complexity: ['error', 8],
  'max-depth': ['error', 3],
  'max-params': ['error', 3],
  'max-statements': ['error', 15],
  'max-nested-callbacks': ['error', 3],
};

export const testSizeLimits: Linter.RulesRecord = {
  ...sizeLimits,
  'max-lines': ['error', { max: 200, ...countedLines }],
  'max-lines-per-function': 'off',
  'max-nested-callbacks': ['error', 4],
};

const impureGlobals = [
  'window',
  'document',
  'navigator',
  'localStorage',
  'sessionStorage',
  'fetch',
  'performance',
  'Date',
  'setTimeout',
  'setInterval',
  'clearTimeout',
  'clearInterval',
  'requestAnimationFrame',
  'cancelAnimationFrame',
];

export const domainPurity: Linter.RulesRecord = {
  'no-restricted-globals': [
    'error',
    ...impureGlobals.map((name) => ({
      name,
      message: 'The domain is pure: no DOM, no clock, no timers.',
    })),
  ],
  'no-restricted-properties': [
    'error',
    {
      object: 'Math',
      property: 'random',
      message: 'The domain receives randomness through the Random interface.',
    },
  ],
};
