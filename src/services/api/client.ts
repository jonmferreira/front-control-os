import { OS_API_BASE_URL } from '@/config/env';
import { useAuth } from '@/composables/useAuth';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class SessionExpiredError extends Error {
  constructor(message = 'Sessão expirada') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

async function createFetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { getAuthToken, clearSession } = useAuth();
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !endpoint.includes('/auth/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${OS_API_BASE_URL}${endpoint}`;

  try {
    const response = await createFetchWithTimeout(url, {
      ...options,
      headers,
    });

    // Verificar se sessão expirou
    if (response.status === 401) {
      clearSession();
      throw new SessionExpiredError();
    }

    // Verificar erros HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        errorData?.message || `Erro HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    // Retornar resposta vazia para 204
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof SessionExpiredError || error instanceof ApiError) {
      throw error;
    }

    // Erro de rede ou timeout
    throw new ApiError(
      'Erro de conexão com o servidor',
      0,
      error
    );
  }
}
