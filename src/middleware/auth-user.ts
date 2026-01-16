import { useAuthStore } from '~/stores/auth';

// Middleware for user routes - requires user authentication
export default defineNuxtRouteMiddleware(async () => {
  // Only run on client
  if (import.meta.server) return;

  const authStore = useAuthStore();

  // Check auth status if not already authenticated
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // Not logged in - redirect to login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login');
  }

  // Admin logged in - redirect to admin panel
  if (authStore.isAdmin) {
    return navigateTo('/admin');
  }

  // User authenticated - proceed
});
