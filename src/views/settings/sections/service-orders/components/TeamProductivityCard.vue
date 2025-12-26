<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between gap-3">
        <span>Técnico responsável — produtividade da equipe</span>
        <Tag value="Equipe" severity="success" />
      </div>
    </template>
    <template #content>
      <Chart type="bar" :data="chartConfig.data" :options="chartConfig.options" />
      <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Use este painel para priorizar checklists e redistribuir OS entre técnicos.
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Chart from 'primevue/chart';

import { buildStackedBarChartConfig } from '@/components/charts/configs/stackedBarChartConfig';
import { applyPalette } from '@/helpers_and_formaters';

interface TeamProductivityItem {
  technician: string;
  completed: number;
  inProgress: number;
  pending: number;
}

const teamProductivity: TeamProductivityItem[] = [
  { technician: 'Luana Pires', completed: 18, inProgress: 6, pending: 3 },
  { technician: 'João Mendes', completed: 15, inProgress: 5, pending: 2 },
  { technician: 'Carlos Lima', completed: 12, inProgress: 4, pending: 1 },
  { technician: 'Ana Paula', completed: 10, inProgress: 6, pending: 4 }
];

const chartConfig = computed(() =>
  buildStackedBarChartConfig({
    labels: teamProductivity.map((item) => item.technician),
    series: applyPalette([
      { label: 'Finalizadas', data: teamProductivity.map((item) => item.completed) },
      { label: 'Em andamento', data: teamProductivity.map((item) => item.inProgress) },
      { label: 'Pendentes', data: teamProductivity.map((item) => item.pending) }
    ]).map((item) => ({ label: item.label, data: item.data, backgroundColor: item.color }))
  })
);
</script>
