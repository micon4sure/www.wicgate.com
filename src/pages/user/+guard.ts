import { redirect } from 'vike/abort';
import type { GuardAsync } from 'vike/types';
import { useAuthStore } from '../../stores/auth';

// Protect user panel - require user authentication
const guard: GuardAsync = async (_pageContext): Promise<void> => {
  // Only check on client side
  if (typeof window === 'undefined') return;

  const authStore = useAuthStore();

  // Check auth if not already done
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // Redirect unauthenticated users to login
  if (!authStore.isAuthenticated) {
    throw redirect('/login');
  }

  // Redirect admins to admin panel
  if (authStore.isAdmin) {
    throw redirect('/admin');
  }
};

export { guard };
