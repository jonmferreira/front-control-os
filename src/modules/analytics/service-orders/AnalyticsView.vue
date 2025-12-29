<template>
  <div class="space-y-6">
    <Card>
      <template #title>Dashboard Analítico</template>
      <template #content>
        <p class="mb-4 text-sm text-slate-600 dark:text-slate-300">
          Métricas consolidadas, tendências e monitoramento de SLA das ordens de serviço.
        </p>

        <!-- Métricas Gerais -->
        <MetricsOverview :metrics="dashboardMetrics" />
      </template>
    </Card>

    <!-- Gráfico de Série Temporal -->
    <Card>
      <template #title>Evolução de OS por Status</template>
      <template #content>
        <TimeSeriesChart title="OS Criadas" :data="timeSeriesData" />
      </template>
    </Card>

    <!-- Monitoramento de SLA -->
    <Card>
      <template #title>Monitoramento de SLA</template>
      <template #content>
        <p class="mb-4 text-sm text-slate-600 dark:text-slate-300">
          Acompanhe OS que estão próximas do prazo ou atrasadas.
        </p>
        <SLATracker :items="slaMetricItems" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import MetricsOverview from './components/MetricsOverview.vue';
import TimeSeriesChart from './components/TimeSeriesChart.vue';
import SLATracker from './components/SLATracker.vue';
import { mockDashboardMetrics, mockTimeSeriesCreated, mockSLAMetricItems } from './mocks';

const dashboardMetrics = ref(mockDashboardMetrics);
const timeSeriesData = ref(mockTimeSeriesCreated);
const slaMetricItems = ref(mockSLAMetricItems);
</script>
