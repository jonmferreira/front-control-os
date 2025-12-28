<template>
  <Card>
    <template #title>{{ title }}</template>
    <template #content>
      <div v-if="loading" class="h-64">
        <Skeleton height="100%" border-radius="12px" />
      </div>
      <Message v-else-if="error" severity="error" :closable="false">
        {{ error }}
      </Message>
      <Chart v-else type="line" :data="chartData" :options="chartOptions" class="h-64" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Card from 'primevue/card';
import Chart from 'primevue/chart';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import type { TimeSeriesData } from '../types';

interface Props {
  title: string;
  data: TimeSeriesData[];
  loading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
});

const chartData = computed(() => {
  return {
    labels: props.data.map(d => d.label),
    datasets: [
      {
        label: props.title,
        data: props.data.map(d => d.value),
        fill: false,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4
      }
    ]
  };
});

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };
});
</script>
