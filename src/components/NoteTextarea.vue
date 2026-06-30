<script setup lang="ts">
interface NoteTextareaProps {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
  saveLabel?: string;
}

interface NoteTextareaEmits {
  'update:modelValue': [value: string];
  save: [];
}

withDefaults(defineProps<NoteTextareaProps>(), {
  placeholder: 'Record your observations, reflections, or synthesis here...',
  disabled: false,
  saveLabel: 'Save Note',
});

const emit = defineEmits<NoteTextareaEmits>();

/**
 * Emits textarea value changes for v-model binding.
 *
 * @param event Textarea input event.
 */
function handleInput(event: Event): void {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value);
}

/**
 * Emits a save request for the current note value.
 */
function handleSave(): void {
  emit('save');
}
</script>

<template>
  <section class="note-textarea surface-card printed-shadow" aria-labelledby="note-textarea-title">
    <h3 id="note-textarea-title" class="note-textarea-title text-label-md">
      <span class="material-symbols-outlined note-textarea-icon" aria-hidden="true">
        edit_note
      </span>
      Observation Area
    </h3>

    <textarea
      class="note-textarea-input text-body-md"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
    ></textarea>

    <div class="note-textarea-actions">
      <button
        class="note-textarea-save text-label-md"
        type="button"
        :disabled="disabled"
        @click="handleSave"
      >
        <span class="material-symbols-outlined note-textarea-save-icon" aria-hidden="true">
          save
        </span>
        {{ saveLabel }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.note-textarea {
  border: var(--border-control);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  padding: var(--space-3);
}

.note-textarea-title {
  align-items: center;
  color: var(--color-primary);
  display: flex;
  gap: var(--space-1);
  margin: 0 0 var(--space-2);
}

.note-textarea-icon {
  font-size: var(--font-size-headline-sm);
}

.note-textarea-input {
  background: transparent;
  border: 0;
  color: var(--color-on-surface);
  min-height: calc(var(--space-base) * 15);
  padding: var(--space-2);
  resize: vertical;
  width: 100%;
}

.note-textarea-input::placeholder {
  color: var(--color-outline);
}

.note-textarea-actions {
  border-top: var(--border-control);
  display: flex;
  justify-content: flex-end;
  margin-top: var(--space-3);
  padding-top: var(--space-3);
}

.note-textarea-save {
  align-items: center;
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-default);
  color: var(--color-on-primary);
  cursor: pointer;
  display: inline-flex;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
}

.note-textarea-save:hover:not(:disabled) {
  background: var(--color-primary-container);
  border-color: var(--color-primary-container);
}

.note-textarea-save:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.note-textarea-save-icon {
  font-size: var(--font-size-body-md);
}
</style>
