import { apiRequest } from './client';
import type {
  ServiceOrder,
  CreateOrderRequest,
  UpdateOrderRequest,
  ChangeStatusRequest,
  ListOrdersParams,
} from '../types/order.types';

export const ordersService = {
  async list(params?: ListOrdersParams): Promise<ServiceOrder[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.set('status', params.status);
    if (params?.technicianId) queryParams.set('technicianId', params.technicianId);

    const query = queryParams.toString();
    return apiRequest<ServiceOrder[]>(`/orders${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<ServiceOrder> {
    return apiRequest<ServiceOrder>(`/orders/${id}`);
  },

  async create(data: CreateOrderRequest): Promise<ServiceOrder> {
    return apiRequest<ServiceOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: UpdateOrderRequest): Promise<ServiceOrder> {
    return apiRequest<ServiceOrder>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async changeStatus(id: string, data: ChangeStatusRequest): Promise<void> {
    return apiRequest<void>(`/orders/${id}/status`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
