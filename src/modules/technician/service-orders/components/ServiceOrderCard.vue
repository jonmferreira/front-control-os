<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            OS #{{ order.id }}
          </p>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">{{ order.title }}</h3>
        </div>
        <Tag :value="getStatusLabel(order.status)" :severity="getStatusSeverity(order.status)" />
      </div>
    </template>

    <template #content>
      <div class="space-y-4">
        <div v-if="order.description" class="space-y-1">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Descrição
          </p>
          <p class="text-sm text-slate-700 dark:text-slate-200">{{ order.description }}</p>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div v-if="order.location" class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Local
            </p>
            <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <i class="pi pi-map-marker"></i>
              <span>{{ order.location }}</span>
            </div>
          </div>

          <div v-if="order.technicianName" class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Técnico
            </p>
            <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <i class="pi pi-user"></i>
              <span>{{ order.technicianName }}</span>
            </div>
          </div>

          <div class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Prioridade
            </p>
            <Tag :value="getPriorityLabel(order.priority)" :severity="getPrioritySeverity(order.priority)" />
          </div>

          <div v-if="order.dueDate" class="space-y-1">
            <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Prazo
            </p>
            <div class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <i class="pi pi-calendar"></i>
              <span>{{ formatDate(order.dueDate) }}</span>
              <Tag v-if="isOverdue(order)" value="Atrasada" severity="danger" />
            </div>
          </div>
        </div>

        <Divider />

        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Progresso do Checklist
          </p>
          <ProgressBar :value="checklistProgress" />
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ order.checklistsCompleted }} de {{ order.checklistsTotal }} itens completados
          </p>
        </div>

        <Divider />

        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Informações
          </p>
          <div class="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p>Criado em: {{ formatDate(order.createdAt) }}</p>
            <p>Atualizado em: {{ formatRelativeDate(order.updatedAt) }}</p>
          </div>
        </div>

        <div v-if="showActions" class="flex flex-wrap gap-2 pt-4">
          <Button
            v-if="order.status === ServiceOrderStatus.PENDING"
            icon="pi pi-play"
            label="Iniciar OS"
            @click="$emit('start', order.id)"
          />
          <Button
            v-if="order.status === ServiceOrderStatus.IN_PROGRESS"
            icon="pi pi-check"
            label="Finalizar OS"
            severity="success"
            :disabled="!canComplete"
            @click="$emit('complete', order.id)"
          />
          <Button
            icon="pi pi-list-check"
            label="Ver Checklist"
            outlined
            @click="$emit('view-checklist', order.id)"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ProgressBar from 'primevue/progressbar';
import type { ServiceOrder } from '../types';
import { ServiceOrderStatus } from '../types';
import {
  getStatusLabel,
  getStatusSeverity,
  getPriorityLabel,
  getPrioritySeverity,
  formatDate,
  formatRelativeDate,
  isOverdue
} from '../helpers';

interface Props {
  order: ServiceOrder;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true
});

defineEmits<{
  start: [orderId: string];
  complete: [orderId: string];
  'view-checklist': [orderId: string];
}>();

const checklistProgress = computed(() => {
  if (props.order.checklistsTotal === 0) return 0;
  return Math.round((props.order.checklistsCompleted / props.order.checklistsTotal) * 100);
});

const canComplete = computed(() => {
  return props.order.checklistsCompleted === props.order.checklistsTotal;
});
</script>
