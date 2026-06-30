<script setup lang="ts">
interface EmptyStateProps {
  title: string;
  copy: string;
  icon?: string;
}

withDefaults(defineProps<EmptyStateProps>(), {
  icon: 'history_edu',
});
</script>

<template>
  <div class="empty-state" role="status">
    <div class="empty-state-icon-frame" aria-hidden="true">
      <span class="material-symbols-outlined empty-state-icon">
        {{ icon }}
      </span>
    </div>
    <h4 class="empty-state-title text-headline-sm">
      {{ title }}
    </h4>
    <p class="empty-state-copy text-body-md text-muted">
      {{ copy }}
    </p>
  </div>
</template>

<style scoped>
.empty-state {
  align-items: center;
  background: color-mix(
    in srgb,
    var(--color-surface-container-lowest) 30%,
    transparent
  );
  border: 1px dashed color-mix(
    in srgb,
    var(--color-outline-variant) 30%,
    transparent
  );
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  padding: var(--space-7) var(--space-3);
  text-align: center;
}

.empty-state-icon-frame {
  align-items: center;
  background: color-mix(
    in srgb,
    var(--color-surface-container-high) 50%,
    transparent
  );
  border-radius: var(--radius-full);
  display: flex;
  height: calc(var(--space-base) * 10);
  justify-content: center;
  margin-bottom: var(--space-3);
  width: calc(var(--space-base) * 10);
}

.empty-state-icon {
  color: color-mix(in srgb, var(--color-outline-variant) 60%, transparent);
  font-size: calc(var(--space-base) * 5);
}

.empty-state-title {
  color: var(--color-on-surface);
  margin: 0 0 var(--space-1);
}

.empty-state-copy {
  margin: 0;
  max-width: calc(var(--space-base) * 48);
}
</style>
