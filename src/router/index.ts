import { createRouter, createWebHistory } from 'vue-router';

import SettingsLayout from '@/views/settings/SettingsLayout.vue';
import SettingsOverview from '@/views/settings/SettingsOverview.vue';
import SettingsSectionView from '@/views/settings/SettingsSectionView.vue';
import LoginView from '@/modules/auth/components/LoginView.vue';
import { DEFAULT_SECTION, isValidSection } from '@/data/settings-menu';
import { useAuthStore } from '@/stores/auth';
import { UserRole } from '@/types/roles';
import type { UserRole as UserRoleType } from '@/services/auth';

const SECTION_ROLE_MAP: Record<string, UserRoleType[]> = {
  'painel-os': [UserRole.TECNICO, UserRole.ANALISTA, UserRole.ADMINISTRADOR],
  'meus-checklists': [UserRole.TECNICO],
  checklists: [UserRole.ANALISTA, UserRole.ADMINISTRADOR],
  equipe: [UserRole.ANALISTA, UserRole.ADMINISTRADOR],
  credenciais: [UserRole.ANALISTA, UserRole.ADMINISTRADOR],
  alertas: [UserRole.TECNICO, UserRole.ANALISTA, UserRole.ADMINISTRADOR],
  aparencia: [UserRole.TECNICO, UserRole.ANALISTA, UserRole.ADMINISTRADOR]
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/os'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/os',
      component: SettingsLayout,
      meta: {
        requiresAuth: true,
        allowedRoles: [UserRole.TECNICO, UserRole.ANALISTA, UserRole.ADMINISTRADOR]
      },
      children: [
        {
          path: '',
          name: 'os-home',
          component: SettingsOverview
        },
        {
          path: ':section',
          name: 'os-section',
          component: SettingsSectionView,
          props: (route) => ({ sectionId: route.params.section as string })
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/os'
    }
  ]
});

router.beforeEach((to) => {
  console.log('[Router Guard] Navegando para:', to.path, to.name);

  if (to.name === 'os-section' && !isValidSection(to.params.section as string | undefined)) {
    return { name: 'os-section', params: { section: DEFAULT_SECTION } };
  }

  const authStore = useAuthStore();
  console.log('[Router Guard] isAuthenticated:', authStore.isAuthenticated);

  const requiresAuth = Boolean(to.meta.requiresAuth);
  const redirectPath =
    typeof to.query.redirect === 'string' && to.query.redirect.startsWith('/') ? to.query.redirect : null;

  // Se está indo para login e já está autenticado, redireciona
  if (to.name === 'login' && authStore.isAuthenticated) {
    console.log('[Router Guard] Já autenticado, redirecionando para:', redirectPath ?? '/os');
    return redirectPath ?? { name: 'os-home' };
  }

  // Se precisa de auth e não está autenticado, vai pro login (SEM verificar expiração)
  if (requiresAuth && !authStore.isAuthenticated) {
    console.log('[Router Guard] Não autenticado, redirecionando para login');
    return {
      name: 'login',
      query: { redirect: to.fullPath, reason: 'unauthorized' }
    };
  }

  if (to.meta.allowedRoles && !authStore.hasRole(to.meta.allowedRoles)) {
    return { name: 'os-home', query: { reason: 'forbidden' } };
  }

  if (to.name === 'os-section') {
    const sectionRoles = SECTION_ROLE_MAP[to.params.section as string] ?? SECTION_ROLE_MAP[DEFAULT_SECTION];
    if (sectionRoles && !authStore.hasRole(sectionRoles)) {
      return { name: 'os-home', query: { reason: 'forbidden' } };
    }
  }

  return true;
});

export default router;
