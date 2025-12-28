<template>
  <div class="space-y-5">
    <Card>
      <template #title>Meus Checklists Pendentes</template>
      <template #content>
        <p class="mb-4 text-sm text-slate-600 dark:text-slate-300">
          Lista de checklists vinculados às suas OS. Clique em um item para abrir o checklist completo.
        </p>
        <div class="space-y-3">
          <div
            v-for="item in pendingChecklists"
            :key="item.id"
            class="flex items-center justify-between rounded-lg border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-slate-800 dark:text-slate-100">{{ item.osCode }}</p>
                <Tag :value="item.statusLabel" :severity="item.statusSeverity" />
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-300">{{ item.title }}</p>
              <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {{ item.completedItems }}/{{ item.totalItems }} itens respondidos
              </p>
            </div>
            <Button label="Abrir checklist" icon="pi pi-arrow-right" icon-pos="right" @click="openChecklist(item.osId)" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import { useRouter } from 'vue-router';

const router = useRouter();

// Dados mockados - substituir por chamada à API quando integrado
const pendingChecklists = ref([
  {
    id: 'cl-1',
    osId: 'os-1',
    osCode: 'OS-1243',
    title: 'Checklist padrão de instalação - Substituir quadro elétrico',
    statusLabel: 'Pendente',
    statusSeverity: 'warning',
    completedItems: 0,
    totalItems: 3
  },
  {
    id: 'cl-2',
    osId: 'os-2',
    osCode: 'OS-1251',
    title: 'Vistoria de segurança - Revisão preventiva de bomba',
    statusLabel: 'Em andamento',
    statusSeverity: 'info',
    completedItems: 2,
    totalItems: 2
  }
]);

function openChecklist(osId: string) {
  // Redireciona para a seção de painel-os que tem o checklist completo
  router.push({ name: 'os-section', params: { section: 'painel-os' }, query: { osId } });
}
</script>
