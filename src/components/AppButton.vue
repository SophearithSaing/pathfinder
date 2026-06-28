<script setup lang="ts">
type AppButtonType = 'button' | 'submit' | 'reset';
type AppButtonVariant = 'primary';

interface AppButtonProps {
  type?: AppButtonType;
  variant?: AppButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<AppButtonProps>(), {
  type: 'button',
  variant: 'primary',
  fullWidth: false,
  disabled: false,
});
</script>

<template>
  <button
    :class="['app-button', `app-button--${variant}`, { 'app-button--full': fullWidth }]"
    :disabled="disabled"
    :type="type"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.app-button {
  align-items: center;
  border-radius: var(--radius-default);
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  padding: var(--space-2) var(--space-3);
  text-decoration: none;

  &--primary {
    background: var(--color-primary);
    border: 1px solid var(--color-primary);
    color: var(--color-on-primary);

    &:hover:not(:disabled) {
      background: var(--color-secondary);
      border-color: var(--color-secondary);
    }
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }

  &--full {
    width: 100%;
  }
}
</style>
