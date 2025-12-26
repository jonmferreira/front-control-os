<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between gap-3">
        <span>Gerente — status vs meta</span>
        <Tag value="Última semana" severity="warning" />
      </div>
    </template>
    <template #content>
      <Chart type="bar" :data="chartConfig.data" :options="chartConfig.options" />
      <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Comparativo de pendentes, realizadas e metas em ciclos diário, semanal e mensal.
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Chart from 'primevue/chart';

import { buildComboBarLineChartConfig } from '@/components/charts/configs/comboBarLineChartConfig';
import { applyPalette } from '@/helpers_and_formaters';

interface ManagerStatusItem {
  label: string;
  pending: number;
  done: number;
  goal: number;
}

const managerStatusSummary: ManagerStatusItem[] = [
  { label: 'Diário', pending: 6, done: 22, goal: 24 },
  { label: 'Semanal', pending: 18, done: 102, goal: 110 },
  { label: 'Mensal', pending: 34, done: 428, goal: 450 }
];

const chartConfig = computed(() =>
  buildComboBarLineChartConfig({
    labels: managerStatusSummary.map((item) => item.label),
    series: [
      ...applyPalette([
        { label: 'Pendentes', data: managerStatusSummary.map((item) => item.pending), type: 'bar' as const },
        { label: 'Realizadas', data: managerStatusSummary.map((item) => item.done), type: 'bar' as const }
      ]).map((serie) => ({ label: serie.label, data: serie.data, type: serie.type, color: serie.color })),
      { label: 'Meta', data: managerStatusSummary.map((item) => item.goal), type: 'line', color: '#6366f1' }
    ]
  })
);
</script>
