import { defineConfig } from 'vitest/config';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: '.',
  plugins: [nxViteTsPaths(), tsconfigPaths({ root: '../../..' })],
  build: {
    target: 'es2021',
    outDir: '../../../dist/apps/server/user-service',
    emptyOutDir: true,
    lib: {
      entry: './src/main.ts',
      formats: ['cjs'],
      fileName: 'main',
    },
    rollupOptions: {
      external: [/node_modules/],
    },
    minify: false,
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    setupFiles: [],
  },
});
