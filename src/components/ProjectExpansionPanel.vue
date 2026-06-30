<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

import type { ProjectCurriculumItem, ProjectPhase } from '../models/projectProgress';

interface ProjectExpansionPanelProps {
  phase: ProjectPhase;
  phaseNumber: number;
  initiallyOpen?: boolean;
  selectedItemId?: string;
}

interface ProjectExpansionPanelEmits {
  selectItem: [phase: ProjectPhase, sectionId: string, item: ProjectCurriculumItem];
}

interface CurriculumSection {
  id: string;
  title: string;
  items: ProjectCurriculumItem[];
}

const props = withDefaults(defineProps<ProjectExpansionPanelProps>(), {
  initiallyOpen: false,
  selectedItemId: '',
});
const emit = defineEmits<ProjectExpansionPanelEmits>();

const isOpen = ref(props.initiallyOpen);
const checkedItems = reactive<Record<string, boolean>>({});
const openSections = reactive<Record<string, boolean>>({
  concepts: true,
  tools: true,
  practice: true,
});
const formattedPhaseNumber = computed<string>(() => String(props.phaseNumber).padStart(2, '0'));
const curriculumSections = computed<ReadonlyArray<CurriculumSection>>(() => [
  {
    id: 'concepts',
    title: 'Concepts',
    items: getCurriculumItems(props.phase.concepts),
  },
  {
    id: 'tools',
    title: 'Tools',
    items: getCurriculumItems(props.phase.tools),
  },
  {
    id: 'practice',
    title: 'Practice',
    items: getCurriculumItems(props.phase.practice),
  },
]);

/**
 * Gets a safe curriculum item list from an API field.
 *
 * @param items Curriculum items from the phase payload.
 * @returns Curriculum item array, or an empty array when missing.
 */
function getCurriculumItems(items: ProjectCurriculumItem[] | undefined): ProjectCurriculumItem[] {
  return Array.isArray(items) ? items : [];
}

/**
 * Checks whether a curriculum section is expanded.
 *
 * @param sectionId Curriculum section id.
 * @returns Whether the section is expanded.
 */
function isSectionOpen(sectionId: string): boolean {
  return openSections[sectionId] !== false;
}

/**
 * Toggles the expanded state for a curriculum section.
 *
 * @param sectionId Curriculum section id.
 */
function toggleSection(sectionId: string): void {
  openSections[sectionId] = !isSectionOpen(sectionId);
}

/**
 * Checks whether a curriculum item is completed.
 *
 * @param itemId Curriculum item id.
 * @returns Whether the item is checked.
 */
function isItemChecked(itemId: string): boolean {
  return checkedItems[itemId] === true;
}

/**
 * Toggles completion state for a curriculum item.
 *
 * @param itemId Curriculum item id.
 */
function toggleItemChecked(itemId: string): void {
  checkedItems[itemId] = !isItemChecked(itemId);
}

/**
 * Emits the selected curriculum item for detail-panel content.
 *
 * @param sectionId Curriculum section id.
 * @param item Curriculum item selected by the user.
 */
function selectItem(sectionId: string, item: ProjectCurriculumItem): void {
  emit('selectItem', props.phase, sectionId, item);
}

/**
 * Toggles the expanded state for the project phase panel.
 */
function togglePanel(): void {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <article class="expansion-panel surface-card">
    <button
      class="panel-toggle"
      type="button"
      :aria-expanded="isOpen"
      :aria-controls="`panel-content-${phase.id}`"
      @click="togglePanel"
    >
      <span class="panel-heading">
        <span class="phase-number text-headline-md">
          {{ formattedPhaseNumber }}
        </span>
        <span class="panel-title-group">
          <span class="panel-title text-headline-sm">
            {{ phase.title }}
          </span>
        </span>
      </span>

      <span
        class="material-symbols-outlined panel-icon"
        :class="{ 'panel-icon-open': isOpen }"
        aria-hidden="true"
      >
        keyboard_arrow_down
      </span>
    </button>

    <div class="collapse-frame" :class="{ 'collapse-frame-open': isOpen }" :aria-hidden="!isOpen">
      <div :id="`panel-content-${phase.id}`" class="panel-content">
        <section
          v-for="section in curriculumSections"
          :key="section.title"
          class="curriculum-section"
        >
          <button
            class="section-toggle"
            type="button"
            :aria-expanded="isSectionOpen(section.id)"
            :aria-controls="`section-content-${phase.id}-${section.id}`"
            @click="toggleSection(section.id)"
          >
            <span class="text-label-md curriculum-heading">
              {{ section.title }}
            </span>
            <span
              class="material-symbols-outlined section-icon"
              :class="{ 'section-icon-open': isSectionOpen(section.id) }"
              aria-hidden="true"
            >
              keyboard_arrow_down
            </span>
          </button>

          <div
            class="collapse-frame section-collapse"
            :class="{ 'collapse-frame-open': isSectionOpen(section.id) }"
            :aria-hidden="!isSectionOpen(section.id)"
          >
            <div :id="`section-content-${phase.id}-${section.id}`">
              <ul v-if="section.items.length > 0" class="curriculum-list">
                <li
                  v-for="item in section.items"
                  :key="item.id"
                  class="curriculum-item"
                  :class="{
                    'curriculum-item-selected': selectedItemId === item.id,
                    'curriculum-item-checked': isItemChecked(item.id),
                  }"
                >
                  <button
                    class="item-check"
                    type="button"
                    :aria-pressed="isItemChecked(item.id)"
                    :aria-label="`Mark ${item.title} as complete`"
                    @click="toggleItemChecked(item.id)"
                  >
                    <span
                      class="material-symbols-outlined item-check-icon"
                      :class="{ 'item-check-icon-filled': isItemChecked(item.id) }"
                      aria-hidden="true"
                    >
                      {{ isItemChecked(item.id) ? 'check_circle' : 'radio_button_unchecked' }}
                    </span>
                  </button>

                  <button
                    class="item-select"
                    type="button"
                    :aria-current="selectedItemId === item.id ? 'true' : undefined"
                    @click="selectItem(section.id, item)"
                  >
                    <span class="item-title text-body-sm">{{ item.title }}</span>
                  </button>
                </li>
              </ul>

              <p v-else class="empty-section text-body-sm text-muted">No entries recorded.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </article>
</template>

<style scoped>
.expansion-panel {
  overflow: hidden;
}

.panel-toggle {
  align-items: center;
  background: var(--color-surface-container-lowest);
  border: 0;
  color: var(--color-on-surface);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: var(--space-3);
  text-align: left;
  width: 100%;
}

.panel-toggle:hover {
  background: var(--color-surface-bright);
}

.panel-heading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.phase-number {
  color: var(--color-outline-variant);
  flex-shrink: 0;
  font-style: italic;
}

.panel-title-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.panel-title {
  color: var(--color-on-background);
}

.panel-icon {
  color: var(--color-outline);
  flex-shrink: 0;
  transform: rotate(0deg);
  transition: transform 160ms ease;
}

.panel-icon-open {
  transform: rotate(180deg);
}

.collapse-frame {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 180ms ease,
    opacity 180ms ease;
}

.collapse-frame > * {
  overflow: hidden;
}

.collapse-frame-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: 0 var(--space-3);
  transition: padding 180ms ease;
}

.collapse-frame-open > .panel-content {
  border-top: var(--border-control);
  padding: var(--space-3);
}

.curriculum-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.section-toggle {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 0;
  text-align: left;
  width: 100%;
}

.curriculum-heading {
  color: var(--color-primary);
  margin: 0;
}

.section-icon {
  color: var(--color-outline);
  font-size: var(--font-size-headline-sm);
  transform: rotate(0deg);
  transition: transform 160ms ease;
}

.section-icon-open {
  transform: rotate(180deg);
}

.section-collapse {
  transition-duration: 140ms;
}

.curriculum-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.curriculum-item {
  align-items: stretch;
  border-left: calc(var(--space-1) / 4) solid transparent;
  display: flex;
}

.curriculum-item:hover {
  background: var(--color-surface-bright);
}

.curriculum-item-selected {
  background: var(--color-surface-container-low);
  border-left: calc(var(--space-1) / 4) solid var(--color-primary);
}

.item-check,
.item-select {
  background: transparent;
  border: 0;
  color: var(--color-on-surface);
  cursor: pointer;
}

.item-check {
  align-items: flex-start;
  color: var(--color-primary);
  display: flex;
  flex-shrink: 0;
  padding: var(--space-2) var(--space-1) var(--space-2) var(--space-2);
}

.item-check-icon {
  font-size: var(--font-size-headline-sm);
  font-variation-settings: 'FILL' 0;
}

.item-check-icon-filled {
  color: var(--color-primary);
  font-variation-settings: 'FILL' 1;
}

.item-select {
  flex: 1;
  padding: var(--space-2);
  text-align: left;
}

.item-title {
  color: var(--color-on-surface);
}

.curriculum-item-checked .item-title {
  opacity: 0.6;
  text-decoration: line-through;
}

.empty-section {
  margin: 0;
}
</style>
