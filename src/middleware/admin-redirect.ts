import { useAuthStore } from '~/stores/auth';

// Middleware for admin login page - redirects to admin panel if already logged in as admin
export default defineNuxtRouteMiddleware(async () => {
  // Only run on client
  if (import.meta.server) return;

  const authStore = useAuthStore();

  // Check auth status if not already authenticated
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // Redirect to admin panel if already logged in as admin
  if (authStore.isAuthenticated && authStore.isAdmin) {
    return navigateTo('/admin');
  }
});
