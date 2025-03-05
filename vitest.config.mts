import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['**/test/**/*.test.{ts, tsx, mts, cts}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{webpack,vite,vitest,build,eslint,prettier}.config.*',
    ],
    watchExclude: ['**/node_modules/**', '**/dist/**'],
  },
});
