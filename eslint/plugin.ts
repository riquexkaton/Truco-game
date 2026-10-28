import type { ESLint } from 'eslint';

import { noComments } from './rules/no-comments';

export const local: ESLint.Plugin = {
  meta: { name: 'local' },
  rules: { 'no-comments': noComments },
};
