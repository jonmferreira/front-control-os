import type { ChecklistTemplate } from '../types';

/**
 * Mock de Templates de Checklist
 */
export const mockChecklistTemplates: ChecklistTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Instalação de Infraestrutura de Rede',
    publishedBy: 'admin-001',
    isPublished: true,
    updatedAt: '2025-12-27T15:30:00Z',
    items: [
      {
        id: 'item-1',
        description: 'Bloqueio de energia realizado',
        hasCustomInput: false,
        defaultOutcome: 'Approved',
        displayOrder: 0
      },
      {
        id: 'item-2',
        description: 'Fotos do painel antes da troca',
        hasCustomInput: false,
        defaultOutcome: undefined,
        displayOrder: 1
      },
      {
        id: 'item-3',
        description: 'Dados do equipamento',
        hasCustomInput: true,
        customInputComponentId: 'dadosCarro',
        defaultOutcome: 'NotApplicable',
        displayOrder: 2
      }
    ]
  },
  {
    id: 'tpl-2',
    title: 'Configuração de Switch',
    publishedBy: 'admin-001',
    isPublished: true,
    updatedAt: '2025-12-25T11:20:00Z',
    items: [
      {
        id: 'item-4',
        description: 'Verificar conectividade de todas as portas',
        hasCustomInput: false,
        defaultOutcome: 'Approved',
        displayOrder: 0
      }
    ]
  },
  {
    id: 'tpl-3',
    title: 'Manutenção de Servidor',
    publishedBy: 'admin-002',
    isPublished: true,
    updatedAt: '2025-12-22T16:45:00Z',
    items: [
      {
        id: 'item-6',
        description: 'Temperatura do servidor dentro dos limites',
        hasCustomInput: false,
        defaultOutcome: 'Approved',
        displayOrder: 0
      }
    ]
  }
];

export function getTemplateById(id: string) {
  return mockChecklistTemplates.find(t => t.id === id);
}
