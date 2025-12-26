import type { Order } from '../integrations/api';

// ============================================
// FORMATAÇÃO E HELPERS
// ============================================

export function formatOrderStatus(status: Order['status']): string {
  const labels: Record<Order['status'], string> = {
    Open: 'Pendente',
    InProgress: 'Em Andamento',
    Completed: 'Finalizada',
    Rejected: 'Rejeitada',
  };
  return labels[status] || status;
}

export function getStatusColor(status: Order['status']): string {
  const colors: Record<Order['status'], string> = {
    Open: 'warning',
    InProgress: 'info',
    Completed: 'success',
    Rejected: 'danger',
  };
  return colors[status] || 'secondary';
}

export function canStartOrder(order: Order): boolean {
  return order.status === 'Open';
}

export function canCompleteOrder(order: Order): boolean {
  return order.status === 'InProgress';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function groupOrdersByStatus(orders: Order[]) {
  return {
    open: orders.filter(o => o.status === 'Open'),
    inProgress: orders.filter(o => o.status === 'InProgress'),
    completed: orders.filter(o => o.status === 'Completed'),
    rejected: orders.filter(o => o.status === 'Rejected'),
  };
}
