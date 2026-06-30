import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import './assets/design-system.css';

/**
 * Creates and mounts the Vue app.
 */
async function bootstrapApp(): Promise<void> {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  app.use(router);
  app.mount('#app');
}

void bootstrapApp();
