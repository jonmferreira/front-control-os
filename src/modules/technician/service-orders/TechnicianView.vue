<template>
  <div class="space-y-6">
    <Card>
      <template #title>Minhas Ordens de Serviço</template>
      <template #content>
        <p class="mb-4 text-sm text-slate-600 dark:text-slate-300">
          Visualize e gerencie suas ordens de serviço. Selecione uma OS para ver os detalhes.
        </p>

        <!-- Lista de Ordens de Serviço -->
        <ServiceOrderList
          :orders="serviceOrders"
          @select="handleSelectOrder"
        />
      </template>
    </Card>

    <!-- Card de Detalhes da OS Selecionada -->
    <Card v-if="selectedOrder">
      <template #title>
        <div class="flex items-center justify-between">
          <span>{{ selectedOrder.title }}</span>
          <Button
            icon="pi pi-times"
            text
            rounded
            severity="secondary"
            @click="selectedOrder = null"
          />
        </div>
      </template>
      <template #content>
        <ServiceOrderCard :order="selectedOrder" />

        <!-- Checklist -->
        <div v-if="checklistItems.length > 0" class="mt-6">
          <h3 class="mb-4 text-lg font-semibold">Checklist</h3>
          <ChecklistForm
            :items="checklistItems"
            :readonly="selectedOrder.status === ServiceOrderStatus.COMPLETED"
            @update="handleChecklistUpdate"
          />
        </div>
        <div v-else class="mt-6 text-center text-slate-500">
          Nenhum checklist associado a esta OS.
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import ServiceOrderList from './components/ServiceOrderList.vue';
import ServiceOrderCard from './components/ServiceOrderCard.vue';
import ChecklistForm from './components/ChecklistForm.vue';
import { mockServiceOrders, mockChecklistItems } from './mocks';
import { ServiceOrderStatus } from './types';
import type { ServiceOrder, ChecklistItem } from './types';

const serviceOrders = ref(mockServiceOrders);
const selectedOrder = ref<ServiceOrder | null>(null);

// Simula checklist items para a OS selecionada
const checklistItems = computed<ChecklistItem[]>(() => {
  if (!selectedOrder.value) return [];
  return mockChecklistItems.filter(item => item.serviceOrderId === selectedOrder.value?.id);
});

function handleSelectOrder(order: ServiceOrder) {
  selectedOrder.value = order;
}

function handleChecklistUpdate(itemId: string, value: string | number | boolean | null) {
  const item = checklistItems.value.find(i => i.id === itemId);
  if (item) {
    item.value = value;
    item.completed = value !== null && value !== '';
    console.log('Checklist item atualizado:', itemId, value);
  }
}
</script>
