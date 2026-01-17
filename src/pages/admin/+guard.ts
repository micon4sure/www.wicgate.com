import { redirect } from 'vike/abort';
import type { GuardAsync } from 'vike/types';
import { useAuthStore } from '../../stores/auth';

// Protect admin panel - require admin authentication
const guard: GuardAsync = async (_pageContext): Promise<void> => {
  // Only check on client side
  if (typeof window === 'undefined') return;

  const authStore = useAuthStore();

  // Check auth if not already done
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // Redirect unauthenticated users to admin login
  if (!authStore.isAuthenticated) {
    throw redirect('/admin-login');
  }

  // Redirect non-admins to user panel
  if (!authStore.isAdmin) {
    throw redirect('/user');
  }
};

export { guard };
