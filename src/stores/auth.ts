import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import * as authApi from '../api/auth';
import type { AuthUser } from '../models/auth';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null);
  const isLoading = ref(false);
  const error = ref('');
  const isAuthenticated = computed<boolean>(() => user.value !== null);

  /**
   * Logs in and stores the authenticated user.
   *
   * @param username Username to authenticate.
   * @param password Password to authenticate.
   * @returns Authenticated user.
   */
  async function login(username: string, password: string): Promise<AuthUser> {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await authApi.login(username, password);
      user.value = response.user;

      return response.user;
    } catch (unknownError) {
      error.value = getErrorMessage(unknownError);
      throw unknownError;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Restores an existing authenticated session from cookies.
   *
   * @returns Authenticated user, or null when no session exists.
   */
  async function bootstrapSession(): Promise<AuthUser | null> {
    const currentUser = await loadCurrentUser();

    if (currentUser !== null) {
      return currentUser;
    }

    return await refreshSession();
  }

  /**
   * Loads the current authenticated user from existing auth cookies.
   *
   * @returns Authenticated user, or null when no session exists.
   */
  async function loadCurrentUser(): Promise<AuthUser | null> {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await authApi.me();
      user.value = response.user;

      return response.user;
    } catch (unknownError) {
      user.value = null;
      error.value = getErrorMessage(unknownError);

      return null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Refreshes auth cookies and stores the returned user.
   *
   * @returns Refreshed authenticated user, or null when refresh fails.
   */
  async function refreshSession(): Promise<AuthUser | null> {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await authApi.refresh();
      user.value = response.user;

      return response.user;
    } catch (unknownError) {
      user.value = null;
      error.value = getErrorMessage(unknownError);

      return null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Logs out through the API and clears local auth state.
   */
  async function logout(): Promise<void> {
    isLoading.value = true;
    error.value = '';

    try {
      await authApi.logout();
      clearAuth();
    } catch (unknownError) {
      error.value = getErrorMessage(unknownError);
      throw unknownError;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Clears local auth state.
   */
  function clearAuth(): void {
    user.value = null;
    error.value = '';
  }

  /**
   * Gets a readable error message.
   *
   * @param unknownError Unknown error value.
   * @returns Error message.
   */
  function getErrorMessage(unknownError: unknown): string {
    if (unknownError instanceof Error) {
      return unknownError.message;
    }

    return 'Unable to update authentication state.';
  }

  return {
    bootstrapSession,
    clearAuth,
    error,
    isAuthenticated,
    isLoading,
    loadCurrentUser,
    login,
    logout,
    refreshSession,
    user,
  };
});
