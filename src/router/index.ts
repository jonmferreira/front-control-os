import { createRouter, createWebHistory } from 'vue-router';

import SettingsLayout from '@/views/settings/SettingsLayout.vue';
import SettingsOverview from '@/views/settings/SettingsOverview.vue';
import SettingsSectionView from '@/views/settings/SettingsSectionView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import { DEFAULT_SECTION, isValidSection } from '@/data/settings-menu';
import { useAuth } from '@/composables/useAuth';
import type { UserRole } from '@/services/auth';

const SECTION_ROLE_MAP: Record<string, UserRole[]> = {
  'painel-os': ['tecnico', 'responsavel', 'gerente'],
  checklists: ['responsavel', 'gerente'],
  equipe: ['responsavel', 'gerente'],
  credenciais: ['responsavel', 'gerente'],
  alertas: ['tecnico', 'responsavel', 'gerente'],
  aparencia: ['tecnico', 'responsavel', 'gerente']
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
        allowedRoles: ['tecnico', 'responsavel', 'gerente']
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
  if (to.name === 'os-section' && !isValidSection(to.params.section as string | undefined)) {
    return { name: 'os-section', params: { section: DEFAULT_SECTION } };
  }

  const auth = useAuth();
  const requiresAuth = Boolean(to.meta.requiresAuth);
  const redirectPath =
    typeof to.query.redirect === 'string' && to.query.redirect.startsWith('/') ? to.query.redirect : null;
  const shouldRedirectToLogin = requiresAuth && (!auth.isAuthenticated.value || auth.isExpired.value);

  if (to.name === 'login' && auth.isAuthenticated.value && !auth.isExpired.value) {
    return redirectPath ?? { name: 'os-home' };
  }

  if (shouldRedirectToLogin) {
    auth.logout();
    return {
      name: 'login',
      query: { redirect: to.fullPath, reason: auth.isExpired.value ? 'expired' : 'unauthorized' }
    };
  }

  if (to.meta.allowedRoles && !auth.hasRole(to.meta.allowedRoles)) {
    return { name: 'os-home', query: { reason: 'forbidden' } };
  }

  if (to.name === 'os-section') {
    const sectionRoles = SECTION_ROLE_MAP[to.params.section as string] ?? SECTION_ROLE_MAP[DEFAULT_SECTION];
    if (sectionRoles && !auth.hasRole(sectionRoles)) {
      return { name: 'os-home', query: { reason: 'forbidden' } };
    }
  }

  return true;
});

export default router;
