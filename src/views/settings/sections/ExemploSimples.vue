<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Ordens de Serviço</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500">
      Carregando...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-100 p-4 rounded text-red-800">
      {{ error }}
    </div>

    <!-- Lista de Ordens -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border p-4 rounded hover:bg-gray-50"
      >
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold">{{ order.title }}</h3>
            <p class="text-sm text-gray-600">{{ order.description }}</p>
            <span class="text-xs bg-blue-100 px-2 py-1 rounded">
              {{ order.status }}
            </span>
          </div>
          <button
            v-if="order.status === 'Open'"
            @click="startOrder(order.id)"
            :disabled="starting === order.id"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {{ starting === order.id ? 'Iniciando...' : 'Iniciar' }}
          </button>
        </div>
      </div>

      <!-- Botão Criar -->
      <button
        @click="showCreateForm = !showCreateForm"
        class="w-full py-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500"
      >
        + Nova Ordem
      </button>

      <!-- Form Criar -->
      <div v-if="showCreateForm" class="border p-4 rounded bg-gray-50">
        <h3 class="font-bold mb-3">Nova Ordem de Serviço</h3>
        <input
          v-model="newOrder.title"
          placeholder="Título"
          class="w-full p-2 border rounded mb-2"
        />
        <textarea
          v-model="newOrder.description"
          placeholder="Descrição"
          class="w-full p-2 border rounded mb-2"
          rows="3"
        />
        <div class="flex gap-2">
          <button
            @click="createOrder"
            :disabled="creating"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {{ creating ? 'Criando...' : 'Criar' }}
          </button>
          <button
            @click="showCreateForm = false"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { GET, POST } from '@/lib/api';

// ============================================
// TIPOS (inline, sem arquivo separado)
// ============================================

interface Order {
  id: string;
  title: string;
  description: string;
  status: string;
  assignedTechnician?: string;
}

// ============================================
// ESTADO (direto, sem composable)
// ============================================

const orders = ref<Order[]>([]);
const loading = ref(false);
const error = ref('');
const starting = ref('');
const creating = ref(false);
const showCreateForm = ref(false);

const newOrder = ref({
  title: '',
  description: '',
});

// ============================================
// FUNÇÕES (direto no componente, sem service layer)
// ============================================

async function loadOrders() {
  loading.value = true;
  error.value = '';

  try {
    orders.value = await GET<Order[]>('/orders');
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erro ao carregar';
  } finally {
    loading.value = false;
  }
}

async function startOrder(id: string) {
  starting.value = id;

  try {
    await POST(`/orders/${id}/status`, {
      newStatus: 'InProgress',
    });

    // Atualiza localmente (sem refetch)
    const order = orders.value.find(o => o.id === id);
    if (order) {
      order.status = 'InProgress';
    }
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Erro ao iniciar ordem');
  } finally {
    starting.value = '';
  }
}

async function createOrder() {
  if (!newOrder.value.title || !newOrder.value.description) {
    alert('Preencha todos os campos');
    return;
  }

  creating.value = true;

  try {
    const created = await POST<Order>('/orders', newOrder.value);

    // Adiciona na lista local (sem refetch)
    orders.value.unshift(created);

    // Limpa form
    newOrder.value = { title: '', description: '' };
    showCreateForm.value = false;
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Erro ao criar ordem');
  } finally {
    creating.value = false;
  }
}

// ============================================
// LIFECYCLE
// ============================================

onMounted(() => {
  loadOrders();
});
</script>
