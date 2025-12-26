<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-100/70 dark:bg-slate-950">
    <div class="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary-500/10 via-transparent to-transparent dark:from-cyan-500/10" />
    <div class="pointer-events-none absolute left-[-16%] top-12 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
    <div class="pointer-events-none absolute right-[-20%] top-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

    <div class="relative z-10">
      <SettingsHeader
        :title="headerTitle"
        :subtitle="headerSubtitle"
        :show-back="showBackButton"
        :is-dark="isDark"
        @back="navigateToMenu"
        @toggle-theme="handleThemeToggle"
      >
        <template #actions>
          <Button icon="pi pi-question-circle" label="Central de ajuda" severity="secondary" text class="hidden md:flex" />
        </template>
      </SettingsHeader>

      <section class="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-3 px-4 text-sm lg:px-6">
        <Tag v-if="roleLabel" :value="roleLabel" icon="pi pi-user" severity="info" class="rounded-full" />
        <Tag v-if="sessionWindow" :value="`Sessão até ${sessionWindow}`" icon="pi pi-clock" severity="secondary" class="rounded-full" />
        <p class="text-xs text-slate-600 dark:text-slate-300">
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
import { settingsMenuGroups, findMenuItemById } from '@/data/settings-menu';
import { useMediaQuery } from '@/composables/useMediaQuery';
import { useTheme } from '@/composables/useTheme';
import { useProfileSettings } from '@/composables/useProfileSettings';
import { useAuth } from '@/composables/useAuth';
import { OS_APP_TITLE } from '@/config/env';

const route = useRoute();
const router = useRouter();
const dialog = useDialog();
const isDesktop = useMediaQuery('(min-width: 1024px)');
const { isDark, setTheme } = useTheme();
const profileQuery = useProfileSettings();
const auth = useAuth();

const menuGroups = settingsMenuGroups;

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
  const role = profileQuery.data.value?.role ?? auth.session.value.profile?.role;
  if (role === 'gerente') return 'Gerente';
  if (role === 'responsavel') return 'Técnico responsável';
  if (role === 'tecnico') return 'Técnico';
  return '';
});

const sessionWindow = computed(() => {
  const expiresAt = auth.session.value.expiresAt;
  if (!expiresAt) return '';
  const expiryDate = new Date(expiresAt);
  if (Number.isNaN(expiryDate.getTime())) return '';
  return expiryDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
});

const sidebarName = computed(() => profileQuery.data.value?.name ?? auth.session.value.profile?.name ?? 'Carregando...');
const sidebarEmail = computed(() => profileQuery.data.value?.email ?? auth.session.value.profile?.email ?? '');

const handleSelect = (id: string) => {
  router.push({ name: 'os-section', params: { section: id } });
};

const navigateToMenu = () => {
  router.push({ name: 'os-home' });
};

const handleThemeToggle = (value: boolean) => {
  setTheme(value ? 'dark' : 'light');
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
