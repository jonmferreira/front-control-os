import { OS_API_BASE_URL } from '@/config/env';

// ============================================
// API Client Simples - SEM abstrações desnecessárias
// ============================================

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function api<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  if (authToken && !endpoint.includes('/auth/login')) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${OS_API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      setAuthToken(null);
      localStorage.removeItem('os-auth-session');
      window.location.href = '/login';
      throw new Error('Sessão expirada');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ============================================
// Funções helper para requests comuns
// ============================================

export const GET = <T>(endpoint: string) =>
  api<T>(endpoint, { method: 'GET' });

export const POST = <T>(endpoint: string, data?: unknown) =>
  api<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

export const PUT = <T>(endpoint: string, data?: unknown) =>
  api<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

export const DELETE = <T>(endpoint: string) =>
  api<T>(endpoint, { method: 'DELETE' });
