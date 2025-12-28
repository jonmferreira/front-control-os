import { apiRequest } from '@/services/api/client';
import type { ServiceOrder, ChecklistItem } from '../types';

/**
 * Busca todas as ordens de serviço do técnico logado
 */
export async function fetchServiceOrders(): Promise<ServiceOrder[]> {
  const data = await apiRequest<ServiceOrder[]>('/service-orders');
  return data;
}

/**
 * Busca uma ordem de serviço específica por ID
 */
export async function fetchServiceOrderById(id: string): Promise<ServiceOrder> {
  const data = await apiRequest<ServiceOrder>(`/service-orders/${id}`);
  return data;
}

/**
 * Busca os itens de checklist de uma OS específica
 */
export async function fetchChecklistItems(serviceOrderId: string): Promise<ChecklistItem[]> {
  const data = await apiRequest<ChecklistItem[]>(`/service-orders/${serviceOrderId}/checklist-items`);
  return data;
}

/**
 * Inicia execução de uma OS
 */
export async function startServiceOrder(id: string): Promise<void> {
  await apiRequest<void>(`/service-orders/${id}/start`, {
    method: 'POST'
  });
}

/**
 * Atualiza um item de checklist
 */
export async function updateChecklistItem(
  serviceOrderId: string,
  itemId: string,
  data: Partial<ChecklistItem>
): Promise<ChecklistItem> {
  const result = await apiRequest<ChecklistItem>(
    `/service-orders/${serviceOrderId}/checklist-items/${itemId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data)
    }
  );
  return result;
}

/**
 * Marca um item de checklist como completo
 */
export async function completeChecklistItem(
  serviceOrderId: string,
  itemId: string,
  value: string | number | boolean | null
): Promise<ChecklistItem> {
  return updateChecklistItem(serviceOrderId, itemId, {
    value,
    completed: true,
    completedAt: new Date().toISOString()
  });
}

/**
 * Finaliza uma ordem de serviço
 */
export async function completeServiceOrder(id: string): Promise<void> {
  await apiRequest<void>(`/service-orders/${id}/complete`, {
    method: 'POST'
  });
}
