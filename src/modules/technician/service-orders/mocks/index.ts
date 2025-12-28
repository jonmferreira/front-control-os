import type { ServiceOrder, ChecklistItem } from '../types';
import { ServiceOrderStatus, ServiceOrderPriority, ChecklistInputType } from '../types';

/**
 * Mock de Ordens de Serviço
 */
export const mockServiceOrders: ServiceOrder[] = [
  {
    id: '1',
    title: 'Instalação de rede - Edifício Central',
    description: 'Instalação completa de infraestrutura de rede no 3º andar',
    status: ServiceOrderStatus.IN_PROGRESS,
    priority: ServiceOrderPriority.HIGH,
    createdAt: '2025-12-27T08:00:00Z',
    updatedAt: '2025-12-28T10:30:00Z',
    dueDate: '2025-12-30T18:00:00Z',
    technicianId: 'tech-001',
    technicianName: 'João Silva',
    location: 'Edifício Central - 3º Andar',
    checklistsCompleted: 5,
    checklistsTotal: 12
  },
  {
    id: '2',
    title: 'Manutenção preventiva - Servidor Principal',
    description: 'Verificação de hardware e atualização de sistema',
    status: ServiceOrderStatus.PENDING,
    priority: ServiceOrderPriority.MEDIUM,
    createdAt: '2025-12-28T09:00:00Z',
    updatedAt: '2025-12-28T09:00:00Z',
    dueDate: '2025-12-29T17:00:00Z',
    location: 'Sala de Servidores - Subsolo',
    checklistsCompleted: 0,
    checklistsTotal: 8
  },
  {
    id: '3',
    title: 'Configuração de firewall - Filial Norte',
    description: 'Atualização de regras e políticas de segurança',
    status: ServiceOrderStatus.COMPLETED,
    priority: ServiceOrderPriority.URGENT,
    createdAt: '2025-12-26T14:00:00Z',
    updatedAt: '2025-12-27T16:45:00Z',
    dueDate: '2025-12-27T18:00:00Z',
    technicianId: 'tech-001',
    technicianName: 'João Silva',
    location: 'Filial Norte - TI',
    checklistsCompleted: 6,
    checklistsTotal: 6
  },
  {
    id: '4',
    title: 'Troca de cabos - Sala de reuniões',
    description: 'Substituição de cabos de rede danificados',
    status: ServiceOrderStatus.PENDING,
    priority: ServiceOrderPriority.LOW,
    createdAt: '2025-12-28T11:00:00Z',
    updatedAt: '2025-12-28T11:00:00Z',
    location: 'Sala de Reuniões 2B',
    checklistsCompleted: 0,
    checklistsTotal: 4
  }
];

/**
 * Mock de Itens de Checklist para uma OS específica
 */
export const mockChecklistItems: ChecklistItem[] = [
  {
    id: 'cl-1',
    serviceOrderId: '1',
    description: 'Verificar pontos de rede existentes',
    inputType: ChecklistInputType.NUMBER,
    required: true,
    value: 24,
    completed: true,
    completedAt: '2025-12-28T09:15:00Z',
    order: 1
  },
  {
    id: 'cl-2',
    serviceOrderId: '1',
    description: 'Testar conectividade de cada ponto',
    inputType: ChecklistInputType.BOOLEAN,
    required: true,
    value: true,
    completed: true,
    completedAt: '2025-12-28T09:45:00Z',
    order: 2
  },
  {
    id: 'cl-3',
    serviceOrderId: '1',
    description: 'Município da instalação',
    inputType: ChecklistInputType.SELECT_MUNICIPALITY,
    required: true,
    options: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba'],
    value: 'São Paulo',
    completed: true,
    completedAt: '2025-12-28T10:00:00Z',
    order: 3
  },
  {
    id: 'cl-4',
    serviceOrderId: '1',
    description: 'Status do equipamento após instalação',
    inputType: ChecklistInputType.SELECT_ACTIVE,
    required: true,
    options: ['Ativo', 'Inativo'],
    value: 'Ativo',
    completed: true,
    completedAt: '2025-12-28T10:15:00Z',
    order: 4
  },
  {
    id: 'cl-5',
    serviceOrderId: '1',
    description: 'Observações adicionais',
    inputType: ChecklistInputType.TEXT,
    required: false,
    value: 'Instalação concluída sem intercorrências',
    completed: true,
    completedAt: '2025-12-28T10:30:00Z',
    order: 5
  },
  {
    id: 'cl-6',
    serviceOrderId: '1',
    description: 'Data de conclusão prevista',
    inputType: ChecklistInputType.DATE,
    required: true,
    value: null,
    completed: false,
    order: 6
  },
  {
    id: 'cl-7',
    serviceOrderId: '1',
    description: 'Número de switches instalados',
    inputType: ChecklistInputType.NUMBER,
    required: true,
    value: null,
    completed: false,
    order: 7
  }
];

/**
 * Função auxiliar para obter checklist items por serviceOrderId
 */
export function getChecklistItemsByServiceOrderId(serviceOrderId: string): ChecklistItem[] {
  return mockChecklistItems.filter(item => item.serviceOrderId === serviceOrderId);
}
