<script setup lang="ts">
import AppFormField from './AppFormField.vue';

export type ModalFormFieldType = 'text' | 'textarea';

export interface ModalFormField {
  name: string;
  label: string;
  type: ModalFormFieldType;
  placeholder?: string;
  rows?: number;
}

interface ConfigurableFormModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  fields: ModalFormField[];
  modelValue: Record<string, string>;
  bodyText?: string;
  saveLabel?: string;
  cancelLabel?: string;
}

interface ConfigurableFormModalEmits {
  'update:modelValue': [value: Record<string, string>];
  save: [value: Record<string, string>];
  cancel: [];
  close: [];
}

const props = withDefaults(defineProps<ConfigurableFormModalProps>(), {
  description: '',
  bodyText: '',
  saveLabel: 'Save',
  cancelLabel: 'Cancel',
});
const emit = defineEmits<ConfigurableFormModalEmits>();

/**
 * Updates a form field value by name.
 *
 * @param fieldName Field name to update.
 * @param event Field input event.
 */
function handleFieldInput(fieldName: string, event: Event): void {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;

  emit('update:modelValue', {
    ...props.modelValue,
    [fieldName]: target.value,
  });
}

/**
 * Emits a save request with the current form value.
 */
function handleSave(): void {
  emit('save', props.modelValue);
}

/**
 * Emits cancel and close requests for the modal.
 */
function handleCancel(): void {
  emit('cancel');
  emit('close');
}

/**
 * Emits a close request for the modal.
 */
function handleClose(): void {
  emit('close');
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-shell" role="presentation">
      <div class="modal-backdrop" aria-hidden="true" @click="handleClose"></div>

      <section
        class="modal-panel printed-shadow"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`${title}-modal-title`"
      >
        <header class="modal-header">
          <div class="modal-heading">
            <h2 :id="`${title}-modal-title`" class="modal-title text-headline-lg">
              {{ title }}
            </h2>
            <p v-if="description" class="modal-description text-body-md text-muted">
              {{ description }}
            </p>
          </div>

          <button
            class="modal-close"
            type="button"
            aria-label="Close modal"
            @click="handleClose"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </header>

        <form class="modal-form" @submit.prevent="handleSave">
          <p v-if="fields.length === 0 && bodyText" class="modal-body-text text-body-md text-muted">
            {{ bodyText }}
          </p>

          <AppFormField
            v-for="field in fields"
            :id="field.name"
            :key="field.name"
            :label="field.label"
          >
            <textarea
              v-if="field.type === 'textarea'"
              :id="field.name"
              class="text-input text-input--textarea text-body-md"
              :name="field.name"
              :placeholder="field.placeholder"
              :rows="field.rows ?? 8"
              :value="modelValue[field.name] ?? ''"
              @input="handleFieldInput(field.name, $event)"
            ></textarea>

            <input
              v-else
              :id="field.name"
              class="text-input text-body-lg"
              :name="field.name"
              :placeholder="field.placeholder"
              type="text"
              :value="modelValue[field.name] ?? ''"
              @input="handleFieldInput(field.name, $event)"
            />
          </AppFormField>

          <footer class="modal-actions">
            <button class="modal-cancel text-label-md" type="button" @click="handleCancel">
              {{ cancelLabel }}
            </button>
            <button
              class="modal-save text-label-md"
              :class="{ 'modal-save-danger': saveLabel === 'Remove' }"
              type="submit"
            >
              <span class="material-symbols-outlined modal-save-icon" aria-hidden="true">
                {{ saveLabel === 'Remove' ? 'delete' : 'save' }}
              </span>
              {{ saveLabel }}
            </button>
          </footer>
        </form>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-shell {
  align-items: center;
  display: flex;
  inset: 0;
  justify-content: center;
  padding: var(--space-margin-mobile);
  position: fixed;
  z-index: 100;
}

.modal-backdrop {
  background: color-mix(in srgb, var(--color-on-background) 40%, transparent);
  backdrop-filter: blur(var(--space-1));
  inset: 0;
  position: absolute;
}

.modal-panel {
  background: var(--color-surface-container-lowest);
  border: var(--border-control);
  border-radius: var(--radius-default);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: calc(var(--space-base) * 84);
  padding: var(--space-4);
  position: relative;
  width: 100%;
}

.modal-header {
  align-items: flex-start;
  border-bottom: var(--border-subtle);
  display: flex;
  gap: var(--space-3);
  justify-content: space-between;
  padding-bottom: var(--space-3);
}

.modal-heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.modal-title,
.modal-description {
  margin: 0;
}

.modal-title {
  color: var(--color-primary);
}

.modal-close {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--radius-full);
  color: var(--color-on-surface-variant);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: var(--space-5);
  justify-content: center;
  width: var(--space-5);
}

.modal-close:hover {
  background: var(--color-surface-container-low);
  color: var(--color-primary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.modal-body-text {
  margin: 0;
}

.modal-actions {
  align-items: center;
  border-top: var(--border-subtle);
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
  margin-top: var(--space-1);
  padding-top: var(--space-3);
}

.modal-cancel,
.modal-save {
  align-items: center;
  border-radius: var(--radius-default);
  cursor: pointer;
  display: inline-flex;
  min-height: calc(var(--space-base) * 5);
  padding: calc(var(--space-base) * 1.25) var(--space-3);
}

.modal-cancel {
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}

.modal-cancel:hover {
  background: var(--color-surface-container-low);
}

.modal-save {
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: var(--color-on-primary);
  gap: var(--space-1);
}

.modal-save:hover {
  background: var(--color-primary-container);
  border-color: var(--color-primary-container);
}

.modal-save-danger {
  background: var(--color-error);
  border-color: var(--color-error);
  color: var(--color-on-error);
}

.modal-save-danger:hover {
  background: var(--color-error-container);
  border-color: var(--color-error-container);
  color: var(--color-on-error-container);
}

.modal-save-icon {
  font-size: var(--font-size-body-md);
  line-height: 1;
}

@media (min-width: 768px) {
  .modal-shell {
    padding: var(--space-margin-desktop);
  }

  .modal-panel {
    padding: var(--space-6);
  }
}
</style>
