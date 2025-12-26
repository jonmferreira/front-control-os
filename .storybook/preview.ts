import type { Preview } from '@storybook/vue3-vite';
import { setup } from '@storybook/vue3';
import PrimeVue from 'primevue/config';

import '../src/assets/main.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/lara-light-blue/theme.css';

setup((app) => {
  app.use(PrimeVue, { ripple: true });
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  decorators: [
    () => ({
      template: '<div class="min-h-screen bg-slate-100 p-6 text-slate-900"><story /></div>'
    })
  ]
};

export default preview;
