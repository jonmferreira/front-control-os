import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import type { Router } from 'vue-router';
import type { UserRole } from '@/services/auth';

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>();
  return {
    ...actual,
    createWebHistory: actual.createMemoryHistory
  };
});

const authState = {
  isAuthenticated: ref(false),
  isExpired: ref(false),
  userRole: ref<UserRole>('tecnico'),
  hasRole: vi.fn((roles?: UserRole | UserRole[]) => {
    if (!roles) return true;
    const required = Array.isArray(roles) ? roles : [roles];
    return required.includes(authState.userRole.value);
  }),
  login: vi.fn(),
  logout: vi.fn()
};

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => authState
}));

let router: Router;

beforeAll(async () => {
  router = (await import('@/router')).default;
  await router.push('/login');
  await router.isReady();
});

beforeEach(async () => {
  authState.isAuthenticated.value = false;
  authState.isExpired.value = false;
  authState.userRole.value = 'tecnico';
  await router.replace('/login');
  await router.isReady();
});

describe('router navigation guards', () => {
  it('redirects to login when accessing protected routes without session', async () => {
    await router.push('/os');
    expect(router.currentRoute.value.name).toBe('login');
    expect(router.currentRoute.value.query.redirect).toBe('/os');
  });

  it('blocks sections when role is not allowed', async () => {
    authState.isAuthenticated.value = true;
    authState.userRole.value = 'tecnico';

    await router.push('/os/checklists');

    expect(router.currentRoute.value.name).toBe('os-home');
    expect(router.currentRoute.value.query.reason).toBe('forbidden');
  });

  it('allows navigation when authenticated and authorized', async () => {
    authState.isAuthenticated.value = true;
    authState.userRole.value = 'gerente';

    await router.push('/os');

    expect(router.currentRoute.value.name).toBe('os-home');
  });
});
