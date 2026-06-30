<script setup lang="ts">
interface NoteCardProps {
  noteId: string;
  text: string;
  timestamp: string;
}

interface NoteCardEmits {
  edit: [noteId: string];
  delete: [noteId: string];
}

const props = defineProps<NoteCardProps>();
const emit = defineEmits<NoteCardEmits>();

/**
 * Formats the note timestamp for compact display.
 *
 * @param timestamp Timestamp from the note record.
 * @returns Formatted timestamp label.
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Emits an edit request for this note.
 */
function handleEdit(): void {
  emit('edit', props.noteId);
}

/**
 * Emits a delete request for this note.
 */
function handleDelete(): void {
  emit('delete', props.noteId);
}
</script>

<template>
  <article class="note-card surface-card printed-shadow">
    <header class="note-card-header">
      <div class="note-card-meta">
        <span class="material-symbols-outlined note-card-bookmark" aria-hidden="true">
          bookmark
        </span>
        <time class="text-label-md text-muted" :datetime="timestamp">
          {{ formatTimestamp(timestamp) }}
        </time>
      </div>

      <div class="note-card-actions" aria-label="Note actions">
        <button class="note-card-action" type="button" aria-label="Edit note" @click="handleEdit">
          <span class="material-symbols-outlined" aria-hidden="true">edit</span>
        </button>
        <button
          class="note-card-action note-card-action-danger"
          type="button"
          aria-label="Delete note"
          @click="handleDelete"
        >
          <span class="material-symbols-outlined" aria-hidden="true">delete</span>
        </button>
      </div>
    </header>

    <p class="note-card-text text-body-md text-muted">{{ text }}</p>
  </article>
</template>

<style scoped>
.note-card {
  border: var(--border-control);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  transition: border-color 160ms ease;
}

.note-card:hover {
  border-color: var(--color-primary);
}

.note-card-header {
  align-items: center;
  border-bottom: var(--border-control);
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  padding-bottom: var(--space-2);
}

.note-card-meta,
.note-card-actions {
  align-items: center;
  display: flex;
}

.note-card-meta {
  gap: var(--space-1);
}

.note-card-actions {
  gap: var(--space-2);
}

.note-card-bookmark {
  color: var(--color-primary);
  font-size: var(--font-size-body-md);
}

.note-card-action {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--color-on-surface-variant);
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.note-card-action:hover {
  color: var(--color-primary);
}

.note-card-action-danger:hover {
  color: var(--color-error);
}

.note-card-action .material-symbols-outlined {
  font-size: var(--font-size-headline-sm);
}

.note-card-text {
  margin: 0;
}
</style>
