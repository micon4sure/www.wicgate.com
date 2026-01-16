import { useAuthStore } from '~/stores/auth';

// Middleware for admin routes - requires admin authentication
export default defineNuxtRouteMiddleware(async () => {
  // Only run on client
  if (import.meta.server) return;

  const authStore = useAuthStore();

  // Check auth status if not already authenticated
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // Not logged in - redirect to admin login
  if (!authStore.isAuthenticated) {
    return navigateTo('/admin-login');
  }

  // Logged in but not admin - redirect to user panel
  if (!authStore.isAdmin) {
    return navigateTo('/user');
  }

  // Admin authenticated - proceed
});
