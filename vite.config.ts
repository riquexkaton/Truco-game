import preact from '@preact/preset-vite';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import { defineConfig } from 'vitest/config';

const coverageThresholds = { lines: 90, functions: 90, statements: 90, branches: 85 };

export default defineConfig({
  plugins: [preact(), tailwindcss(), imagetools()],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    target: 'baseline-widely-available',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'three', test: /node_modules[\\/]three[\\/]/ }],
        },
      },
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'ui',
          environment: 'happy-dom',
          include: ['src/ui/**/*.test.{ts,tsx}'],
        },
      },
      {
        test: {
          name: 'core',
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/ui/**'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/types.ts',
        'src/**/*.types.ts',
        'src/application/ports/**',
      ],
      thresholds: {
        'src/domain/**': coverageThresholds,
        'src/application/**': coverageThresholds,
      },
    },
  },
});
