# Diretrizes de Arquitetura - Control OS Frontend

## Estrutura de Módulos

O projeto segue uma arquitetura modular baseada em domínios de negócio. Cada módulo deve seguir a estrutura de pastas abaixo:

```
src/modules/
├── technician/           # Funcionalidades do perfil Técnico
│   └── service-orders/
│       ├── components/   # Componentes Vue específicos deste módulo
│       ├── integrations/ # Chamadas de API e integrações externas
│       ├── helpers/      # Funções auxiliares e utilitários
│       ├── mocks/        # Dados mockados para desenvolvimento/testes
│       └── types/        # Tipos TypeScript específicos do módulo
│
├── analytics/            # Funcionalidades do perfil Analista
│   └── service-orders/
│       ├── components/
│       ├── integrations/
│       ├── helpers/
│       ├── mocks/
│       └── types/
│
└── admin/                # Funcionalidades do perfil Administrador
    └── checklists/
        ├── components/
        ├── integrations/
        ├── helpers/
        ├── mocks/
        └── types/
```

## Responsabilidade das Pastas

### `/components`
Componentes Vue reutilizáveis dentro do módulo. Devem ser organizados por funcionalidade.

**Exemplo:**
```
components/
├── ServiceOrderTable.vue
├── ChecklistItem.vue
└── CustomInputRenderer.vue
```

### `/integrations`
Funções que fazem chamadas à API do backend. Cada arquivo deve agrupar endpoints relacionados.

**Exemplo:**
```
integrations/
├── api.ts              # Funções de chamada à API
└── websocket.ts        # Conexões WebSocket se necessário
```

**Padrão de código:**
```typescript
// integrations/api.ts
import { apiClient } from '@/lib/api';
import type { ServiceOrder } from '../types';

export async function fetchServiceOrders(): Promise<ServiceOrder[]> {
  const response = await apiClient.get('/service-orders');
  return response.data;
}
```

### `/helpers`
Funções utilitárias e auxiliares específicas do módulo.

**Exemplo:**
```
helpers/
├── formatters.ts       # Formatação de dados
├── validators.ts       # Validações
└── calculations.ts     # Cálculos específicos
```

### `/mocks`
Dados mockados para desenvolvimento e testes.

**Exemplo:**
```
mocks/
└── service-orders.ts   # Mock de dados de OS
```

### `/types`
Tipos e interfaces TypeScript específicas do módulo.

**Exemplo:**
```typescript
// types/index.ts
export interface ServiceOrder {
  id: string;
  title: string;
  createdAt: string;
  status: 'pending' | 'in_progress' | 'completed';
  technician?: {
    id: string;
    name: string;
  };
}

export interface ChecklistItem {
  id: string;
  description: string;
  inputType: 'text' | 'select_active' | 'select_municipality';
  value?: string | boolean;
}
```

## Perfis de Acesso

O sistema possui 3 perfis com funcionalidades bem separadas:

### 1. Técnico (`tecnico`)
- **Acessa:** Lista de OS e execução de checklists
- **Não acessa:** Gráficos, cadastros administrativos

### 2. Analista de Dados (`analista`)
- **Acessa:** Dashboards e gráficos analíticos
- **Não acessa:** Execução de OS, cadastros administrativos

### 3. Administrador (`administrador`)
- **Acessa:** Cadastro de checklists e usuários
- **Não acessa:** Execução de OS, dashboards analíticos

## Controle de Acesso

### Router Guards
Rotas devem ter meta tags definindo permissões:

```typescript
{
  path: '/service-orders',
  component: ServiceOrdersList,
  meta: {
    requiresAuth: true,
    allowedRoles: ['tecnico']
  }
}
```

### Menu Lateral
O menu deve filtrar opções baseado no perfil do usuário logado usando `authStore.hasRole()`.

## Boas Práticas

1. **Separação de Responsabilidades:** Cada pasta tem um propósito específico
2. **Tipagem Forte:** Sempre defina tipos em `/types` antes de implementar
3. **Mocks para Desenvolvimento:** Use `/mocks` durante desenvolvimento, migre para `/integrations` ao conectar com backend
4. **Componentes Pequenos:** Quebre componentes grandes em partes menores em `/components`
5. **DRY:** Helpers devem evitar duplicação de código
6. **Nomenclatura Clara:** Use nomes descritivos para arquivos e funções
