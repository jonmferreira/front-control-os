import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuth } from '@/composables/useAuth';
import type { AuthSession } from '@/services/auth';
import { authenticate } from '@/services/auth';

vi.mock('@/services/auth', async () => {
  const actual = await vi.importActual<typeof import('@/services/auth')>('@/services/auth');
  return {
    ...actual,
    authenticate: vi.fn()
  };
});

const mockedAuthenticate = vi.mocked(authenticate);

describe('useAuth', () => {
  const now = Date.now();
  const session: AuthSession = {
    token: 'token-123',
    refreshToken: undefined,
    expiresAt: new Date(now + 1000 * 60 * 60).toISOString(),
    profile: {
      id: 'user-1',
      name: 'Usuário Teste',
      email: 'user@test.com',
      role: 'tecnico'
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    mockedAuthenticate.mockResolvedValue({ ...session });
    localStorage.clear();
    useAuth().logout();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('salva sessão com tempo reduzido quando remember está desligado', async () => {
    const auth = useAuth();

    await auth.login({ identifier: 'user@test.com', password: '123' }, { remember: false });

    expect(auth.isAuthenticated.value).toBe(true);
    const storedSession = JSON.parse(localStorage.getItem('os-auth-session') ?? '{}');
    expect(storedSession.token).toBe('token-123');
    const expiresAt = new Date(storedSession.expiresAt).getTime();
    expect(expiresAt).toBeGreaterThan(now);
    expect(expiresAt).toBeLessThanOrEqual(now + 1000 * 60 * 20 + 1000);
  });

  it('valida perfis permitidos', async () => {
    const auth = useAuth();
    await auth.login({ identifier: 'user@test.com', password: '123' });

    expect(auth.hasRole('tecnico')).toBe(true);
    expect(auth.hasRole(['gerente', 'responsavel'])).toBe(false);
  });
});
