import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setupTests.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: [
        ...(configDefaults.coverage?.exclude ?? []),
        'src/main.ts',
        'src/router/**',
        'src/**/*.d.ts'
      ]
    }
  }
});
