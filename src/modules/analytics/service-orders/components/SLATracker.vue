<template>
  <Card>
    <template #title>Acompanhamento de SLA</template>
    <template #content>
      <div v-if="loading" class="space-y-2">
        <Skeleton height="3rem" border-radius="12px" />
        <Skeleton height="3rem" border-radius="12px" />
      </div>
      <Message v-else-if="error" severity="error" :closable="false">
        {{ error }}
      </Message>
      <div v-else class="space-y-4">
        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-lg border border-green-200/80 bg-green-50/50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <p class="text-xs uppercase tracking-wide text-green-700 dark:text-green-300">
              Dentro do prazo
            </p>
            <p class="text-2xl font-semibold text-green-800 dark:text-green-200">
              {{ slaStats.onTime }}
            </p>
          </div>
          <div class="rounded-lg border border-yellow-200/80 bg-yellow-50/50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <p class="text-xs uppercase tracking-wide text-yellow-700 dark:text-yellow-300">
              Próximo ao vencimento
            </p>
            <p class="text-2xl font-semibold text-yellow-800 dark:text-yellow-200">
              {{ slaStats.atRisk }}
            </p>
          </div>
          <div class="rounded-lg border border-red-200/80 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p class="text-xs uppercase tracking-wide text-red-700 dark:text-red-300">
              Vencidas
            </p>
            <p class="text-2xl font-semibold text-red-800 dark:text-red-200">
              {{ slaStats.overdue }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Taxa de cumprimento
          </p>
          <ProgressBar :value="slaComplianceRate" :show-value="true" />
        </div>

        <Divider />

        <div v-if="items.length" class="space-y-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            OS em risco
          </p>
          <div
            v-for="item in items"
            :key="item.serviceOrderId"
            class="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div>
              <p class="font-semibold text-slate-800 dark:text-slate-100">{{ item.serviceOrderTitle }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Técnico: {{ item.technicianName }}
              </p>
            </div>
            <Tag :value="getSLALabel(item)" :severity="getSLASeverity(item)" />
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import ProgressBar from 'primevue/progressbar';
import Divider from 'primevue/divider';
import type { SLAMetric } from '../types';

interface Props {
  items: SLAMetric[];
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
});

const slaStats = computed(() => {
  const onTime = props.items.filter(item => item.status === 'on_time').length;
  const atRisk = props.items.filter(item => item.status === 'at_risk').length;
  const overdue = props.items.filter(item => item.status === 'overdue').length;

  return { onTime, atRisk, overdue };
});

const slaComplianceRate = computed(() => {
  const total = props.items.length;
  if (total === 0) return 100;
  return Math.round((slaStats.value.onTime / total) * 100);
});

function getSLALabel(item: SLAMetric): string {
  if (item.status === 'overdue') {
    const hoursOverdue = Math.abs(item.remainingHours);
    return `Atrasada ${hoursOverdue}h`;
  }
  if (item.status === 'at_risk') {
    return `Vence em ${item.remainingHours}h`;
  }
  return `${item.remainingHours}h restantes`;
}

function getSLASeverity(item: SLAMetric): 'success' | 'warn' | 'danger' {
  if (item.status === 'overdue') return 'danger';
  if (item.status === 'at_risk') return 'warn';
  return 'success';
}
</script>
