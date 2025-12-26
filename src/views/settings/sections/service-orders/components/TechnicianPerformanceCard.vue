<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between gap-3">
        <span>Técnico — OS realizadas (30 dias)</span>
        <Tag value="Visão de execução" severity="info" />
      </div>
    </template>
    <template #content>
      <Chart type="line" :data="chartConfig.data" :options="chartConfig.options" />
      <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Inclui meta diária configurada e tendência de realização por dia.
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Chart from 'primevue/chart';

import { buildLineChartConfig } from '@/components/charts/configs/lineChartConfig';

interface TechnicianHistoryItem {
  label: string;
  completed: number;
  meta: number;
}

const technicianHistory: TechnicianHistoryItem[] = [
  { label: '01/11', completed: 10, meta: 14 },
  { label: '05/11', completed: 12, meta: 14 },
  { label: '10/11', completed: 15, meta: 14 },
  { label: '15/11', completed: 17, meta: 14 },
  { label: '20/11', completed: 16, meta: 14 },
  { label: '25/11', completed: 18, meta: 14 },
  { label: '30/11', completed: 21, meta: 14 }
];

const chartConfig = computed(() =>
  buildLineChartConfig({
    labels: technicianHistory.map((item) => item.label),
    series: [
      { label: 'Realizadas', data: technicianHistory.map((item) => item.completed), borderColor: '#10b981', fill: true },
      { label: 'Meta diária', data: technicianHistory.map((item) => item.meta), borderColor: '#6366f1', dashed: true }
    ]
  })
);
</script>
