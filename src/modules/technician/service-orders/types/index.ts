/**
 * Status possíveis de uma Ordem de Serviço
 */
export enum ServiceOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Prioridade da Ordem de Serviço
 */
export enum ServiceOrderPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Tipo de input do ChecklistItem
 */
export enum ChecklistInputType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT_ACTIVE = 'select_active',
  SELECT_MUNICIPALITY = 'select_municipality',
  DATE = 'date',
  BOOLEAN = 'boolean'
}

/**
 * Interface para Ordem de Serviço
 */
export interface ServiceOrder {
  id: string;
  title: string;
  description?: string;
  status: ServiceOrderStatus;
  priority: ServiceOrderPriority;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  technicianId?: string;
  technicianName?: string;
  location?: string;
  checklistsCompleted: number;
  checklistsTotal: number;
}

/**
 * Interface para Item de Checklist
 */
export interface ChecklistItem {
  id: string;
  serviceOrderId: string;
  description: string;
  inputType: ChecklistInputType;
  required: boolean;
  value?: string | number | boolean | null;
  options?: string[]; // Para selects
  completed: boolean;
  completedAt?: string;
  order: number;
}

/**
 * Interface para resumo de checklist
 */
export interface ChecklistSummary {
  total: number;
  completed: number;
  pending: number;
  percentComplete: number;
}
