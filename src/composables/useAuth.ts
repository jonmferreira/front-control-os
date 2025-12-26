import { computed, reactive } from 'vue';

import type { AuthProfile, AuthSession, LoginPayload, UserRole } from '@/services/auth';
import { authenticate, isSessionExpired } from '@/services/auth';

interface SessionState {
  token: string | null;
  refreshToken: string | null;
  profile: AuthProfile | null;
  expiresAt: string | null;
}

const STORAGE_KEY = 'os-auth-session';

const state = reactive<SessionState>(loadInitialState());

function loadInitialState(): SessionState {
  if (typeof window === 'undefined') {
    return { token: null, refreshToken: null, profile: null, expiresAt: null };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { token: null, refreshToken: null, profile: null, expiresAt: null };
  }

  try {
    const parsed = JSON.parse(stored) as SessionState;
    if (isSessionExpired(parsed.expiresAt)) {
      clearPersistedSession();
      return { token: null, refreshToken: null, profile: null, expiresAt: null };
    }
    return parsed;
  } catch (error) {
    console.warn('Não foi possível restaurar a sessão do usuário.', error);
    clearPersistedSession();
    return { token: null, refreshToken: null, profile: null, expiresAt: null };
  }
}

function persistSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearPersistedSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

function setSession(session: AuthSession) {
  state.token = session.token;
  state.refreshToken = session.refreshToken ?? null;
  state.profile = session.profile;
  state.expiresAt = session.expiresAt;
  persistSession();
}

function resetSession() {
  state.token = null;
  state.refreshToken = null;
  state.profile = null;
  state.expiresAt = null;
  clearPersistedSession();
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(state.token && state.profile && !isSessionExpired(state.expiresAt)));
  const isExpired = computed(() => isSessionExpired(state.expiresAt));

  const session = computed(() => ({
    token: state.token,
    refreshToken: state.refreshToken,
    profile: state.profile,
    expiresAt: state.expiresAt
  }));

  const hasRole = (roles?: UserRole | UserRole[]) => {
    if (!roles) return true;
    const required = Array.isArray(roles) ? roles : [roles];
    return required.includes(state.profile?.role ?? 'tecnico');
  };

  const login = async (payload: LoginPayload, options?: { remember?: boolean }) => {
    const session = await authenticate(payload);
    const adjustedSession =
      options?.remember === false
        ? {
            ...session,
            expiresAt: new Date(Date.now() + 1000 * 60 * 20).toISOString()
          }
        : session;

    setSession(adjustedSession);
    return adjustedSession;
  };

  const logout = () => {
    resetSession();
  };

  return {
    session,
    isAuthenticated,
    isExpired,
    login,
    logout,
    hasRole
  };
}
