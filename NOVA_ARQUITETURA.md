# Nova Arquitetura do Front-end

## Estrutura Limpa por Features

### Antes (Over-engineered)

```
src/
├── composables/         ← Camada extra desnecessária
│   ├── useOrders.ts
│   ├── useChecklists.ts
│   └── useAuth.ts
├── services/
│   ├── api/
│   │   ├── client.ts    ← Cliente HTTP
│   │   ├── orders.ts    ← Service layer
│   │   └── checklists.ts
│   └── types/           ← Tipos separados
├── views/
│   └── orders/
│       └── OrdersView.vue
```

**Problema:** 5 arquivos diferentes para fazer 1 fetch!

### Depois (Limpo)

```
src/
├── lib/
│   └── api.ts           ← HTTP client simples (GET, POST, PUT, DELETE)
│
└── features/            ← Tudo por feature
    ├── orders/
    │   ├── integrations/
    │   │   └── api.ts   ← Funções de API + Tipos
    │   ├── helpers/
    │   │   └── formatters.ts  ← Helpers específicos
    │   ├── components/
    │   │   └── OrderCard.vue  ← Componentes reutilizáveis
    │   └── OrdersPage.vue     ← Página principal
    │
    ├── auth/
    │   ├── integrations/
    │   │   └── api.ts   ← login(), logout(), session storage
    │   └── LoginPage.vue
    │
    └── checklists/
        ├── integrations/
        │   └── api.ts
        ├── helpers/
        │   └── formatters.ts
        └── ChecklistsPage.vue
```

**Benefício:** Cada feature é auto-contida!

---

## Princípios

### 1. Uma Feature = Uma Pasta

Tudo relacionado a "Orders" fica em `features/orders/`:
- API calls
- Tipos
- Helpers
- Componentes específicos
- Página principal

### 2. Integrations = API + Tipos

```typescript
// features/orders/integrations/api.ts

// Tipos inline
export interface Order {
  id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Completed';
}

// Funções diretas
export async function listOrders(): Promise<Order[]> {
  return GET<Order[]>('/orders');
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  return POST<Order>('/orders', data);
}
```

**Sem composables, sem service layer, sem abstração!**

### 3. Helpers = Formatação e Lógica de UI

```typescript
// features/orders/helpers/formatters.ts

export function formatOrderStatus(status: Order['status']): string {
  const labels = {
    Open: 'Pendente',
    InProgress: 'Em Andamento',
    Completed: 'Finalizada',
  };
  return labels[status];
}

export function canStartOrder(order: Order): boolean {
  return order.status === 'Open';
}
```

### 4. Componente = Tudo Junto

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listOrders, createOrder, type Order } from './integrations/api';
import { formatOrderStatus, canStartOrder } from './helpers/formatters';

const orders = ref<Order[]>([]);
const loading = ref(false);

async function loadOrders() {
  loading.value = true;
  try {
    orders.value = await listOrders();
  } finally {
    loading.value = false;
  }
}

async function handleCreate(data: CreateOrderData) {
  const created = await createOrder(data);
  orders.value.unshift(created);  // Atualiza local
}

onMounted(loadOrders);
</script>
```

**Sem camadas intermediárias!**

---

## HTTP Client Simples

### lib/api.ts

```typescript
import { OS_API_BASE_URL } from '@/config/env';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${OS_API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    setAuthToken(null);
    window.location.href = '/login';
    throw new Error('Sessão expirada');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return await response.json();
}

// Helpers
export const GET = <T>(endpoint: string) =>
  api<T>(endpoint, { method: 'GET' });

export const POST = <T>(endpoint: string, data?: unknown) =>
  api<T>(endpoint, { method: 'POST', body: JSON.stringify(data) });

export const PUT = <T>(endpoint: string, data?: unknown) =>
  api<T>(endpoint, { method: 'PUT', body: JSON.stringify(data) });

export const DELETE = <T>(endpoint: string) =>
  api<T>(endpoint, { method: 'DELETE' });
```

**80 linhas. Faz tudo que você precisa.**

---

## Exemplo Completo: Orders

### 1. API (integrations/api.ts)

```typescript
import { GET, POST } from '@/lib/api';

export interface Order {
  id: string;
  title: string;
  status: 'Open' | 'InProgress' | 'Completed';
}

export async function listOrders(): Promise<Order[]> {
  return GET<Order[]>('/orders');
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  return POST<Order>('/orders', data);
}
```

### 2. Helpers (helpers/formatters.ts)

```typescript
export function formatOrderStatus(status: Order['status']): string {
  const labels = { Open: 'Pendente', InProgress: 'Em Andamento' };
  return labels[status];
}

export function getStatusColor(status: Order['status']): string {
  const colors = { Open: 'warning', InProgress: 'info' };
  return colors[status];
}
```

### 3. Página (OrdersPage.vue)

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { listOrders, createOrder } from './integrations/api';
import { formatOrderStatus, getStatusColor } from './helpers/formatters';

const orders = ref([]);
const loading = ref(false);

async function loadOrders() {
  loading.value = true;
  try {
    orders.value = await listOrders();
  } finally {
    loading.value = false;
  }
}

onMounted(loadOrders);
</script>

<template>
  <div v-if="loading">Carregando...</div>
  <div v-else>
    <div v-for="order in orders" :key="order.id">
      {{ order.title }} - {{ formatOrderStatus(order.status) }}
    </div>
  </div>
</template>
```

**3 arquivos. Tudo claro e direto.**

---

## Comparação

### Abordagem Antiga (TanStack Query + Composables)

```
Component.vue (50 linhas)
  → useOrders.ts (30 linhas)
    → ordersService.ts (40 linhas)
      → client.ts (100 linhas)
        → fetch()

Total: 4 arquivos, 220 linhas, 3 camadas de abstração
```

### Abordagem Nova (Direta)

```
OrdersPage.vue (100 linhas)
  → integrations/api.ts (50 linhas)
    → lib/api.ts (80 linhas)
      → fetch()

Total: 3 arquivos, 230 linhas, 1 camada
```

**Mesmas linhas, mas tudo mais claro e sem "magic"!**

---

## Cache (se realmente necessário)

```typescript
// Simple cache no componente
const ordersCache = ref<{ data: Order[], timestamp: number } | null>(null);

async function loadOrders() {
  // Cache de 2 minutos
  if (ordersCache.value && Date.now() - ordersCache.value.timestamp < 120000) {
    orders.value = ordersCache.value.data;
    return;
  }

  loading.value = true;
  try {
    orders.value = await listOrders();
    ordersCache.value = { data: orders.value, timestamp: Date.now() };
  } finally {
    loading.value = false;
  }
}
```

**6 linhas. Sem biblioteca.**

---

## Vantagens

✅ **Menos abstrações** - Código mais direto
✅ **Fácil de entender** - Sem "magic" de libraries
✅ **Fácil de debugar** - Stack trace simples
✅ **Menos dependências** - Pode remover TanStack Query
✅ **Auto-contido** - Cada feature independente
✅ **TypeScript nativo** - Tipos inline com funções

## Quando usar cada pasta

### `/integrations`
- Chamadas de API
- Tipos TypeScript
- Gerenciamento de session/storage

### `/helpers`
- Formatação de dados
- Validações
- Cálculos
- Transformações

### `/components`
- Componentes reutilizáveis DENTRO da feature
- Ex: OrderCard, OrderFilters, OrderForm

### Raiz da feature
- Página principal (OrdersPage.vue)
- Index/barrel exports se necessário

---

## Migração

### Remover
- ❌ `src/composables/*` (TanStack Query wrappers)
- ❌ `src/services/api/*` (Service layer desnecessária)
- ❌ `src/services/types/*` (Tipos vão inline)
- ❌ TanStack Query dependency

### Manter
- ✅ `src/lib/api.ts` (HTTP client simples)
- ✅ PrimeVue components
- ✅ Vue Router
- ✅ Toast notifications

### Criar
- ✅ `src/features/*` (Nova estrutura)

---

## Resultado Final

**De:**
```
5 arquivos → 1 fetch
3 camadas de abstração
TanStack Query "magic"
```

**Para:**
```
2-3 arquivos → 1 fetch
0 camadas extras
fetch() direto
```

**Código mais simples, mais rápido, mais fácil de manter!**
