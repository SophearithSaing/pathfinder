<script setup lang="ts">
import { computed } from 'vue';

interface ReferenceResourceCardProps {
  resourceId: string;
  text: string;
  url: string;
}

interface ReferenceResourceCardEmits {
  edit: [resourceId: string];
  delete: [resourceId: string];
}

const props = defineProps<ReferenceResourceCardProps>();
const emit = defineEmits<ReferenceResourceCardEmits>();
const urlLabel = computed<string>(() => getUrlLabel(props.url));

/**
 * Gets a compact display label for a reference URL.
 *
 * @param url Reference URL.
 * @returns Hostname when valid, otherwise the original URL.
 */
function getUrlLabel(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Emits an edit request for this reference resource.
 */
function handleEdit(): void {
  emit('edit', props.resourceId);
}

/**
 * Emits a delete request for this reference resource.
 */
function handleDelete(): void {
  emit('delete', props.resourceId);
}
</script>

<template>
  <article class="reference-resource-card">
    <a class="reference-resource-link" :href="url" rel="noreferrer" target="_blank">
      <span class="reference-resource-heading">
        <span class="reference-resource-title text-label-md">
          {{ text }}
        </span>
      </span>
      <span class="reference-resource-url text-body-sm text-muted">
        {{ urlLabel }}
      </span>
    </a>

    <div class="reference-resource-actions" aria-label="Reference actions">
      <button
        class="reference-resource-action"
        type="button"
        aria-label="Edit reference"
        @click="handleEdit"
      >
        <span class="material-symbols-outlined" aria-hidden="true">edit</span>
      </button>
      <button
        class="reference-resource-action reference-resource-action-danger"
        type="button"
        aria-label="Delete reference"
        @click="handleDelete"
      >
        <span class="material-symbols-outlined" aria-hidden="true">delete</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.reference-resource-card {
  align-items: flex-start;
  background: var(--color-surface-bright);
  border: var(--border-control);
  border-radius: var(--radius-lg);
  color: var(--color-on-background);
  display: flex;
  gap: var(--space-2);
  padding: var(--space-2);
}

.reference-resource-link {
  color: var(--color-on-background);
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
  text-decoration: none;
}

.reference-resource-card:hover {
  border-color: var(--color-primary);
}

.reference-resource-card:hover .reference-resource-title {
  color: var(--color-primary);
}

.reference-resource-actions {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: calc(var(--space-1) / 2);
  opacity: 0;
  transition: opacity 160ms ease;
}

.reference-resource-card:hover .reference-resource-actions,
.reference-resource-card:focus-within .reference-resource-actions {
  opacity: 1;
}

.reference-resource-action {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--radius-default);
  color: var(--color-on-surface-variant);
  cursor: pointer;
  display: inline-flex;
  padding: var(--space-1);
}

.reference-resource-action:hover {
  background: var(--color-surface-container);
  color: var(--color-primary);
}

.reference-resource-action-danger:hover {
  background: var(--color-error-container);
  color: var(--color-error);
}

.reference-resource-action .material-symbols-outlined {
  font-size: var(--font-size-body-md);
}

.reference-resource-heading {
  align-items: center;
  display: flex;
  gap: var(--space-2);
  justify-content: space-between;
}

.reference-resource-title {
  color: var(--color-on-background);
}

.reference-resource-url {
  overflow-wrap: anywhere;
}
</style>
