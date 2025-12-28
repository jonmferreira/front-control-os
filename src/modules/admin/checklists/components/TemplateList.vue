<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-3 items-center justify-between">
      <div class="flex-1">
        <InputText
          v-model="searchQuery"
          placeholder="Buscar templates..."
          class="w-full max-w-md"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <Dropdown
          v-model="selectedStatus"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Filtrar por status"
          class="w-40"
        />
        <Button
          icon="pi pi-plus"
          label="Novo Template"
          @click="$emit('create')"
        />
      </div>
    </div>

    <div v-if="loading" class="space-y-2">
      <Skeleton height="5rem" border-radius="12px" />
      <Skeleton height="5rem" border-radius="12px" />
      <Skeleton height="5rem" border-radius="12px" />
    </div>

    <Message v-else-if="error" severity="error" :closable="false">
      {{ error }}
    </Message>

    <Message v-else-if="!filteredTemplates.length" severity="info" :closable="false">
      Nenhum template encontrado.
    </Message>

    <div v-else class="space-y-3">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="rounded-lg border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer"
        @click="$emit('select', template)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-slate-800 dark:text-slate-100">{{ template.title }}</h3>
              <Tag
                :value="template.isPublished ? 'Publicado' : 'Rascunho'"
                :severity="template.isPublished ? 'success' : 'secondary'"
              />
            </div>
            <div class="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-1">
                <i class="pi pi-user"></i>
                {{ template.publishedBy }}
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-list"></i>
                {{ template.items.length }} itens
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-clock"></i>
                {{ formatLastUpdate(template.updatedAt) }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <Button
              icon="pi pi-eye"
              size="small"
              outlined
              @click.stop="$emit('select', template)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import type { ChecklistTemplate } from '../types';
import { searchTemplates, filterByStatus, formatLastUpdate } from '../helpers';

interface Props {
  templates: ChecklistTemplate[];
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
});

defineEmits<{
  select: [template: ChecklistTemplate];
  create: [];
}>();

const searchQuery = ref('');
const selectedStatus = ref<boolean | null>(null);

const statusOptions = [
  { label: 'Todos', value: null },
  { label: 'Publicados', value: true },
  { label: 'Rascunhos', value: false }
];

const filteredTemplates = computed(() => {
  let result = props.templates;
  result = searchTemplates(result, searchQuery.value);
  result = filterByStatus(result, selectedStatus.value);
  return result;
});
</script>
