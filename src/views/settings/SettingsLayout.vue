<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-950 text-white">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),transparent_45%)]" />
    <div class="pointer-events-none absolute left-[-12%] top-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
    <div class="pointer-events-none absolute right-[-14%] top-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

    <div class="relative z-10">
      <SettingsHeader
        :title="headerTitle"
        :subtitle="headerSubtitle"
        :show-back="showBackButton"
        @back="navigateToMenu"
      >
        <template #actions>
          <Button icon="pi pi-question-circle" label="Central de ajuda" severity="secondary" text class="hidden md:flex" />
        </template>
      </SettingsHeader>

      <section class="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 text-sm lg:px-6">
        <Tag v-if="roleLabel" :value="roleLabel" icon="pi pi-user" severity="info" class="rounded-full" />
        <Tag v-if="sessionWindow" :value="`Sessão até ${sessionWindow}`" icon="pi pi-clock" severity="secondary" class="rounded-full" />
        <p class="text-xs text-slate-200">
          Painel base do console de OS com shell atualizado e sessão alinhada ao perfil.
        </p>
      </section>

      <main class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <section v-if="showMenu" class="lg:w-80">
          <SettingsSidebar
            :groups="menuGroups"
            :active-id="activeSectionId"
            :name="sidebarName"
            :email="sidebarEmail"
            :role-label="roleLabel"
            @select="handleSelect"
            @logout="openLogoutDialog"
          />
        </section>

        <section v-if="showContent" class="flex-1">
          <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </Transition>
          </RouterView>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { useDialog } from 'primevue/usedialog';
import { useRoute, useRouter } from 'vue-router';

import SettingsHeader from '@/components/settings/SettingsHeader.vue';
import SettingsSidebar from '@/components/settings/SettingsSidebar.vue';
import LogoutConfirmationDialog from '@/components/settings/LogoutConfirmationDialog.vue';
import { findMenuItemById, filterMenuByRole } from '@/data/settings-menu';
import { useMediaQuery } from '@/composables/useMediaQuery';
import { useProfileSettings } from '@/composables/useProfileSettings';
import { useAuth } from '@/composables/useAuth';
import { OS_APP_TITLE } from '@/config/env';
import { UserRole, UserRoleLabel } from '@/types/roles';

const route = useRoute();
const router = useRouter();
const dialog = useDialog();
const isDesktop = useMediaQuery('(min-width: 1024px)');
const profileQuery = useProfileSettings();
const auth = useAuth();

const menuGroups = computed(() => {
  const userRole = profileQuery.data.value?.role ?? auth.session?.value?.profile?.role;
  return filterMenuByRole(userRole);
});

const activeSectionId = computed(() => (route.params.section as string | undefined) ?? null);
const activeItem = computed(() => findMenuItemById(activeSectionId.value ?? undefined));

const showBackButton = computed(() => !isDesktop.value && route.name === 'os-section');
const showMenu = computed(() => isDesktop.value || route.name !== 'os-section');
const showContent = computed(() => isDesktop.value || route.name === 'os-section');

const headerTitle = computed(() => activeItem.value?.label ?? OS_APP_TITLE);
const headerSubtitle = computed(
  () => activeItem.value?.description ?? 'Centralize a operação de ordens de serviço e a configuração dos checklists.'
);

const roleLabel = computed(() => {
  const role = profileQuery.data.value?.role ?? auth.session?.value?.profile?.role;
  if (!role) return '';

  if (role === UserRole.ADMINISTRADOR) return UserRoleLabel[UserRole.ADMINISTRADOR];
  if (role === UserRole.ANALISTA) return UserRoleLabel[UserRole.ANALISTA];
  if (role === UserRole.TECNICO) return UserRoleLabel[UserRole.TECNICO];

  return '';
});

const sessionWindow = computed(() => {
  const expiresAt = auth.session?.value?.expiresAt;
  if (!expiresAt) return '';
  const expiryDate = new Date(expiresAt);
  if (Number.isNaN(expiryDate.getTime())) return '';
  return expiryDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
});

const sidebarName = computed(() => profileQuery.data.value?.name ?? auth.session?.value?.profile?.name ?? 'Carregando...');
const sidebarEmail = computed(() => profileQuery.data.value?.email ?? auth.session?.value?.profile?.email ?? '');

const handleSelect = (id: string) => {
  router.push({ name: 'os-section', params: { section: id } });
};

const navigateToMenu = () => {
  router.push({ name: 'os-home' });
};

const openLogoutDialog = () => {
  dialog.open(LogoutConfirmationDialog, {
    props: {
      header: 'Deseja sair?',
      modal: true,
      style: { width: '28rem' }
    },
    onClose: (event) => {
      if (event?.data?.confirmed) {
        console.info('Usuário realizou logout.');
        auth.logout();
        router.replace({ name: 'login' });
      }
    }
  });
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
