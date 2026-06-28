import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import './assets/design-system.css';

/**
 * Creates the Vue app and restores auth state before mounting.
 */
async function bootstrapApp(): Promise<void> {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  const authStore = useAuthStore(pinia);
  await authStore.bootstrapSession();

  app.use(router);
  await router.isReady();

  app.mount('#app');
}

void bootstrapApp();
