<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const actionLabel = computed<string>(() =>
  authStore.isAuthenticated ? 'Logout' : 'Login',
);

/**
 * Handles the auth action for the current session state.
 */
async function handleAuthAction(): Promise<void> {
  if (authStore.isAuthenticated) {
    await authStore.logout();
    await router.push({ name: 'login' });

    return;
  }

  await router.push({ name: 'login' });
}
</script>

<template>
  <header class="app-header">
    <RouterLink class="app-header-brand" :to="{ name: 'dashboard' }">
      <img class="app-header-logo" src="/images/logo.svg" alt="Pathfinder" />
      <span class="text-headline-md">Pathfinder</span>
    </RouterLink>

    <button
      class="app-header-action text-label-md"
      type="button"
      :disabled="authStore.isLoading"
      @click="handleAuthAction"
    >
      {{ actionLabel }}
    </button>
  </header>
</template>

<style scoped>
.app-header {
  align-items: center;
  background: var(--color-surface);
  border-bottom: var(--border-control);
  display: flex;
  justify-content: space-between;
  padding: var(--space-3) var(--space-margin-mobile);
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 1;
}

.app-header-brand {
  align-items: center;
  color: var(--color-primary);
  display: inline-flex;
  gap: var(--space-1);
  text-decoration: none;
}

.app-header-logo {
  height: var(--space-4);
  width: var(--space-4);
}

.app-header-action {
  background: transparent;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-default);
  color: var(--color-primary);
  cursor: pointer;
  padding: var(--space-1) var(--space-2);
}

.app-header-action:hover:not(:disabled) {
  background: var(--color-surface-container-low);
}

.app-header-action:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

@media (min-width: 768px) {
  .app-header {
    padding: var(--space-3) var(--space-margin-desktop);
  }
}
</style>
