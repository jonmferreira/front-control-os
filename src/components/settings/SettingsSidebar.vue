<template>
  <aside class="flex h-full flex-col gap-6">
    <Card class="border border-slate-200/60 bg-white/80 dark:border-slate-800/60 dark:bg-slate-900/60">
      <template #title>
        <div class="flex items-center gap-3">
          <Avatar :label="initials" shape="circle" class="bg-primary-100 text-primary-700" />
          <div class="space-y-1">
            <p class="text-base font-semibold text-slate-800 dark:text-slate-100">{{ name }}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ email }}</p>
            <Tag v-if="roleLabel" :value="roleLabel" severity="info" rounded />
          </div>
        </div>
      </template>
      <template #content>
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Orquestre as ordens de serviço e padronize os checklists para toda a equipe.
        </p>
      </template>
    </Card>

    <div class="flex-1 space-y-5">
      <Panel v-for="group in groups" :key="group.id" toggleable :collapsed="false" class="border-none bg-transparent shadow-none">
        <template #header>
          <span class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ group.label }}</span>
        </template>
        <div class="flex flex-col gap-2">
          <Button
            v-for="item in group.items"
            :key="item.id"
            class="group flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left"
            :severity="item.id === activeId ? 'primary' : 'secondary'"
            :outlined="item.id !== activeId"
            :text="item.id !== activeId"
            @click="emit('select', item.id)"
          >
            <span
              :class="[
                'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-lg transition-colors',
                item.id === activeId
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-400/20 dark:text-primary-200'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
              ]"
            >
              <i :class="['pi', item.icon]" aria-hidden="true"></i>
            </span>
            <span class="flex flex-col">
              <span :class="['font-semibold', item.id === activeId ? 'text-primary-700 dark:text-primary-200' : 'text-slate-700 dark:text-slate-200']">{{ item.label }}</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ item.description }}</span>
            </span>
          </Button>
        </div>
      </Panel>
    </div>

    <Button severity="danger" outlined icon="pi pi-sign-out" label="Sair" @click="emit('logout')" class="justify-start" />
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Panel from 'primevue/panel';
import Tag from 'primevue/tag';

import type { SettingsMenuGroup } from '@/data/settings-menu';

const props = defineProps<{
  groups: SettingsMenuGroup[];
  activeId?: string | null;
  name: string;
  email: string;
  roleLabel?: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'logout'): void;
}>();

const initials = computed(() => {
  return props.name
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join('');
});
</script>
