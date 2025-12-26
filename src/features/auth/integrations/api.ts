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
  expiresAt: string; // ISO 8601 date string
  expiresIn: number; // Segundos até expiração
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

    console.log('[loadSession] Session do localStorage:', session);
    console.log('[loadSession] expiresAt:', session.expiresAt, 'Type:', typeof session.expiresAt);
    console.log('[loadSession] Date.now():', Date.now());

    // Verifica se expiresAt é válido
    if (!session.expiresAt || isNaN(session.expiresAt)) {
      console.warn('[loadSession] expiresAt inválido, limpando sessão');
      clearSession();
      return null;
    }

    // Verifica se expirou
    if (Date.now() > session.expiresAt) {
      console.log('[loadSession] Sessão expirada, limpando...');
      clearSession();
      return null;
    }

    setAuthToken(session.token);
    return session;
  } catch (error) {
    console.error('[loadSession] Erro ao carregar sessão:', error);
    clearSession();
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
  console.log('[LOGIN] Iniciando login...');

  try {
    const response = await POST<LoginResponse>('/auth/login', credentials);
    console.log('[LOGIN] ✅ Response recebida:', JSON.stringify(response, null, 2));
    console.log('[LOGIN] expiresIn:', response.expiresIn);
    console.log('[LOGIN] Type of expiresIn:', typeof response.expiresIn);

    // Mapear role do backend para frontend
    const roleMap: Record<string, 'gerente' | 'tecnico' | 'responsavel'> = {
      Admin: 'gerente',
      Technician: 'tecnico',
    };

    // Usar timestamp fixo temporariamente para debug
    const expiresAtDebug = Date.now() + (60 * 60 * 1000); // 1 hora fixa
    console.log('[LOGIN] expiresAt calculado:', expiresAtDebug);

    const session: AuthSession = {
      token: response.accessToken,
      refreshToken: response.refreshToken,
      expiresAt: expiresAtDebug, // TEMPORÁRIO: usando valor fixo
      user: {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: roleMap[response.user.role] || 'tecnico',
      },
    };

    console.log('[LOGIN] ✅ Session criada:', JSON.stringify(session, null, 2));
    console.log('[LOGIN] Salvando session no localStorage...');
    saveSession(session);
    console.log('[LOGIN] ✅ Session salva com sucesso!');
    return session;
  } catch (error) {
    console.error('[LOGIN] ❌ ERRO:', error);
    throw error;
  }
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
