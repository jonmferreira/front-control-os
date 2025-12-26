<template>
  <Card>
    <template #title>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Gerente</p>
          <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Curva de OS por colaborador (6 meses)</h3>
        </div>
        <Dropdown v-model="selectedCollaboratorId" :options="collaboratorOptions" option-label="label" option-value="value" />
      </div>
    </template>
    <template #content>
      <Chart type="line" :data="chartConfig.data" :options="chartConfig.options" />
      <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Avalie burnout e distribuição de carga. Altere o colaborador para comparar curvas.
      </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import Chart from 'primevue/chart';

import { buildLineChartConfig } from '@/components/charts/configs/lineChartConfig';

interface CollaboratorSeries {
  id: string;
  name: string;
  months: string[];
  series: number[];
}

const collaboratorPerformance = ref<CollaboratorSeries[]>([
  { id: 'luana', name: 'Luana Pires', months: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'], series: [18, 20, 22, 19, 23, 24] },
  { id: 'joao', name: 'João Mendes', months: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'], series: [14, 15, 17, 16, 18, 19] },
  { id: 'carlos', name: 'Carlos Lima', months: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'], series: [12, 13, 15, 15, 16, 17] },
  { id: 'ana', name: 'Ana Paula', months: ['Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'], series: [10, 12, 14, 15, 17, 18] }
]);

const collaboratorOptions = computed(() =>
  collaboratorPerformance.value.map((item) => ({
    label: item.name,
    value: item.id
  }))
);

const selectedCollaboratorId = ref<string>('');

watch(
  collaboratorOptions,
  (options) => {
    if (!selectedCollaboratorId.value && options[0]) {
      selectedCollaboratorId.value = options[0].value;
    }
  },
  { immediate: true }
);

const selectedCollaborator = computed(() => collaboratorPerformance.value.find((item) => item.id === selectedCollaboratorId.value));

const chartConfig = computed(() => {
  const collaborator = selectedCollaborator.value ?? collaboratorPerformance.value[0];
  const data = (collaborator?.months ?? []).map((month, index) => ({
    month,
    completed: collaborator?.series[index] ?? 0
  }));

  return buildLineChartConfig({
    labels: data.map((item) => item.month),
    series: [{ label: 'OS concluídas', data: data.map((item) => item.completed), borderColor: '#0ea5e9', borderWidth: 3 }]
  });
});
</script>
