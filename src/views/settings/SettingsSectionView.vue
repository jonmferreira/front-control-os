<template>
  <component :is="sectionComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import ServiceOrdersOverview from './sections/ServiceOrdersOverview.vue';
import AppearanceSettingsView from './sections/AppearanceSettingsView.vue';
import ChecklistManagementView from './sections/ChecklistManagementView.vue';
import MyChecklistsView from './sections/MyChecklistsView.vue';
import NotificationsSettingsView from './sections/NotificationsSettingsView.vue';
import ProfileSettingsView from './sections/ProfileSettingsView.vue';
import SecuritySettingsView from './sections/SecuritySettingsView.vue';

const props = defineProps<{
  sectionId: string;
}>();

const sectionComponent = computed(() => {
  const mapping: Record<string, object> = {
    'painel-os': ServiceOrdersOverview,
    'meus-checklists': MyChecklistsView,
    checklists: ChecklistManagementView,
    equipe: ProfileSettingsView,
    credenciais: SecuritySettingsView,
    alertas: NotificationsSettingsView,
    aparencia: AppearanceSettingsView
  };

  return mapping[props.sectionId] ?? ServiceOrdersOverview;
});
</script>
