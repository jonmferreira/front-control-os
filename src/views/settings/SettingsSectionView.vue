<template>
  <component :is="sectionComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import AppearanceSettingsView from './sections/AppearanceSettingsView.vue';
import NotificationsSettingsView from './sections/NotificationsSettingsView.vue';
import ProfileSettingsView from './sections/ProfileSettingsView.vue';
import SecuritySettingsView from './sections/SecuritySettingsView.vue';

// Novos módulos
import TechnicianView from '@/modules/technician/service-orders/TechnicianView.vue';
import AnalyticsView from '@/modules/analytics/service-orders/AnalyticsView.vue';
import AdminView from '@/modules/admin/checklists/AdminView.vue';

const props = defineProps<{
  sectionId: string;
}>();

const sectionComponent = computed(() => {
  const mapping: Record<string, object> = {
    'painel-os': AnalyticsView,
    'meus-checklists': TechnicianView,
    checklists: AdminView,
    equipe: ProfileSettingsView,
    credenciais: SecuritySettingsView,
    alertas: NotificationsSettingsView,
    aparencia: AppearanceSettingsView
  };

  return mapping[props.sectionId] ?? TechnicianView;
});
</script>
