import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { AuthProfile, AuthSession, UserRole } from '@/services/auth';

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const token = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const profile = ref<AuthProfile | null>(null);
    const expiresAt = ref<number | null>(null);

    // Getters
    const isAuthenticated = computed(() => Boolean(token.value && profile.value));

    const isExpired = computed(() => {
      if (!expiresAt.value) return false;
      return Date.now() >= expiresAt.value;
    });

    const session = computed<AuthSession | null>(() => {
      if (!token.value || !profile.value) return null;
      return {
        token: token.value,
        refreshToken: refreshToken.value ?? undefined,
        profile: profile.value,
        expiresAt: expiresAt.value ?? 0
      };
    });

    // Actions
    function setSession(newSession: AuthSession) {
      token.value = newSession.token;
      refreshToken.value = newSession.refreshToken ?? null;
      profile.value = newSession.profile;
      expiresAt.value = newSession.expiresAt;
    }

    function clearSession() {
      token.value = null;
      refreshToken.value = null;
      profile.value = null;
      expiresAt.value = null;
    }

    function hasRole(roles?: UserRole | UserRole[] | string | string[]): boolean {
      if (!roles) return true;
      if (!profile.value?.role) return false;

      const required = Array.isArray(roles) ? roles : [roles];
      const userRole = profile.value.role as string;

      return required.some(r => {
        const roleStr = typeof r === 'string' ? r : r;
        return roleStr === userRole;
      });
    }

    return {
      // State
      token,
      refreshToken,
      profile,
      expiresAt,
      // Getters
      isAuthenticated,
      isExpired,
      session,
      // Actions
      setSession,
      clearSession,
      hasRole
    };
  },
  {
    persist: {
      key: 'os-auth-session',
      storage: localStorage
    }
  }
);
