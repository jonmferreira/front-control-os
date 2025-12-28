<template>
  <div class="space-y-6">
    <Card>
      <template #title>
        <div class="flex items-center justify-between gap-3">
          <span>Console de Ordens de Serviço</span>
          <Tag value="Visão operacional" severity="info" />
        </div>
      </template>
      <template #content>
        <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          Centralize o andamento das OS, valide checklists e ajuste os parâmetros do time. Use o menu ao lado para abrir as áreas de
          operação, cadastros e alertas.
        </p>
      </template>
    </Card>

    <Card>
      <template #title>Minhas Ordens de Serviço</template>
      <template #content>
        <p class="mb-4 text-sm text-slate-600 dark:text-slate-300">
          Lista de OS atribuídas a você. Clique em "Ver detalhes" para abrir a OS completa.
        </p>
        <div class="space-y-3">
          <div v-for="os in recentOrders" :key="os.id" class="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-slate-800 dark:text-slate-100">{{ os.code }}</p>
                <Tag :value="os.statusLabel" :severity="os.statusSeverity" />
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-300">{{ os.title }}</p>
            </div>
            <Button label="Ver detalhes" icon="pi pi-arrow-right" icon-pos="right" text @click="goTo('painel-os')" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import { useRouter } from 'vue-router';

const router = useRouter();

const recentOrders = [
  { id: 'os-1', code: 'OS-1243', title: 'Substituir quadro elétrico', statusLabel: 'Pendente', statusSeverity: 'warning' },
  { id: 'os-2', code: 'OS-1251', title: 'Revisão preventiva de bomba', statusLabel: 'Em andamento', statusSeverity: 'info' },
  { id: 'os-3', code: 'OS-1259', title: 'Entrega pós-serviço', statusLabel: 'Finalizada', statusSeverity: 'success' }
];

const goTo = (section: string) => {
  router.push({ name: 'os-section', params: { section } });
};
</script>
