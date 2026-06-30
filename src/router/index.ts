import {
  createRouter,
  createWebHistory,
  type NavigationGuardReturn,
  type RouteLocationNormalized,
} from 'vue-router';

import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/progress/:progressId',
      name: 'progress',
      component: () => import('../views/ProgressView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(handleAuthRoute);

/**
 * Redirects users based on auth state and route requirements.
 *
 * @param to Route being navigated to.
 * @returns Redirect target when navigation should be redirected.
 */
async function handleAuthRoute(
  to: RouteLocationNormalized,
): Promise<NavigationGuardReturn> {
  const authStore = useAuthStore();

  if (!authStore.hasBootstrapped) {
    await authStore.bootstrapSession();
  }

  if (to.meta.requiresAuth === true && !authStore.isAuthenticated) {
    return { name: 'login' };
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'dashboard' };
  }

  return true;
}

export default router;
