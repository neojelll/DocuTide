import { defineConfig } from 'vitest/config';
import rootConfig from '../../../vitest.config.mts';

export default defineConfig({
  ...rootConfig,
  test: {
    ...rootConfig.test,
  },
});
