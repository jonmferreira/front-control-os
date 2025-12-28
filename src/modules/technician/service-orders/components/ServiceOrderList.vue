<template>
  <div class="space-y-4">
    <div v-if="loading" class="space-y-2">
      <Skeleton height="4rem" border-radius="12px" />
      <Skeleton height="4rem" border-radius="12px" />
      <Skeleton height="4rem" border-radius="12px" />
    </div>

    <Message v-else-if="error" severity="error" :closable="false">
      {{ error }}
    </Message>

    <Message v-else-if="!orders.length" severity="info" :closable="false">
      Nenhuma ordem de serviço encontrada.
    </Message>

    <div v-else class="space-y-3">
      <div
        v-for="order in sortedOrders"
        :key="order.id"
        class="rounded-lg border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
        @click="$emit('select', order)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-slate-800 dark:text-slate-100">{{ order.title }}</h3>
              <Tag :value="getStatusLabel(order.status)" :severity="getStatusSeverity(order.status)" />
              <Tag :value="getPriorityLabel(order.priority)" :severity="getPrioritySeverity(order.priority)" />
            </div>
            <p v-if="order.description" class="text-sm text-slate-600 dark:text-slate-300 mb-2">
              {{ order.description }}
            </p>
            <div class="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span v-if="order.location" class="flex items-center gap-1">
                <i class="pi pi-map-marker"></i>
                {{ order.location }}
              </span>
              <span v-if="order.dueDate" class="flex items-center gap-1">
                <i class="pi pi-calendar"></i>
                {{ formatDate(order.dueDate) }}
              </span>
              <span class="flex items-center gap-1">
                <i class="pi pi-list-check"></i>
                {{ order.checklistsCompleted }}/{{ order.checklistsTotal }} itens
              </span>
            </div>
          </div>
          <Button
            v-if="order.status === ServiceOrderStatus.PENDING"
            icon="pi pi-play"
            label="Iniciar"
            size="small"
            @click.stop="$emit('start', order.id)"
          />
          <Button
            v-else-if="order.status === ServiceOrderStatus.IN_PROGRESS"
            icon="pi pi-arrow-right"
            label="Continuar"
            size="small"
            severity="info"
            @click.stop="$emit('select', order)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import type { ServiceOrder } from '../types';
import { ServiceOrderStatus } from '../types';
import {
  sortServiceOrders,
  getStatusLabel,
  getStatusSeverity,
  getPriorityLabel,
  getPrioritySeverity,
  formatDate
} from '../helpers';

interface Props {
  orders: ServiceOrder[];
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
});

defineEmits<{
  select: [order: ServiceOrder];
  start: [orderId: string];
}>();

const sortedOrders = computed(() => sortServiceOrders(props.orders));
</script>
