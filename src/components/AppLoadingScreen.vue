<template>
  <main class="app-loading-screen" role="status" aria-live="polite">
    <img class="app-loading-logo" src="/images/logo.svg" alt="" />
    <h1 class="app-loading-title text-headline-lg">Pathfinder</h1>
    <div class="app-loading-status">
      <span class="app-loading-spinner" aria-hidden="true"></span>
      <p class="app-loading-copy text-label-md text-muted">Restoring session…</p>
    </div>
  </main>
</template>

<style scoped>
.app-loading-screen {
  align-items: center;
  background: var(--color-surface);
  color: var(--color-primary);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  justify-content: center;
  min-height: 100vh;
}

.app-loading-logo {
  height: var(--space-6);
  width: var(--space-6);
}

.app-loading-status {
  align-items: center;
  display: flex;
  gap: var(--space-1);
}

.app-loading-spinner {
  animation: app-loading-spin 800ms linear infinite;
  border: 2px solid var(--color-outline-variant);
  border-radius: var(--radius-full);
  border-top-color: var(--color-primary);
  height: var(--space-2);
  width: var(--space-2);
}

.app-loading-title,
.app-loading-copy {
  margin: 0;
}

@keyframes app-loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
