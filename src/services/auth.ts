import { apiRequest } from './api/client';
import type { LoginResponse } from './types/auth.types';

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
  expiresAt: number; // timestamp em ms
  profile: AuthProfile;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export { SessionExpiredError } from './api/client';

export function mapRoleToFrontend(backendRole: 'Admin' | 'Technician'): UserRole {
  switch (backendRole) {
    case 'Admin':
      return 'gerente';
    case 'Technician':
      return 'tecnico';
    default:
      return 'tecnico';
  }
}

export function isSessionExpired(expiresAt?: number | null): boolean {
  if (!expiresAt) return true;
  return expiresAt <= Date.now();
}

export async function authenticate(payload: LoginPayload): Promise<AuthSession> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.identifier,
      password: payload.password,
    }),
  });

  const mappedRole = mapRoleToFrontend(response.user.role);
  // expiresIn já vem em SEGUNDOS da API, não precisa multiplicar por 60
  const expiresAt = Date.now() + response.expiresIn * 1000; // converter segundos para ms

  return {
    token: response.accessToken,
    refreshToken: response.refreshToken,
    expiresAt,
    profile: {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: mappedRole,
      username: response.user.email.split('@')[0],
    },
  };
}

