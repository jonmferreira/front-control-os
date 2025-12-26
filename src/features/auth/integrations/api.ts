import { POST } from '@/lib/api';
import { setAuthToken } from '@/lib/api';

// ============================================
// TIPOS
// ============================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Technician';
  };
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  expiresAt: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'gerente' | 'tecnico' | 'responsavel';
  };
}

// ============================================
// STORAGE
// ============================================

const STORAGE_KEY = 'os-auth-session';

export function saveSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  setAuthToken(session.token);
}

export function loadSession(): AuthSession | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as AuthSession;

    // Verifica se expirou
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    setAuthToken(session.token);
    return session;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
  setAuthToken(null);
}

// ============================================
// API FUNCTIONS
// ============================================

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const response = await POST<LoginResponse>('/auth/login', credentials);

  // Mapear role do backend para frontend
  const roleMap: Record<string, 'gerente' | 'tecnico' | 'responsavel'> = {
    Admin: 'gerente',
    Technician: 'tecnico',
  };

  const session: AuthSession = {
    token: response.accessToken,
    refreshToken: response.refreshToken,
    expiresAt: Date.now() + response.expiresIn * 60 * 1000,
    user: {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: roleMap[response.user.role] || 'tecnico',
    },
  };

  saveSession(session);
  return session;
}

export async function logout(): Promise<void> {
  clearSession();
}

export function isAuthenticated(): boolean {
  const session = loadSession();
  return session !== null;
}

export function getCurrentUser(): AuthSession['user'] | null {
  const session = loadSession();
  return session?.user || null;
}
