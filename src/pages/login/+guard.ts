import { redirect } from 'vike/abort';
import type { GuardAsync } from 'vike/types';
import { useAuthStore } from '../../stores/auth';

// Redirect authenticated users to their panel
const guard: GuardAsync = async (_pageContext): Promise<void> => {
  // Only check on client side
  if (typeof window === 'undefined') return;

  const authStore = useAuthStore();

  // Check auth if not already done
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth();
  }

  // Redirect authenticated users
  if (authStore.isAuthenticated && authStore.isUser) {
    throw redirect('/user');
  }
};

export { guard };
