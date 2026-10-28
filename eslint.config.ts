import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import prettier from 'eslint-config-prettier/flat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { flatConfigs as importX } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

import { boundariesConfig } from './eslint/boundaries';
import { domainPurity, sizeLimits, testSizeLimits } from './eslint/limits';
import { local } from './eslint/plugin';

const rootPath = import.meta.dirname;
const sourceFiles = ['src/**/*.{ts,tsx}'];
const testFiles = ['src/**/*.test.{ts,tsx}'];

export default defineConfig(
  globalIgnores(['dist', 'coverage', 'legacy', 'assets-source', '.lighthouseci', 'public']),
  {
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      unicorn.configs.recommended,
      comments.recommended,
      importX.typescript,
    ],
    plugins: { local },
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: rootPath },
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({ alwaysTryTypes: true, project: './tsconfig.json' }),
      ],
    },
    rules: {
      'local/no-comments': 'error',
      '@eslint-community/eslint-comments/no-use': ['error', { allow: [] }],
      'import-x/no-cycle': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      'unicorn/name-replacements': 'off',
      'unicorn/no-null': 'off',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
    },
  },
  {
    files: ['src/ui/**/*.tsx'],
    rules: {
      'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }],
    },
  },
  boundariesConfig(rootPath),
  { files: sourceFiles, ignores: testFiles, rules: sizeLimits },
  { files: testFiles, extends: [vitest.configs.recommended], rules: testSizeLimits },
  { files: ['src/domain/**/*.{ts,tsx}'], rules: domainPurity },
  {
    files: ['src/ui/**/*.{ts,tsx}'],
    extends: [jsxA11y.flatConfigs.recommended, reactHooks.configs.flat.recommended],
  },
  prettier,
);
