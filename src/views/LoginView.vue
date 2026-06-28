<script setup lang="ts">
import { ref } from 'vue';

import AppButton from '../components/AppButton.vue';
import AppForm from '../components/AppForm.vue';
import AppFormField from '../components/AppFormField.vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const username = ref('');
const password = ref('');
const formError = ref('');
const isPasswordVisible = ref(false);
const isSubmitting = ref(false);

/**
 * Toggles password field visibility.
 */
function togglePasswordVisibility(): void {
  isPasswordVisible.value = !isPasswordVisible.value;
}

/**
 * Handles login form submission.
 */
async function handleSubmit(): Promise<void> {
  if (isSubmitting.value) {
    return;
  }

  formError.value = '';
  isSubmitting.value = true;
  username.value = username.value.trim();

  try {
    await authStore.login(username.value, password.value);
  } catch (error) {
    formError.value = getErrorMessage(error);
  } finally {
    isSubmitting.value = false;
  }
}

/**
 * Gets a readable error message.
 *
 * @param error Unknown error value.
 * @returns Error message to display.
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to begin session. Please try again.';
}
</script>

<template>
  <main class="login-page">
    <div class="login-backdrop" aria-hidden="true"></div>

    <section class="login-card surface-card" aria-labelledby="login-title">
      <header class="login-brand">
        <img class="login-mark" src="/images/logo.svg" alt="" aria-hidden="true" />

        <h1 id="login-title" class="login-title text-display-lg">Pathfinder</h1>

        <p class="login-subtitle text-body-md text-muted">Academic Pursuit</p>
      </header>

      <AppForm @submit="handleSubmit">
        <AppFormField id="username" label="Username" required>
          <input
            id="username"
            v-model="username"
            autocomplete="username"
            class="text-input"
            name="username"
            placeholder="your.username"
            required
            type="text"
          />
        </AppFormField>

        <AppFormField id="password" label="Password" required>
          <template #action>
            <button
              class="login-inline-action text-label-md"
              type="button"
              @click="togglePasswordVisibility"
            >
              {{ isPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </template>

          <input
            id="password"
            v-model="password"
            autocomplete="current-password"
            class="text-input"
            name="password"
            placeholder="••••••••"
            required
            :type="isPasswordVisible ? 'text' : 'password'"
          />
        </AppFormField>

        <p v-if="formError" class="login-error text-body-sm" role="alert">
          {{ formError }}
        </p>

        <AppButton :disabled="isSubmitting" full-width type="submit">
          <span class="text-label-md">
            {{ isSubmitting ? 'Beginning Session' : 'Begin Session' }}
          </span>
        </AppButton>
      </AppForm>

      <footer class="login-footer">
        <p class="text-body-sm">
          New to the archives?
          <a class="login-link" href="#">Request Access</a>
        </p>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  align-items: center;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  overflow: hidden;
  padding: var(--space-margin-mobile);
  position: relative;
}

.login-backdrop {
  background-image: url('/images/login-backdrop.jpg');
  background-image: image-set(
    url('/images/login-backdrop.webp') type('image/webp'),
    url('/images/login-backdrop.jpg') type('image/jpeg')
  );
  background-position: center;
  background-size: cover;
  inset: 0;
  opacity: 0.3;
  pointer-events: none;
  position: fixed;
  z-index: 0;
}

.login-card {
  max-width: 448px;
  padding: var(--space-5);
  position: relative;
  width: 100%;
  z-index: 1;
}

.login-brand {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-5);
  text-align: center;
}

.login-mark {
  display: block;
  height: var(--space-6);
  margin-bottom: var(--space-2);
  width: var(--space-6);
}

.login-title {
  color: var(--color-primary);
  margin: 0 0 var(--space-1);
}

.login-subtitle {
  font-style: italic;
  margin: 0;
}

.login-error {
  color: var(--color-error);
  margin: 0;
}

.login-inline-action {
  background: none;
  border: 0;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;

  &:hover {
    color: var(--color-secondary);
  }
}

.login-link {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;

  &:hover {
    color: var(--color-secondary);
  }
}

.login-footer {
  border-top: var(--border-subtle);
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  text-align: center;

  p {
    color: var(--color-on-surface-variant);
    margin: 0;
  }
}

@media (min-width: 768px) {
  .login-page {
    padding: var(--space-margin-desktop);
  }

  .login-card {
    padding: var(--space-7);
  }
}
</style>
