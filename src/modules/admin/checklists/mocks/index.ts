import type { ChecklistTemplate, ChecklistTemplateItem, ChecklistCategory } from '../types';
import { ChecklistInputType } from '@/modules/technician/service-orders/types';

/**
 * Mock de Categorias de Checklist
 */
export const mockChecklistCategories: ChecklistCategory[] = [
  {
    id: 'cat-1',
    name: 'Instalação de Rede',
    description: 'Templates para instalação e configuração de infraestrutura de rede',
    templatesCount: 3
  },
  {
    id: 'cat-2',
    name: 'Manutenção Preventiva',
    description: 'Templates para manutenção preventiva de equipamentos',
    templatesCount: 2
  },
  {
    id: 'cat-3',
    name: 'Segurança',
    description: 'Templates relacionados a segurança da informação',
    templatesCount: 1
  },
  {
    id: 'cat-4',
    name: 'Configuração',
    description: 'Templates para configuração de sistemas e equipamentos',
    templatesCount: 2
  }
];

/**
 * Mock de Templates de Checklist
 */
export const mockChecklistTemplates: ChecklistTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Instalação de Infraestrutura de Rede',
    description: 'Checklist completo para instalação de pontos de rede em edifícios',
    category: 'Instalação de Rede',
    isActive: true,
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2025-12-27T15:30:00Z',
    createdBy: 'admin-001',
    itemsCount: 12,
    usageCount: 45
  },
  {
    id: 'tpl-2',
    name: 'Configuração de Switch',
    description: 'Procedimento padrão para configuração de switches de rede',
    category: 'Instalação de Rede',
    isActive: true,
    createdAt: '2025-12-18T14:00:00Z',
    updatedAt: '2025-12-25T11:20:00Z',
    createdBy: 'admin-001',
    itemsCount: 8,
    usageCount: 32
  },
  {
    id: 'tpl-3',
    name: 'Cabeamento Estruturado',
    description: 'Verificação de instalação de cabeamento estruturado',
    category: 'Instalação de Rede',
    isActive: true,
    createdAt: '2025-12-15T09:00:00Z',
    updatedAt: '2025-12-15T09:00:00Z',
    createdBy: 'admin-002',
    itemsCount: 10,
    usageCount: 28
  },
  {
    id: 'tpl-4',
    name: 'Manutenção de Servidor',
    description: 'Checklist de manutenção preventiva para servidores',
    category: 'Manutenção Preventiva',
    isActive: true,
    createdAt: '2025-12-10T13:00:00Z',
    updatedAt: '2025-12-22T16:45:00Z',
    createdBy: 'admin-001',
    itemsCount: 15,
    usageCount: 18
  },
  {
    id: 'tpl-5',
    name: 'Verificação de Backup',
    description: 'Verificação de sistema de backup e restore',
    category: 'Manutenção Preventiva',
    isActive: true,
    createdAt: '2025-12-08T11:00:00Z',
    updatedAt: '2025-12-20T10:15:00Z',
    createdBy: 'admin-002',
    itemsCount: 6,
    usageCount: 52
  },
  {
    id: 'tpl-6',
    name: 'Auditoria de Firewall',
    description: 'Checklist para auditoria de configuração de firewall',
    category: 'Segurança',
    isActive: true,
    createdAt: '2025-12-05T08:00:00Z',
    updatedAt: '2025-12-26T14:30:00Z',
    createdBy: 'admin-001',
    itemsCount: 20,
    usageCount: 12
  },
  {
    id: 'tpl-7',
    name: 'Configuração de Roteador',
    description: 'Procedimento para configuração de roteadores',
    category: 'Configuração',
    isActive: true,
    createdAt: '2025-12-01T15:00:00Z',
    updatedAt: '2025-12-15T09:20:00Z',
    createdBy: 'admin-002',
    itemsCount: 11,
    usageCount: 25
  },
  {
    id: 'tpl-8',
    name: 'Setup de Access Point',
    description: 'Configuração e instalação de pontos de acesso WiFi',
    category: 'Configuração',
    isActive: false,
    createdAt: '2025-11-28T12:00:00Z',
    updatedAt: '2025-12-10T11:00:00Z',
    createdBy: 'admin-001',
    itemsCount: 7,
    usageCount: 8
  }
];

/**
 * Mock de Itens de Template
 */
export const mockTemplateItems: ChecklistTemplateItem[] = [
  // Items para template "Instalação de Infraestrutura de Rede" (tpl-1)
  {
    id: 'item-1',
    templateId: 'tpl-1',
    description: 'Verificar pontos de rede existentes',
    inputType: ChecklistInputType.NUMBER,
    required: true,
    order: 1,
    helpText: 'Conte quantos pontos de rede já existem no local'
  },
  {
    id: 'item-2',
    templateId: 'tpl-1',
    description: 'Testar conectividade de cada ponto',
    inputType: ChecklistInputType.BOOLEAN,
    required: true,
    order: 2,
    helpText: 'Verificar se todos os pontos têm conectividade'
  },
  {
    id: 'item-3',
    templateId: 'tpl-1',
    description: 'Município da instalação',
    inputType: ChecklistInputType.SELECT_MUNICIPALITY,
    required: true,
    options: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre'],
    order: 3
  },
  {
    id: 'item-4',
    templateId: 'tpl-1',
    description: 'Status do equipamento',
    inputType: ChecklistInputType.SELECT_ACTIVE,
    required: true,
    options: ['Ativo', 'Inativo'],
    defaultValue: 'Ativo',
    order: 4
  },
  {
    id: 'item-5',
    templateId: 'tpl-1',
    description: 'Data de conclusão prevista',
    inputType: ChecklistInputType.DATE,
    required: true,
    order: 5
  },
  {
    id: 'item-6',
    templateId: 'tpl-1',
    description: 'Observações gerais',
    inputType: ChecklistInputType.TEXT,
    required: false,
    order: 6,
    helpText: 'Anote qualquer informação relevante sobre a instalação'
  },

  // Items para template "Manutenção de Servidor" (tpl-4)
  {
    id: 'item-7',
    templateId: 'tpl-4',
    description: 'Temperatura do servidor (°C)',
    inputType: ChecklistInputType.NUMBER,
    required: true,
    order: 1,
    helpText: 'Verificar temperatura do hardware'
  },
  {
    id: 'item-8',
    templateId: 'tpl-4',
    description: 'Sistema operacional atualizado',
    inputType: ChecklistInputType.BOOLEAN,
    required: true,
    order: 2
  },
  {
    id: 'item-9',
    templateId: 'tpl-4',
    description: 'Próxima manutenção programada',
    inputType: ChecklistInputType.DATE,
    required: true,
    order: 3
  },
  {
    id: 'item-10',
    templateId: 'tpl-4',
    description: 'Notas da manutenção',
    inputType: ChecklistInputType.TEXT,
    required: false,
    order: 4
  }
];

/**
 * Função auxiliar para obter items por templateId
 */
export function getItemsByTemplateId(templateId: string): ChecklistTemplateItem[] {
  return mockTemplateItems.filter(item => item.templateId === templateId);
}

/**
 * Função auxiliar para obter templates por categoria
 */
export function getTemplatesByCategory(category: string): ChecklistTemplate[] {
  return mockChecklistTemplates.filter(template => template.category === category);
}
