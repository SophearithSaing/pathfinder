<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import {
  getProjectProgressById,
  updateCompletedItems,
  updateProjectProgress,
} from '../api/projectProgress';
import ConfigurableFormModal from '../components/ConfigurableFormModal.vue';
import EmptyState from '../components/EmptyState.vue';
import NoteCard from '../components/NoteCard.vue';
import NoteTextarea from '../components/NoteTextarea.vue';
import ProjectExpansionPanel from '../components/ProjectExpansionPanel.vue';
import ReferenceResourceCard from '../components/ReferenceResourceCard.vue';
import type {
  ProjectCurriculumItem,
  ProjectPhase,
  ProjectProgress,
  ProjectProgressEntry,
  ProjectProgressLink,
  ProjectProgressNote,
} from '../models/projectProgress';
import { getErrorMessage } from '../utils/error';

type ProgressModalMode =
  | 'none'
  | 'add-link'
  | 'edit-link'
  | 'delete-link'
  | 'edit-note'
  | 'delete-note';

const route = useRoute();
const projectProgress = ref<ProjectProgress | null>(null);
const isLoading = ref(false);
const errorMessage = ref('');
const selectedItem = ref<ProjectCurriculumItem | null>(null);
const selectedPhase = ref<ProjectPhase | null>(null);
const selectedSectionId = ref('');
const noteDraft = ref('');
const modalMode = ref<ProgressModalMode>('none');
const modalFormValue = ref<Record<string, string>>({});
const modalTargetId = ref('');
const projectPhases = computed<ProjectPhase[]>(() =>
  projectProgress.value?.project?.phases ?? [],
);
const selectedNotes = computed<ProjectProgressNote[]>(() => {
  if (projectProgress.value === null || selectedItem.value === null) {
    return [];
  }

  return projectProgress.value.notes[selectedItem.value.id]?.notes ?? [];
});
const selectedLinks = computed<ProjectProgressLink[]>(() => {
  if (projectProgress.value === null || selectedItem.value === null) {
    return [];
  }

  return projectProgress.value.notes[selectedItem.value.id]?.links ?? [];
});
const completedItems = computed<Record<string, boolean>>(() =>
  projectProgress.value?.completedItems ?? {},
);
const isModalOpen = computed<boolean>(() => modalMode.value !== 'none');
const modalTitle = computed<string>(() => {
  if (modalMode.value === 'add-link') {
    return 'Add Reference Link';
  }

  if (modalMode.value === 'edit-link') {
    return 'Edit Reference Link';
  }

  if (modalMode.value === 'delete-link') {
    return 'Remove Reference Link';
  }

  if (modalMode.value === 'edit-note') {
    return 'Edit Archival Note';
  }

  if (modalMode.value === 'delete-note') {
    return 'Remove Archival Note';
  }

  return '';
});
const modalDescription = computed<string>(() => {
  if (modalMode.value === 'add-link') {
    return 'Store a source title and URL for this roadmap item.';
  }

  if (modalMode.value === 'edit-link') {
    return 'Update the source details for this roadmap item.';
  }

  if (modalMode.value === 'edit-note') {
    return 'Revise the captured note for this roadmap item.';
  }

  return '';
});
const modalBodyText = computed<string>(() => {
  if (modalMode.value === 'delete-link') {
    return 'This action is permanent and cannot be undone. The reference link will be removed from your pathway curriculum.';
  }

  if (modalMode.value === 'delete-note') {
    return 'This action is permanent and cannot be undone. Are you sure you want to remove this observation from your captured notes?';
  }

  return '';
});
const modalFields = computed(() => {
  if (modalMode.value === 'add-link' || modalMode.value === 'edit-link') {
    return [
      {
        name: 'text',
        label: 'Source Title',
        type: 'text' as const,
        placeholder: 'Reference title',
      },
      {
        name: 'url',
        label: 'URL',
        type: 'text' as const,
        placeholder: 'https://example.com',
      },
    ];
  }

  if (modalMode.value === 'edit-note') {
    return [
      {
        name: 'text',
        label: 'Note Content',
        type: 'textarea' as const,
        placeholder: 'Begin writing...',
        rows: 8,
      },
    ];
  }

  return [];
});
const modalSaveLabel = computed<string>(() => {
  if (modalMode.value === 'delete-link' || modalMode.value === 'delete-note') {
    return 'Remove';
  }

  return 'Save';
});

/**
 * Loads the selected project progress record.
 */
async function loadProjectProgress(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await getProjectProgressById(String(route.params.progressId));
    projectProgress.value = response.projectProgress;
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Unable to load project progress.');
  } finally {
    isLoading.value = false;
  }
}

/**
 * Stores the selected roadmap item for the detail panel.
 *
 * @param phase Project phase containing the selected item.
 * @param sectionId Curriculum section id containing the item.
 * @param item Curriculum item selected by the user.
 */
function handleSelectItem(
  phase: ProjectPhase,
  sectionId: string,
  item: ProjectCurriculumItem,
): void {
  selectedPhase.value = phase;
  selectedSectionId.value = sectionId;
  selectedItem.value = item;
}

/**
 * Saves the current draft note to the selected roadmap item.
 */
async function handleSaveNote(): Promise<void> {
  if (
    projectProgress.value === null ||
    selectedItem.value === null ||
    noteDraft.value.trim() === ''
  ) {
    return;
  }

  const itemId = selectedItem.value.id;
  const notes = cloneProgressNotes(projectProgress.value.notes);
  const existingEntry = getProgressEntry(notes, itemId);

  notes[itemId] = {
    ...existingEntry,
    notes: [
      {
        text: noteDraft.value.trim(),
        timestamp: new Date().toISOString(),
      },
      ...existingEntry.notes,
    ],
  };

  try {
    await persistNotes(notes);
    noteDraft.value = '';
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Unable to save note.');
  }
}

/**
 * Persists a completed state change for a roadmap item.
 *
 * @param itemId Curriculum item id.
 * @param completed Whether the item is completed.
 */
async function handleToggleItemCompleted(itemId: string, completed: boolean): Promise<void> {
  if (projectProgress.value === null) {
    return;
  }

  try {
    const response = await updateCompletedItems(projectProgress.value._id, {
      [itemId]: completed,
    });

    mergeProjectProgress(response.projectProgress);
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Unable to update completed item.');
  }
}

/**
 * Opens the add link modal for the selected roadmap item.
 */
function handleAddLink(): void {
  if (selectedItem.value === null) {
    return;
  }

  openModal('add-link', {
    text: '',
    url: '',
  });
}

/**
 * Opens the edit link modal for an existing reference.
 *
 * @param linkId Link id generated from the selected link values.
 */
function handleEditLink(linkId: string): void {
  const link = findSelectedLink(linkId);

  if (link === null) {
    return;
  }

  openModal(
    'edit-link',
    {
      text: link.text,
      url: link.url,
    },
    linkId,
  );
}

/**
 * Opens the remove link modal for an existing reference.
 *
 * @param linkId Link id generated from the selected link values.
 */
function handleDeleteLink(linkId: string): void {
  if (findSelectedLink(linkId) === null) {
    return;
  }

  openModal('delete-link', {}, linkId);
}

/**
 * Opens the edit note modal for an existing note.
 *
 * @param noteId Note id generated from the selected item and timestamp.
 */
function handleEditNote(noteId: string): void {
  const note = findSelectedNote(noteId);

  if (note === null) {
    return;
  }

  openModal(
    'edit-note',
    {
      text: note.text,
    },
    noteId,
  );
}

/**
 * Opens the remove note modal for an existing note.
 *
 * @param noteId Note id generated from the selected item and timestamp.
 */
function handleDeleteNote(noteId: string): void {
  if (findSelectedNote(noteId) === null) {
    return;
  }

  openModal('delete-note', {}, noteId);
}

/**
 * Handles the active modal save action.
 *
 * @param value Current modal form value.
 */
async function handleModalSave(value: Record<string, string>): Promise<void> {
  try {
    if (modalMode.value === 'add-link') {
      await addSelectedLink(value);
    } else if (modalMode.value === 'edit-link') {
      await updateSelectedLink(modalTargetId.value, value);
    } else if (modalMode.value === 'delete-link') {
      await removeSelectedLink(modalTargetId.value);
    } else if (modalMode.value === 'edit-note') {
      await updateSelectedNote(modalTargetId.value, value);
    } else if (modalMode.value === 'delete-note') {
      await removeSelectedNote(modalTargetId.value);
    }

    closeModal();
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Unable to update progress notes.');
  }
}

/**
 * Opens a progress modal with optional initial values and target id.
 *
 * @param mode Modal mode to open.
 * @param value Initial modal form value.
 * @param targetId Target note or link id.
 */
function openModal(
  mode: ProgressModalMode,
  value: Record<string, string> = {},
  targetId = '',
): void {
  modalMode.value = mode;
  modalFormValue.value = value;
  modalTargetId.value = targetId;
}

/**
 * Closes the active progress modal and clears modal state.
 */
function closeModal(): void {
  modalMode.value = 'none';
  modalFormValue.value = {};
  modalTargetId.value = '';
}

/**
 * Adds a link to the selected roadmap item locally.
 *
 * @param value Modal form value containing text and url.
 */
async function addSelectedLink(value: Record<string, string>): Promise<void> {
  if (projectProgress.value === null || selectedItem.value === null) {
    return;
  }

  const text = value.text?.trim() ?? '';
  const url = value.url?.trim() ?? '';

  if (text === '' || url === '') {
    return;
  }

  const itemId = selectedItem.value.id;
  const notes = cloneProgressNotes(projectProgress.value.notes);
  const existingEntry = getProgressEntry(notes, itemId);

  notes[itemId] = {
    ...existingEntry,
    links: [
      ...existingEntry.links,
      {
        text,
        url,
      },
    ],
  };

  await persistNotes(notes);
}

/**
 * Updates a selected roadmap item link locally.
 *
 * @param linkId Link id generated from the selected link values.
 * @param value Modal form value containing text and url.
 */
async function updateSelectedLink(
  linkId: string,
  value: Record<string, string>,
): Promise<void> {
  if (projectProgress.value === null || selectedItem.value === null) {
    return;
  }

  const text = value.text?.trim() ?? '';
  const url = value.url?.trim() ?? '';

  if (text === '' || url === '') {
    return;
  }

  const itemId = selectedItem.value.id;
  const notes = cloneProgressNotes(projectProgress.value.notes);
  const existingEntry = getProgressEntry(notes, itemId);

  notes[itemId] = {
    ...existingEntry,
    links: existingEntry.links.map((link) =>
      getLinkId(link) === linkId
        ? {
            text,
            url,
          }
        : link,
    ),
  };

  await persistNotes(notes);
}

/**
 * Removes a selected roadmap item link locally.
 *
 * @param linkId Link id generated from the selected link values.
 */
async function removeSelectedLink(linkId: string): Promise<void> {
  if (projectProgress.value === null || selectedItem.value === null) {
    return;
  }

  const itemId = selectedItem.value.id;
  const notes = cloneProgressNotes(projectProgress.value.notes);
  const existingEntry = getProgressEntry(notes, itemId);

  notes[itemId] = {
    ...existingEntry,
    links: existingEntry.links.filter((link) => getLinkId(link) !== linkId),
  };

  await persistNotes(notes);
}

/**
 * Updates a selected roadmap item note locally.
 *
 * @param noteId Note id generated from the selected item and timestamp.
 * @param value Modal form value containing note text.
 */
async function updateSelectedNote(
  noteId: string,
  value: Record<string, string>,
): Promise<void> {
  if (projectProgress.value === null || selectedItem.value === null) {
    return;
  }

  const text = value.text?.trim() ?? '';

  if (text === '') {
    return;
  }

  const itemId = selectedItem.value.id;
  const notes = cloneProgressNotes(projectProgress.value.notes);
  const existingEntry = getProgressEntry(notes, itemId);

  notes[itemId] = {
    ...existingEntry,
    notes: existingEntry.notes.map((note) =>
      getNoteId(note) === noteId
        ? {
            ...note,
            text,
          }
        : note,
    ),
  };

  await persistNotes(notes);
}

/**
 * Removes a selected roadmap item note locally.
 *
 * @param noteId Note id generated from the selected item and timestamp.
 */
async function removeSelectedNote(noteId: string): Promise<void> {
  if (projectProgress.value === null || selectedItem.value === null) {
    return;
  }

  const itemId = selectedItem.value.id;
  const notes = cloneProgressNotes(projectProgress.value.notes);
  const existingEntry = getProgressEntry(notes, itemId);

  notes[itemId] = {
    ...existingEntry,
    notes: existingEntry.notes.filter((note) => getNoteId(note) !== noteId),
  };

  await persistNotes(notes);
}

/**
 * Persists updated notes and links for the current progress record.
 *
 * @param notes Notes map to persist.
 */
async function persistNotes(notes: Record<string, ProjectProgressEntry>): Promise<void> {
  if (projectProgress.value === null) {
    return;
  }

  const response = await updateProjectProgress(projectProgress.value._id, {
    projectId: projectProgress.value.projectId,
    completedItems: projectProgress.value.completedItems,
    progress: projectProgress.value.progress,
    notes,
  });

  mergeProjectProgress(response.projectProgress);
}

/**
 * Merges an updated progress response while preserving populated project data.
 *
 * @param updatedProjectProgress Updated project progress from the API.
 */
function mergeProjectProgress(updatedProjectProgress: ProjectProgress): void {
  const project = updatedProjectProgress.project ?? projectProgress.value?.project;

  projectProgress.value = {
    ...updatedProjectProgress,
    project,
  };
}

/**
 * Clones a project progress notes map.
 *
 * @param notes Notes map to clone.
 * @returns Cloned notes map.
 */
function cloneProgressNotes(
  notes: Record<string, ProjectProgressEntry>,
): Record<string, ProjectProgressEntry> {
  return Object.fromEntries(
    Object.entries(notes).map(([itemId, entry]) => [
      itemId,
      {
        notes: entry.notes.map((note) => ({ ...note })),
        links: entry.links.map((link) => ({ ...link })),
      },
    ]),
  );
}

/**
 * Gets a progress entry from a notes map, defaulting missing entries.
 *
 * @param notes Notes map to read from.
 * @param itemId Curriculum item id.
 * @returns Existing or empty progress entry.
 */
function getProgressEntry(
  notes: Record<string, ProjectProgressEntry>,
  itemId: string,
): ProjectProgressEntry {
  return notes[itemId] ?? { notes: [], links: [] };
}

/**
 * Finds a selected item link by generated link id.
 *
 * @param linkId Link id generated from the selected link values.
 * @returns Matching link, or null when none exists.
 */
function findSelectedLink(linkId: string): ProjectProgressLink | null {
  return selectedLinks.value.find((link) => getLinkId(link) === linkId) ?? null;
}

/**
 * Finds a selected item note by generated note id.
 *
 * @param noteId Note id generated from the selected item and timestamp.
 * @returns Matching note, or null when none exists.
 */
function findSelectedNote(noteId: string): ProjectProgressNote | null {
  return selectedNotes.value.find((note) => getNoteId(note) === noteId) ?? null;
}

/**
 * Builds a stable display id for a note from the selected item and timestamp.
 *
 * @param note Project progress note.
 * @returns Generated note id.
 */
function getNoteId(note: ProjectProgressNote): string {
  return `${selectedItem.value?.id ?? 'note'}-${note.timestamp}`;
}

/**
 * Builds a display id for a reference link.
 *
 * @param link Project progress reference link.
 * @returns Generated link id.
 */
function getLinkId(link: ProjectProgressLink): string {
  return `${selectedItem.value?.id ?? 'link'}-${link.text}-${link.url}`;
}

onMounted(() => {
  void loadProjectProgress();
});
</script>

<template>
  <main class="progress-page">
    <div class="progress-content">
      <section
        v-if="projectProgress !== null"
        class="progress-header"
        aria-labelledby="progress-title"
      >
        <div class="progress-heading stack-sm">
          <h1 id="progress-title" class="text-display-lg">
            {{ projectProgress.title }}
          </h1>
          <p class="text-body-lg text-muted">
            {{ projectProgress.description }}
          </p>
        </div>

        <div class="progress-summary" aria-label="Overall progress">
          <span class="text-headline-lg progress-percent"> {{ projectProgress.progress }}% </span>
          <span class="text-label-md text-muted progress-summary-label"> Overall Progress </span>
          <div
            class="progress-track"
            role="progressbar"
            :aria-valuenow="projectProgress.progress"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div class="progress-value" :style="{ width: `${projectProgress.progress}%` }"></div>
          </div>
        </div>
      </section>

      <section
        v-if="projectProgress !== null"
        class="progress-workspace"
        aria-label="Project workspace"
      >
        <div class="roadmap-column" aria-label="Mastery roadmap">
          <ProjectExpansionPanel
            v-for="(phase, index) in projectPhases"
            :key="phase.id"
            :phase="phase"
            :phase-number="index"
            :initially-open="index === 0"
            :selected-item-id="selectedItem?.id"
            :completed-items="completedItems"
            @select-item="handleSelectItem"
            @toggle-item-completed="handleToggleItemCompleted"
          />

          <p v-if="projectPhases.length === 0" class="empty-roadmap text-body-md text-muted">
            No project phases were included with this progress record.
          </p>
        </div>

        <aside class="detail-column" aria-label="Selected topic details">
          <section class="topic-header" aria-labelledby="selected-topic-title">
            <p v-if="selectedItem !== null" class="text-label-md text-muted topic-kicker">
              {{ selectedPhase?.title }} / {{ selectedSectionId }}
            </p>
            <h2 id="selected-topic-title" class="text-headline-lg">
              {{ selectedItem?.title ?? 'Select a roadmap item' }}
            </h2>
            <p class="text-body-lg text-muted">
              {{
                selectedItem?.description ??
                'Choose a concept, tool, or practice item to review notes and references.'
              }}
            </p>
          </section>

          <NoteTextarea
            v-model="noteDraft"
            :disabled="selectedItem === null"
            :placeholder="
              selectedItem === null
                ? 'Select a roadmap item before recording observations.'
                : 'Record your observations, reflections, or synthesis on this topic here...'
            "
            @save="handleSaveNote"
          />

          <section class="captured-notes" aria-labelledby="captured-notes-title">
            <h3 id="captured-notes-title" class="captured-notes-title text-label-md text-muted">
              <span class="material-symbols-outlined captured-notes-icon" aria-hidden="true">
                history
              </span>
              Captured Notes
            </h3>

            <div v-if="selectedNotes.length > 0" class="note-list">
              <NoteCard
                v-for="note in selectedNotes"
                :key="getNoteId(note)"
                :note-id="getNoteId(note)"
                :text="note.text"
                :timestamp="note.timestamp"
                @edit="handleEditNote"
                @delete="handleDeleteNote"
              />
            </div>

            <EmptyState
              v-else
              title="No notes captured yet"
              :copy="
                selectedItem === null
                  ? 'Select an item to view captured notes and build your knowledge base.'
                  : 'Start documenting your research for this concept in the observation area above to build your knowledge base.'
              "
              icon="history_edu"
            />
          </section>

          <section class="reference-resources" aria-labelledby="reference-resources-title">
            <h3 id="reference-resources-title" class="reference-resources-title text-label-md">
              <span class="material-symbols-outlined reference-resources-icon" aria-hidden="true">
                link
              </span>
              Reference Resources
            </h3>

            <div v-if="selectedLinks.length > 0" class="reference-resource-list">
              <ReferenceResourceCard
                v-for="link in selectedLinks"
                :key="getLinkId(link)"
                :resource-id="getLinkId(link)"
                :text="link.text"
                :url="link.url"
                @edit="handleEditLink"
                @delete="handleDeleteLink"
              />
            </div>

            <EmptyState
              v-else
              title="No references saved yet"
              :copy="
                selectedItem === null
                  ? 'Select an item to view saved references.'
                  : 'Add useful documentation, articles, or examples for this topic.'
              "
              icon="link_off"
            />

            <button
              class="add-reference-button text-label-md"
              type="button"
              :disabled="selectedItem === null"
              @click="handleAddLink"
            >
              <span class="material-symbols-outlined add-reference-icon" aria-hidden="true">
                add_link
              </span>
              Add New Reference
            </button>
          </section>
        </aside>
      </section>

      <section v-else class="progress-state surface-card">
        <p v-if="isLoading" class="text-body-md text-muted">Loading progress…</p>
        <p v-else-if="errorMessage" class="error-message text-body-md">
          {{ errorMessage }}
        </p>
      </section>

      <ConfigurableFormModal
        v-model="modalFormValue"
        :is-open="isModalOpen"
        :title="modalTitle"
        :description="modalDescription"
        :fields="modalFields"
        :body-text="modalBodyText"
        :save-label="modalSaveLabel"
        @save="handleModalSave"
        @close="closeModal"
        @cancel="closeModal"
      />
    </div>
  </main>
</template>

<style scoped>
.progress-page {
  background: var(--color-surface);
  color: var(--color-on-surface);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-5) var(--space-margin-mobile);
}

.progress-content {
  max-width: var(--space-container-max);
  width: 100%;
}

.progress-header {
  align-items: flex-start;
  border-bottom: var(--border-control);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-bottom: var(--space-4);
}

.progress-heading {
  max-width: calc(var(--space-base) * 88);
}

.progress-heading h1,
.progress-heading p,
.progress-state p {
  margin: 0;
}

.progress-heading h1,
.progress-percent {
  color: var(--color-primary);
}

.progress-summary {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.progress-percent,
.progress-summary-label {
  align-self: flex-start;
}

.progress-summary-label {
  margin-top: var(--space-1);
}

.progress-track {
  background: var(--color-surface-container-high);
  height: calc(var(--space-1) / 4);
  margin-top: var(--space-2);
  overflow: hidden;
  width: 100%;
}

.progress-value {
  background: var(--color-primary);
  height: 100%;
}

.progress-workspace {
  display: grid;
  gap: var(--space-gutter);
  margin-top: var(--space-5);
}

.roadmap-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.detail-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.progress-state {
  padding: var(--space-5);
}

.topic-header,
.captured-notes,
.note-list,
.reference-resources {
  display: flex;
  flex-direction: column;
}

.topic-header {
  gap: var(--space-1);
}

.captured-notes,
.note-list,
.reference-resources {
  gap: var(--space-3);
}

.reference-resources {
  background: var(--color-surface-container-low);
  border: var(--border-control);
  border-radius: var(--radius-xl);
  padding: var(--space-3);
}

.reference-resource-list {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: 1fr;
}

.detail-column h2,
.detail-column h3,
.detail-column p,
.empty-roadmap {
  margin: 0;
}

.detail-column h2 {
  color: var(--color-on-background);
}

.topic-kicker {
  text-transform: uppercase;
}

.captured-notes-title,
.reference-resources-title {
  align-items: center;
  display: flex;
  gap: var(--space-1);
}

.reference-resources-title {
  color: var(--color-primary);
}

.captured-notes-icon,
.reference-resources-icon {
  font-size: var(--font-size-headline-sm);
}

.add-reference-button {
  align-items: center;
  background: transparent;
  border: 2px dashed var(--color-outline-variant);
  border-radius: var(--radius-lg);
  color: var(--color-on-surface-variant);
  cursor: pointer;
  display: flex;
  gap: var(--space-1);
  justify-content: center;
  padding: var(--space-2);
}

.add-reference-button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.add-reference-icon {
  font-size: var(--font-size-headline-sm);
}

.error-message {
  color: var(--color-error);
}

@media (min-width: 768px) {
  .progress-page {
    padding: var(--space-7) var(--space-margin-desktop);
  }

  .progress-header {
    align-items: flex-end;
    flex-direction: row;
    gap: var(--space-5);
    justify-content: space-between;
  }

  .progress-summary {
    align-items: flex-end;
    flex-shrink: 0;
    width: calc(var(--space-base) * 30);
  }

  .progress-percent,
  .progress-summary-label {
    align-self: flex-end;
  }

  .progress-workspace {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  }

  .roadmap-column {
    border-right: var(--border-control);
    padding-right: var(--space-3);
  }

  .detail-column {
    padding-left: var(--space-3);
  }

  .reference-resource-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .progress-state {
    padding: var(--space-7);
  }
}
</style>
