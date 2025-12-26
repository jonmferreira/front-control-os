<template>
  <div class="space-y-5">
    <!-- Cards de Resumo -->
    <Card>
      <template #title>Fila de ordens de serviço</template>
      <template #content>
        <div class="grid gap-3 md:grid-cols-4">
          <div
            v-for="card in statusCards"
            :key="card.label"
            class="rounded-xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {{ card.label }}
                </p>
                <p class="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                  {{ card.value }}
                </p>
              </div>
              <span :class="['flex h-10 w-10 items-center justify-center rounded-lg text-lg', card.iconClass]">
                <i :class="['pi', card.icon]" aria-hidden="true"></i>
              </span>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Lista de Ordens -->
    <Card>
      <template #title>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <span>Ordens de Serviço</span>
          <Button
            icon="pi pi-plus"
            label="Nova Ordem"
            @click="showCreateDialog = true"
          />
        </div>
      </template>
      <template #content>
        <!-- Loading -->
        <div v-if="loading" class="space-y-2">
          <Skeleton height="2.5rem" border-radius="12px" />
          <Skeleton height="2.5rem" border-radius="12px" />
          <Skeleton height="2.5rem" border-radius="12px" />
        </div>

        <!-- Error -->
        <Message v-else-if="error" severity="error" :closable="false">
          {{ error }}
        </Message>

        <!-- DataTable -->
        <DataTable
          v-else
          :value="orders"
          size="small"
          responsive-layout="scroll"
          selection-mode="single"
          :selection="selectedOrder"
          @row-select="onSelectOrder"
        >
          <Column field="title" header="Título"></Column>
          <Column field="assignedTechnician" header="Responsável"></Column>
          <Column header="Status">
            <template #body="{ data }">
              <Tag :value="formatOrderStatus(data.status)" :severity="getStatusColor(data.status)" />
            </template>
          </Column>
          <Column header="Data">
            <template #body="{ data }">
              {{ formatDate(data.openedAt) }}
            </template>
          </Column>
          <Column header="Ações" style="width: 200px">
            <template #body="{ data }">
              <div class="flex flex-wrap gap-2">
                <Button
                  v-if="canStartOrder(data)"
                  size="small"
                  icon="pi pi-play"
                  label="Iniciar"
                  :loading="startingId === data.id"
                  @click.stop="handleStartOrder(data.id)"
                />
                <Button
                  v-if="canCompleteOrder(data)"
                  size="small"
                  icon="pi pi-check"
                  label="Finalizar"
                  severity="success"
                  :loading="completingId === data.id"
                  @click.stop="handleCompleteOrder(data.id)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Dialog Criar Ordem -->
    <Dialog
      v-model:visible="showCreateDialog"
      header="Nova Ordem de Serviço"
      :style="{ width: '500px' }"
      modal
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Título</label>
          <InputText v-model="newOrder.title" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Descrição</label>
          <Textarea v-model="newOrder.description" rows="4" class="w-full" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Técnico Responsável</label>
          <InputText v-model="newOrder.assignedTechnician" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showCreateDialog = false" />
        <Button
          label="Criar"
          :loading="creating"
          @click="handleCreateOrder"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import { useToast } from 'primevue/usetoast';

// Integrations
import {
  listOrders,
  createOrder,
  changeOrderStatus,
  type Order,
} from './integrations/api';

// Helpers
import {
  formatOrderStatus,
  getStatusColor,
  canStartOrder,
  canCompleteOrder,
  formatDate,
  groupOrdersByStatus,
} from './helpers/formatters';

// ============================================
// STATE
// ============================================

const toast = useToast();
const orders = ref<Order[]>([]);
const loading = ref(false);
const error = ref('');
const selectedOrder = ref<Order | null>(null);
const showCreateDialog = ref(false);
const creating = ref(false);
const startingId = ref('');
const completingId = ref('');

const newOrder = ref({
  title: '',
  description: '',
  assignedTechnician: '',
});

// ============================================
// COMPUTED
// ============================================

const ordersByStatus = computed(() => groupOrdersByStatus(orders.value));

const statusCards = computed(() => [
  {
    label: 'Pendentes',
    value: ordersByStatus.value.open.length,
    icon: 'pi-hourglass',
    iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  },
  {
    label: 'Em Andamento',
    value: ordersByStatus.value.inProgress.length,
    icon: 'pi-spinner',
    iconClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
  },
  {
    label: 'Finalizadas',
    value: ordersByStatus.value.completed.length,
    icon: 'pi-check-circle',
    iconClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  },
  {
    label: 'Rejeitadas',
    value: ordersByStatus.value.rejected.length,
    icon: 'pi-times-circle',
    iconClass: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200',
  },
]);

// ============================================
// FUNCTIONS
// ============================================

async function loadOrders() {
  loading.value = true;
  error.value = '';

  try {
    orders.value = await listOrders();
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar ordens';
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.value,
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
}

async function handleCreateOrder() {
  if (!newOrder.value.title || !newOrder.value.description) {
    toast.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: 'Preencha todos os campos obrigatórios',
      life: 3000,
    });
    return;
  }

  creating.value = true;

  try {
    const created = await createOrder(newOrder.value);
    orders.value.unshift(created);

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Ordem criada com sucesso',
      life: 3000,
    });

    // Reset form
    newOrder.value = { title: '', description: '', assignedTechnician: '' };
    showCreateDialog.value = false;
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: e instanceof Error ? e.message : 'Erro ao criar ordem',
      life: 3000,
    });
  } finally {
    creating.value = false;
  }
}

async function handleStartOrder(id: string) {
  startingId.value = id;

  try {
    await changeOrderStatus(id, { newStatus: 'InProgress' });

    // Update local state
    const order = orders.value.find(o => o.id === id);
    if (order) {
      order.status = 'InProgress';
    }

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Ordem iniciada',
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: e instanceof Error ? e.message : 'Erro ao iniciar ordem',
      life: 3000,
    });
  } finally {
    startingId.value = '';
  }
}

async function handleCompleteOrder(id: string) {
  completingId.value = id;

  try {
    await changeOrderStatus(id, { newStatus: 'Completed' });

    // Update local state
    const order = orders.value.find(o => o.id === id);
    if (order) {
      order.status = 'Completed';
      order.completedAt = new Date().toISOString();
    }

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Ordem finalizada',
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: e instanceof Error ? e.message : 'Erro ao finalizar ordem',
      life: 3000,
    });
  } finally {
    completingId.value = '';
  }
}

function onSelectOrder(event: { data: Order }) {
  selectedOrder.value = event.data;
}

// ============================================
// LIFECYCLE
// ============================================

onMounted(() => {
  loadOrders();
});
</script>
