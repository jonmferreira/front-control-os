# Diretrizes para Agentes - Control OS Frontend

## Arquitetura de Módulos

Ao trabalhar neste projeto, sempre siga a estrutura modular definida abaixo.

## Estrutura Padrão de um Módulo

Cada feature deve estar em `src/modules/{perfil}/{feature}/` com as seguintes pastas:

```
src/modules/{perfil}/{feature}/
├── components/      # Componentes Vue do módulo
├── integrations/    # Chamadas de API
├── helpers/         # Funções auxiliares
├── mocks/           # Dados mockados
└── types/           # Tipos TypeScript
```

### Perfis Disponíveis

1. **technician** - Funcionalidades para técnicos
2. **analytics** - Funcionalidades para analistas de dados
3. **admin** - Funcionalidades administrativas

## Diretrizes de Implementação

### 1. Criando um Novo Módulo

```bash
src/modules/
└── {perfil}/
    └── {feature}/
        ├── components/
        ├── integrations/
        ├── helpers/
        ├── mocks/
        └── types/
```

**Exemplo:**
```bash
src/modules/technician/service-orders/
```

### 2. Ordem de Desenvolvimento

1. **Definir tipos** (`/types`) - Sempre comece definindo interfaces
2. **Criar mocks** (`/mocks`) - Para desenvolvimento isolado
3. **Desenvolver componentes** (`/components`) - UI com dados mockados
4. **Implementar integrações** (`/integrations`) - Substituir mocks por API real
5. **Adicionar helpers** (`/helpers`) - Conforme necessário

### 3. Padrão de Arquivos

#### `/types/index.ts`
```typescript
export interface ServiceOrder {
  id: string;
  title: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'completed';
}
```

#### `/mocks/index.ts`
```typescript
import type { ServiceOrder } from '../types';

export const mockServiceOrders: ServiceOrder[] = [
  { id: '1', title: 'OS 001', createdAt: '2025-01-15', status: 'pending' }
];
```

#### `/integrations/api.ts`
```typescript
import { apiClient } from '@/lib/api';
import type { ServiceOrder } from '../types';

export async function fetchServiceOrders(): Promise<ServiceOrder[]> {
  const { data } = await apiClient.get('/service-orders');
  return data;
}
```

#### `/components/ServiceOrderTable.vue`
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchServiceOrders } from '../integrations/api';
import type { ServiceOrder } from '../types';

const orders = ref<ServiceOrder[]>([]);

onMounted(async () => {
  orders.value = await fetchServiceOrders();
});
</script>
```

### 4. Controle de Acesso por Perfil

Sempre verifique permissões:

**No Router:**
```typescript
{
  path: '/technician/service-orders',
  meta: { requiresAuth: true, allowedRoles: ['tecnico'] }
}
```

**No Componente:**
```typescript
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
if (!authStore.hasRole('tecnico')) {
  // Redirecionar ou esconder feature
}
```

**No Menu:**
```vue
<MenuItem
  v-if="authStore.hasRole('tecnico')"
  label="Minhas OS"
  to="/service-orders"
/>
```

### 5. Regras de Negócio por Perfil

#### Técnico (`tecnico`)
- ✅ Ver e executar OS
- ❌ Ver dashboards
- ❌ Cadastrar checklists

#### Analista (`analista`)
- ✅ Ver dashboards e gráficos
- ❌ Executar OS
- ❌ Cadastrar checklists

#### Administrador (`administrador`)
- ✅ Cadastrar checklists
- ✅ Gerenciar usuários
- ❌ Ver dashboards
- ❌ Executar OS

## Checklist de Implementação

Ao criar/modificar um módulo:

- [ ] Tipos definidos em `/types`
- [ ] Mocks criados em `/mocks` (se necessário)
- [ ] Integração com API em `/integrations`
- [ ] Componentes organizados em `/components`
- [ ] Helpers em `/helpers` (se necessário)
- [ ] Rota com permissões corretas no router
- [ ] Menu filtra por perfil usando `hasRole()`
- [ ] Guards impedem acesso não autorizado

## Migração de Código Legado

Ao encontrar código fora da estrutura modular:

1. Identificar o perfil relacionado
2. Criar estrutura de módulo apropriada
3. Mover arquivos para pastas corretas
4. Atualizar imports
5. Adicionar tipos se não existirem
6. Testar funcionalidade

**Exemplo de migração:**
```
# Antes
src/views/settings/sections/ServiceOrdersOverview.vue

# Depois
src/modules/analytics/service-orders/
├── components/
│   └── ServiceOrdersOverview.vue
├── integrations/
│   └── api.ts
├── types/
│   └── index.ts
└── mocks/
    └── index.ts
```

## Comandos Úteis

```bash
# Estrutura de um novo módulo
mkdir -p src/modules/{perfil}/{feature}/{components,integrations,helpers,mocks,types}

# Exemplo real
mkdir -p src/modules/technician/service-orders/{components,integrations,helpers,mocks,types}
```
