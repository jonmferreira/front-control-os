import { computed } from 'vue';
import { loadSession, clearSession, type AuthSession } from '../integrations/api';

/**
 * Composable simples para autenticação
 * Baseado nas funções de integração da feature auth
 */
export function useAuth() {
  const session = loadSession();

  return {
    isAuthenticated: computed(() => session !== null),
    isExpired: computed(() => {
      if (!session) return true;
      return Date.now() > session.expiresAt;
    }),
    user: computed(() => session?.user || null),
    hasRole: (roles: string | string[]) => {
      if (!session) return false;
      const allowedRoles = Array.isArray(roles) ? roles : [roles];
      return allowedRoles.includes(session.user.role);
    },
    logout: clearSession,
  };
}
