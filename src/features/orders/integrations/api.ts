import { GET, POST, PUT } from '@/lib/api';

// ============================================
// TIPOS
// ============================================

export interface Order {
  id: string;
  title: string;
  description: string;
  assignedTechnician?: string;
  status: 'Open' | 'InProgress' | 'Completed' | 'Rejected';
  openedAt: string;
  completedAt?: string;
  rejectedAt?: string;
  closingNotes?: string;
}

export interface CreateOrderData {
  title: string;
  description: string;
  assignedTechnician?: string;
}

export interface UpdateOrderData {
  title?: string;
  description?: string;
  assignedTechnician?: string;
}

export interface ChangeStatusData {
  newStatus: 'Open' | 'InProgress' | 'Completed' | 'Rejected';
  closingNotes?: string;
}

export interface ListOrdersParams {
  status?: string;
  technicianId?: string;
}

// ============================================
// API FUNCTIONS
// ============================================

export async function listOrders(params?: ListOrdersParams): Promise<Order[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.technicianId) query.set('technicianId', params.technicianId);

  const queryString = query.toString();
  return GET<Order[]>(`/orders${queryString ? `?${queryString}` : ''}`);
}

export async function getOrder(id: string): Promise<Order> {
  return GET<Order>(`/orders/${id}`);
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  return POST<Order>('/orders', data);
}

export async function updateOrder(id: string, data: UpdateOrderData): Promise<Order> {
  return PUT<Order>(`/orders/${id}`, data);
}

export async function changeOrderStatus(id: string, data: ChangeStatusData): Promise<void> {
  return POST<void>(`/orders/${id}/status`, data);
}
