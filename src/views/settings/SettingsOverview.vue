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

    <div class="grid gap-4 md:grid-cols-2">
      <Card>
        <template #title>Atalhos rápidos</template>
        <template #content>
          <div class="flex flex-col gap-3">
            <Button label="Ver fila de OS" icon="pi pi-briefcase" @click="goTo('painel-os')" outlined />
            <Button label="Organizar checklists" icon="pi pi-list-check" @click="goTo('checklists')" outlined />
            <Button label="Configurar alertas" icon="pi pi-bell" @click="goTo('alertas')" outlined />
          </div>
        </template>
      </Card>

      <Card>
        <template #title>Status operacional</template>
        <template #content>
          <ul class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li class="flex items-center gap-2">
              <i class="pi pi-list-check text-emerald-500"></i>
              Checklists obrigatórios carregados para novas OS
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-bell text-amber-500"></i>
              Alertas de SLA habilitados para técnicos e responsáveis
            </li>
            <li class="flex items-center gap-2">
              <i class="pi pi-palette text-blue-500"></i>
              Tema do console sincronizado com a identidade do time
            </li>
          </ul>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import { useRouter } from 'vue-router';

const router = useRouter();

const goTo = (section: string) => {
  router.push({ name: 'os-section', params: { section } });
};
</script>
