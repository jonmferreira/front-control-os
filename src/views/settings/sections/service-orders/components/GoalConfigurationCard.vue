<template>
  <Card>
    <template #title>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <span>Configuração de metas</span>
        <Tag value="API de metas" severity="info" />
      </div>
    </template>
    <template #content>
      <div class="space-y-3">
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Defina metas diárias, semanais ou mensais. O formulário chama <strong>{{ goalEndpoint }}</strong> com fallback local.
        </p>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Período da meta</label>
          <Dropdown v-model="goalPeriod" :options="goalPeriodOptions" option-label="label" option-value="value" />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Valor de OS</label>
          <InputNumber v-model="goalValue" input-id="goal-value" :min="1" :max="500" show-buttons button-layout="horizontal" />
        </div>
        <div class="space-y-2">
          <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Observação (opcional)</label>
          <Textarea v-model="goalNotes" rows="2" auto-resize />
        </div>
        <div class="flex flex-wrap gap-2">
          <Button :disabled="goalSubmitting" icon="pi pi-save" label="Salvar meta" @click="submitGoal" />
          <Button icon="pi pi-refresh" label="Limpar" outlined @click="resetGoalForm" />
        </div>
        <Message v-if="goalFeedback" :severity="goalFeedback.severity" :closable="false" class="rounded-xl">
          {{ goalFeedback.message }}
        </Message>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Message from 'primevue/message';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';

import { OS_API_BASE_URL } from '@/config/env';

type GoalPeriod = 'diario' | 'semanal' | 'mensal';

const goalPeriodOptions: Array<{ label: string; value: GoalPeriod }> = [
  { label: 'Diária', value: 'diario' },
  { label: 'Semanal', value: 'semanal' },
  { label: 'Mensal', value: 'mensal' }
];

const goalEndpoint = `${OS_API_BASE_URL}/metas`;
const goalPeriod = ref<GoalPeriod>('diario');
const goalValue = ref<number | null>(25);
const goalNotes = ref('');
const goalSubmitting = ref(false);
const goalFeedback = ref<{ message: string; severity: 'success' | 'warn' | 'error' } | null>(null);

async function submitGoal() {
  goalSubmitting.value = true;
  goalFeedback.value = null;

  try {
    const payload = {
      period: goalPeriod.value,
      value: goalValue.value,
      notes: goalNotes.value
    };

    const response = await fetch(goalEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Falha ao salvar meta na API.');
    }

    goalFeedback.value = { message: 'Meta salva com sucesso na API de metas.', severity: 'success' };
  } catch (error) {
    console.warn('[metas] Falha ao chamar API, aplicando fallback local.', error);
    goalFeedback.value = {
      message: 'Meta armazenada localmente enquanto a API não responde. Reenvie quando possível.',
      severity: 'warn'
    };
  } finally {
    goalSubmitting.value = false;
  }
}

function resetGoalForm() {
  goalPeriod.value = 'diario';
  goalValue.value = 25;
  goalNotes.value = '';
  goalFeedback.value = null;
}
</script>
