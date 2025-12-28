<template>
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card
      v-for="metric in metrics"
      :key="metric.label"
      class="rounded-xl border border-slate-200/80 bg-white/70 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
    >
      <template #content>
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {{ metric.label }}
            </p>
            <p class="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {{ formatMetricValue(metric) }}
            </p>
            <div v-if="metric.change !== undefined" class="flex items-center gap-1 mt-1">
              <i
                :class="[
                  'pi text-xs',
                  metric.change > 0 ? 'pi-arrow-up text-green-600' : 'pi-arrow-down text-red-600'
                ]"
              ></i>
              <span
                :class="[
                  'text-xs font-medium',
                  metric.change > 0 ? 'text-green-600' : 'text-red-600'
                ]"
              >
                {{ Math.abs(metric.change) }}%
              </span>
              <span class="text-xs text-slate-500 dark:text-slate-400">vs período anterior</span>
            </div>
          </div>
          <span
            :class="[
              'flex h-12 w-12 items-center justify-center rounded-lg text-xl',
              metric.iconClass
            ]"
          >
            <i :class="['pi', metric.icon]" aria-hidden="true"></i>
          </span>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import type { DashboardMetric } from '../types';

interface Props {
  metrics: DashboardMetric[];
}

defineProps<Props>();

function formatMetricValue(metric: DashboardMetric): string {
  if (metric.format === 'currency') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(metric.value);
  }

  if (metric.format === 'percentage') {
    return `${metric.value}%`;
  }

  if (metric.format === 'duration') {
    const hours = Math.floor(metric.value / 60);
    const minutes = metric.value % 60;
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  }

  return metric.value.toString();
}
</script>
