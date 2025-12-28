/**
 * Tipos para gerenciamento de Checklists (Admin)
 */

import type { ChecklistInputType } from '@/modules/technician/service-orders/types';

/**
 * Template de Checklist
 */
export interface ChecklistTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  itemsCount: number;
  usageCount: number; // Quantas OS usam este template
}

/**
 * Item de template de checklist
 */
export interface ChecklistTemplateItem {
  id: string;
  templateId: string;
  description: string;
  inputType: ChecklistInputType;
  required: boolean;
  options?: string[]; // Para selects
  defaultValue?: string | number | boolean;
  order: number;
  helpText?: string;
}

/**
 * Categoria de checklist
 */
export interface ChecklistCategory {
  id: string;
  name: string;
  description?: string;
  templatesCount: number;
}

/**
 * Payload para criar/atualizar template
 */
export interface CreateChecklistTemplatePayload {
  name: string;
  description?: string;
  category: string;
  isActive: boolean;
  items: Omit<ChecklistTemplateItem, 'id' | 'templateId'>[];
}

/**
 * Payload para criar/atualizar item de template
 */
export interface CreateTemplateItemPayload {
  description: string;
  inputType: ChecklistInputType;
  required: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
  order: number;
  helpText?: string;
}

/**
 * Histórico de alterações no template
 */
export interface ChecklistTemplateHistory {
  id: string;
  templateId: string;
  action: 'created' | 'updated' | 'activated' | 'deactivated' | 'deleted';
  changes: Record<string, unknown>;
  userId: string;
  userName: string;
  timestamp: string;
}

/**
 * Estatísticas de uso de template
 */
export interface ChecklistTemplateUsage {
  templateId: string;
  totalUsages: number;
  activeUsages: number;
  completedUsages: number;
  averageCompletionTime: number;
  lastUsedAt?: string;
}
