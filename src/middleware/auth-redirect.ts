import { useAuthStore } from '~/stores/auth';

// Middleware for login page - redirects to user panel if already logged in as user
export default defineNuxtRouteMiddleware(async () => {
  // Only run on client
  if (import.meta.server) return;

  const authStore = useAuthStore();

  // Check auth status if not already authenticated
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // Redirect to user panel if already logged in as user
  if (authStore.isAuthenticated && authStore.isUser) {
    return navigateTo('/user');
  }
});
