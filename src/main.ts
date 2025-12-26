import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import DialogService from 'primevue/dialogservice';
import DynamicDialog from 'primevue/dynamicdialog';
import ToastService from 'primevue/toastservice';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

import App from './App.vue';
import router from './router';
import './assets/main.css';

import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';
import { SessionExpiredError } from './services/api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false
    }
  }
});

const app = createApp(App);

app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(DialogService);
app.use(ToastService);
app.use(VueQueryPlugin, { queryClient });
app.component('DynamicDialog', DynamicDialog);

app.config.errorHandler = (err) => {
  console.error('Global error:', err);

  if (err instanceof SessionExpiredError) {
    router.push('/login');
  }
};

app.mount('#app');
