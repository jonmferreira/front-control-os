import type { ServiceOrder, ChecklistItem, ChecklistSummary } from '../types';
import { ServiceOrderStatus, ServiceOrderPriority } from '../types';

/**
 * Calcula o resumo de checklists de uma OS
 */
export function calculateChecklistSummary(items: ChecklistItem[]): ChecklistSummary {
  const total = items.length;
  const completed = items.filter(item => item.completed).length;
  const pending = total - completed;
  const percentComplete = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    pending,
    percentComplete
  };
}

/**
 * Formata data para exibição em português
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Formata data relativa (ex: "há 2 horas", "ontem")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `Há ${diffMins} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;

  return formatDate(dateString);
}

/**
 * Retorna label de status em português
 */
export function getStatusLabel(status: ServiceOrderStatus): string {
  const labels: Record<ServiceOrderStatus, string> = {
    [ServiceOrderStatus.PENDING]: 'Pendente',
    [ServiceOrderStatus.IN_PROGRESS]: 'Em Andamento',
    [ServiceOrderStatus.COMPLETED]: 'Concluída',
    [ServiceOrderStatus.CANCELLED]: 'Cancelada'
  };

  return labels[status] || status;
}

/**
 * Retorna severity do PrimeVue para cada status
 */
export function getStatusSeverity(status: ServiceOrderStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
  const severities: Record<ServiceOrderStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
    [ServiceOrderStatus.PENDING]: 'warn',
    [ServiceOrderStatus.IN_PROGRESS]: 'info',
    [ServiceOrderStatus.COMPLETED]: 'success',
    [ServiceOrderStatus.CANCELLED]: 'danger'
  };

  return severities[status] || 'secondary';
}

/**
 * Retorna label de prioridade em português
 */
export function getPriorityLabel(priority: ServiceOrderPriority): string {
  const labels: Record<ServiceOrderPriority, string> = {
    [ServiceOrderPriority.LOW]: 'Baixa',
    [ServiceOrderPriority.MEDIUM]: 'Média',
    [ServiceOrderPriority.HIGH]: 'Alta',
    [ServiceOrderPriority.URGENT]: 'Urgente'
  };

  return labels[priority] || priority;
}

/**
 * Retorna severity do PrimeVue para cada prioridade
 */
export function getPrioritySeverity(priority: ServiceOrderPriority): 'success' | 'info' | 'warn' | 'danger' {
  const severities: Record<ServiceOrderPriority, 'success' | 'info' | 'warn' | 'danger'> = {
    [ServiceOrderPriority.LOW]: 'success',
    [ServiceOrderPriority.MEDIUM]: 'info',
    [ServiceOrderPriority.HIGH]: 'warn',
    [ServiceOrderPriority.URGENT]: 'danger'
  };

  return severities[priority] || 'info';
}

/**
 * Calcula se a OS está atrasada
 */
export function isOverdue(serviceOrder: ServiceOrder): boolean {
  if (!serviceOrder.dueDate) return false;
  if (serviceOrder.status === ServiceOrderStatus.COMPLETED) return false;

  const dueDate = new Date(serviceOrder.dueDate);
  const now = new Date();

  return now > dueDate;
}

/**
 * Ordena OS por prioridade e data
 */
export function sortServiceOrders(orders: ServiceOrder[]): ServiceOrder[] {
  const priorityWeight: Record<ServiceOrderPriority, number> = {
    [ServiceOrderPriority.URGENT]: 4,
    [ServiceOrderPriority.HIGH]: 3,
    [ServiceOrderPriority.MEDIUM]: 2,
    [ServiceOrderPriority.LOW]: 1
  };

  return [...orders].sort((a, b) => {
    // Primeiro por prioridade
    const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Depois por data de criação (mais antiga primeiro)
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}
