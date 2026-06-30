<script setup lang="ts">
interface AppFormFieldProps {
  id: string;
  label: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
}

interface AppFormFieldSlots {
  default: () => unknown;
  action?: () => unknown;
}

defineProps<AppFormFieldProps>();

defineSlots<AppFormFieldSlots>();
</script>

<template>
  <div class="form-field">
    <div class="form-field-header">
      <label :for="id" class="form-label text-label-md">
        {{ label }}
        <span v-if="required" aria-hidden="true">*</span>
      </label>

      <slot name="action"></slot>
    </div>

    <slot></slot>

    <p v-if="errorText" class="form-error text-body-sm" role="alert">
      {{ errorText }}
    </p>

    <p v-else-if="helperText" class="text-muted text-body-sm">
      {{ helperText }}
    </p>
  </div>
</template>

<style scoped>
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.form-field-header {
  align-items: baseline;
  display: flex;
  justify-content: space-between;
}

.form-label {
  color: var(--color-on-surface);
}

.form-error {
  color: var(--color-error);
}

:slotted(.text-input) {
  background: var(--color-surface-container-lowest);
  border: var(--border-control);
  border-radius: 0;
  color: var(--color-on-surface);
  padding: calc(var(--space-base) * 1.5) var(--space-2);
  width: 100%;
}

:slotted(.text-input--textarea) {
  line-height: var(--line-height-body-md);
  min-height: calc(var(--space-base) * 24);
  resize: vertical;
}

:slotted(.text-input::placeholder) {
  color: var(--color-outline-variant);
}

:slotted(.text-input:focus) {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: var(--focus-ring);
}
</style>
