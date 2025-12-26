import { config } from '@vue/test-utils';
import { afterEach, vi } from 'vitest';

import { primeVueStubs } from './unit/primevue-stubs';

config.global.stubs = {
  ...(config.global.stubs ?? {}),
  ...primeVueStubs
};

afterEach(() => {
  vi.clearAllMocks();
});
