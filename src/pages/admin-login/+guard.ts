import { redirect } from 'vike/abort';
import type { GuardAsync } from 'vike/types';
import { useAuthStore } from '../../stores/auth';

// Redirect authenticated admins to admin panel
const guard: GuardAsync = async (_pageContext): Promise<void> => {
  // Only check on client side
  if (typeof window === 'undefined') return;

  const authStore = useAuthStore();

  // Check auth if not already done
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // Redirect authenticated admins
  if (authStore.isAuthenticated && authStore.isAdmin) {
    throw redirect('/admin');
  }
};

export { guard };
