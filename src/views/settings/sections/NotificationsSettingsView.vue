<template>
  <div class="space-y-5">
    <Card>
      <template #title>Canais para alertas operacionais</template>
      <template #content>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300" for="channels">Canais principais</label>
            <MultiSelect
              id="channels"
              v-model="selectedChannels"
              :options="channelOptions"
              option-label="label"
              option-value="value"
              class="w-full"
              display="chip"
              placeholder="Selecione os canais"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300" for="digest">Resumo semanal</label>
            <Dropdown
              id="digest"
              v-model="digest"
              :options="digestOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Alertas em tempo real</template>
      <template #content>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-slate-700 dark:text-slate-200">OS com SLA em risco</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Avise responsáveis quando o prazo estiver perto do limite.</p>
            </div>
            <InputSwitch v-model="securityAlerts" />
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-slate-700 dark:text-slate-200">Checklist reprovado</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Alerte o técnico responsável quando houver itens pendentes.</p>
            </div>
            <InputSwitch v-model="newFollowers" />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Horário silencioso</template>
      <template #content>
        <div class="space-y-3">
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Defina um intervalo para pausar notificações push e focar nas janelas de manutenção.
          </p>
          <Slider v-model="quietHours" range :min="0" :max="24" class="w-full" />
          <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
            Sem notificações entre {{ quietHours[0] }}h e {{ quietHours[1] }}h
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import MultiSelect from 'primevue/multiselect';
import Slider from 'primevue/slider';

const channelOptions = [
  { label: 'Notificações push', value: 'push' },
  { label: 'E-mail', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'WhatsApp', value: 'whatsapp' }
];

const digestOptions = [
  { label: 'Diário', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensal', value: 'monthly' }
];

const selectedChannels = ref(['push', 'email']);
const digest = ref('weekly');
const securityAlerts = ref(true);
const newFollowers = ref(true);
const quietHours = ref<[number, number]>([22, 7]);
</script>
