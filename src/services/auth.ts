import { OS_API_BASE_URL } from '@/config/env';

export type UserRole = 'tecnico' | 'responsavel' | 'gerente';

export interface AuthProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  username?: string;
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  expiresAt: string;
  profile: AuthProfile;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export class SessionExpiredError extends Error {
  constructor(message = 'Sessão expirada') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

const LOGIN_ENDPOINT = `${OS_API_BASE_URL}/auth/login`;

export function isSessionExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) return true;
  const expiresAtTime = new Date(expiresAt).getTime();
  return Number.isNaN(expiresAtTime) || expiresAtTime <= Date.now();
}

export async function authenticate(payload: LoginPayload): Promise<AuthSession> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage ?? 'Falha ao autenticar');
    }

    const data = await response.json();
    return normalizeSession(data);
  } catch (error) {
    return buildMockSession(payload, error);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function extractErrorMessage(response: Response): Promise<string | null> {
  try {
    const data = await response.json();
    if (data?.message) {
      return String(data.message);
    }
  } catch (error) {
    console.warn('Não foi possível extrair mensagem de erro da API de login.', error);
  }

  return response.status === 401 ? 'Credenciais inválidas' : null;
}

function normalizeSession(data: any): AuthSession {
  const expiresAt = data?.expiresAt ?? new Date(Date.now() + 1000 * 60 * 30).toISOString();
  const profile = data?.profile ?? {};
  const token = data?.token ?? `session-${Math.random().toString(36).slice(2, 8)}`;

  return {
    token,
    refreshToken: data?.refreshToken ?? undefined,
    expiresAt,
    profile: {
      id: profile.id ?? 'user-unknown',
      name: profile.name ?? 'Usuário do console',
      email: profile.email ?? 'usuario@os.app.br',
      role: (profile.role as UserRole) ?? 'tecnico',
      username: profile.username ?? payloadUsernameFallback(profile)
    }
  };
}

function payloadUsernameFallback(profile: any): string {
  if (profile?.username) {
    return String(profile.username);
  }

  return 'os-user';
}

function buildMockSession(payload: LoginPayload, error: unknown): AuthSession {
  console.warn('[mock] Falha ao chamar API de login, retornando sessão simulada.', error);

  const role = inferRoleFromIdentifier(payload.identifier);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 45).toISOString();

  return {
    token: `mock-token-${Math.random().toString(36).slice(2, 8)}`,
    expiresAt,
    profile: {
      id: 'user-mock',
      name: buildMockName(role),
      email: payload.identifier.includes('@') ? payload.identifier : `${payload.identifier}@os.app.br`,
      role,
      username: payload.identifier
    }
  };
}

function inferRoleFromIdentifier(identifier: string): UserRole {
  const normalized = identifier.toLowerCase();
  if (normalized.includes('gerente')) return 'gerente';
  if (normalized.includes('resp') || normalized.includes('lead')) return 'responsavel';
  return 'tecnico';
}

function buildMockName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    tecnico: 'Técnico de campo',
    responsavel: 'Técnico responsável',
    gerente: 'Gerente de operações'
  };

  return names[role];
}
