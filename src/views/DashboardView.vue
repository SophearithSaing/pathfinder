<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { getProjectProgress } from '../api/projectProgress';
import PathwayCard from '../components/PathwayCard.vue';
import type { ProjectProgress } from '../models/projectProgress';
import { getErrorMessage } from '../utils/error';

const router = useRouter();
const pathways = ref<ProjectProgress[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const hasPathways = computed<boolean>(() => pathways.value.length > 0);

/**
 * Loads pathway progress records for the dashboard.
 */
async function loadPathways(): Promise<void> {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    const response = await getProjectProgress();
    pathways.value = response.projectProgresses;
  } catch (error) {
    errorMessage.value = getErrorMessage(
      error,
      'Unable to load pathway records.',
    );
  } finally {
    isLoading.value = false;
  }
}

/**
 * Navigates to the selected project progress page.
 *
 * @param pathway Project progress selected by the user.
 */
async function handleResumePathway(pathway: ProjectProgress): Promise<void> {
  await router.push({
    name: 'progress',
    params: {
      progressId: pathway._id,
    },
  });
}

onMounted(() => {
  void loadPathways();
});
</script>

<template>
  <main class="dashboard-main">
    <div class="dashboard-content">
      <section class="dashboard-header" aria-labelledby="dashboard-title">
        <div>
          <h2 id="dashboard-title" class="text-display-lg">
            Curriculum &amp; Pathways
          </h2>
          <p class="text-body-lg text-muted">
            Your active scholarly pursuits and structured roadmaps. Mastery
            requires discipline, iteration, and a quiet space for focused study.
          </p>
        </div>
      </section>

      <section class="pathway-list" aria-live="polite">
        <p v-if="isLoading" class="state-message text-body-md text-muted">
          Loading active records…
        </p>

        <p v-else-if="errorMessage" class="state-message error-message text-body-md">
          {{ errorMessage }}
        </p>

        <p v-else-if="!hasPathways" class="state-message text-body-md text-muted">
          No active pathway records found.
        </p>

        <PathwayCard
          v-else
          v-for="pathway in pathways"
          :key="pathway._id"
          :pathway="pathway"
          @resume="handleResumePathway"
        />
      </section>

      <footer class="records-footer">
        <p class="text-label-md text-muted">End of Active Records</p>
      </footer>
    </div>
  </main>
</template>

<style scoped>
.dashboard-main {
  background: var(--color-surface);
  color: var(--color-on-surface);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-5) var(--space-margin-mobile);
  width: 100%;
}

.dashboard-content {
  max-width: calc(var(--space-base) * 128);
  width: 100%;
}

.dashboard-header {
  align-items: flex-start;
  border-bottom: var(--border-control);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-7);
  padding-bottom: var(--space-4);
}

.dashboard-header h2,
.dashboard-header p {
  margin: 0;
}

.dashboard-header h2 {
  color: var(--color-primary);
  margin-bottom: var(--space-1);
}

.pathway-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.state-message {
  margin: 0;
}

.error-message {
  color: var(--color-error);
}

.records-footer {
  border-top: var(--border-control);
  margin-top: var(--space-7);
  padding-top: var(--space-4);
  text-align: center;
  text-transform: uppercase;
}

.records-footer p {
  margin: 0;
}

@media (min-width: 768px) {
  .dashboard-main {
    padding: var(--space-7) var(--space-margin-desktop);
  }

  .dashboard-header {
    align-items: flex-end;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
