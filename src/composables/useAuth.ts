import type { LoginPayload } from '@/services/auth';
import { authenticate } from '@/services/auth';
import { useAuthStore } from '@/stores/auth';

export function useAuth() {
  const store = useAuthStore();

  const login = async (payload: LoginPayload, options?: { remember?: boolean }) => {
    const session = await authenticate(payload);
    const adjustedSession =
      options?.remember === false
        ? {
            ...session,
            expiresAt: Date.now() + 1000 * 60 * 20 // 20 minutos
          }
        : session;

    console.log('[useAuth] Session ajustada:', adjustedSession);
    store.setSession(adjustedSession);
    return adjustedSession;
  };

  const logout = () => {
    store.clearSession();
  };

  return {
    session: store.session,
    isAuthenticated: store.isAuthenticated,
    isExpired: store.isExpired,
    login,
    logout,
    hasRole: store.hasRole
  };
}
