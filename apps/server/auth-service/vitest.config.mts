import { defineConfig } from 'vitest/config';
import rootConfig from '../../../vitest.config.mts';

export default defineConfig({
  ...rootConfig,
  test: {
    ...rootConfig.test,
    include: ['tests/**/*.test.{ts, tsx, mts, cts}'],
  },
});
