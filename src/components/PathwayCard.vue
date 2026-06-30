<script setup lang="ts">
import type { ProjectProgress } from '../models/projectProgress';

interface PathwayCardProps {
  pathway: ProjectProgress;
}

interface PathwayCardEmits {
  resume: [pathway: ProjectProgress];
}

const props = defineProps<PathwayCardProps>();
const emit = defineEmits<PathwayCardEmits>();

/**
 * Emits the selected pathway for resume navigation.
 */
function handleResume(): void {
  emit('resume', props.pathway);
}
</script>

<template>
  <article class="pathway-card">
    <div class="pathway-accent" aria-hidden="true"></div>

    <div class="pathway-details">
      <h3 class="text-headline-lg">{{ pathway.title }}</h3>
      <p class="text-body-md text-muted">{{ pathway.description }}</p>
    </div>

    <div class="pathway-progress">
      <div class="progress-heading">
        <span class="text-label-md">Progress</span>
        <span class="text-body-md">{{ pathway.progress }}%</span>
      </div>

      <div class="progress-track" aria-hidden="true">
        <div class="progress-value" :style="{ width: `${pathway.progress}%` }"></div>
      </div>

      <button class="resume-button text-label-md" type="button" @click="handleResume">
        Resume Study
      </button>
    </div>
  </article>
</template>

<style scoped>
.pathway-card {
  background: var(--color-surface-container-lowest);
  border: var(--border-control);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  overflow: hidden;
  padding: var(--space-3);
  position: relative;
  transition: border-color 160ms ease;
}

.pathway-card:hover {
  border-color: var(--color-primary);
}

.pathway-card:hover .pathway-accent {
  background: var(--color-primary);
}

.pathway-accent {
  background: var(--color-surface-variant);
  bottom: 0;
  left: 0;
  position: absolute;
  top: 0;
  transition: background-color 160ms ease;
  width: calc(var(--space-1) / 2);
}

.pathway-details {
  flex: 1;
}

.pathway-details h3,
.pathway-details p {
  margin: 0;
}

.pathway-details h3 {
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.pathway-progress {
  border-top: var(--border-control);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: var(--space-3);
}

.progress-heading {
  align-items: baseline;
  color: var(--color-primary);
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-1);
  text-transform: uppercase;
}

.progress-track {
  background: var(--color-surface-variant);
  height: calc(var(--space-1) / 2);
  overflow: hidden;
  width: 100%;
}

.progress-value {
  background: var(--color-primary);
  height: 100%;
}

.resume-button {
  align-self: flex-end;
  background: none;
  border: 0;
  border-bottom: 1px solid var(--color-primary);
  color: var(--color-primary);
  cursor: pointer;
  margin-top: var(--space-2);
  padding: 0 0 calc(var(--space-1) / 4);
  text-transform: uppercase;
}

.resume-button:hover {
  border-color: var(--color-secondary);
  color: var(--color-secondary);
}

@media (min-width: 768px) {
  .pathway-card {
    flex-direction: row;
    gap: var(--space-5);
    padding: var(--space-4);
  }

  .pathway-progress {
    border-left: var(--border-control);
    border-top: 0;
    padding-left: var(--space-4);
    padding-top: 0;
    width: calc(var(--space-base) * 24);
  }
}
</style>
