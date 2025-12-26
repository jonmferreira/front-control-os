export enum OrderStatus {
  Open = 'Open',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Rejected = 'Rejected',
}

export interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  assignedTechnician?: string;
  status: OrderStatus;
  openedAt: string;
  completedAt?: string;
  rejectedAt?: string;
  closingNotes?: string;
}

export interface CreateOrderRequest {
  title: string;
  description: string;
  assignedTechnician?: string;
}

export interface UpdateOrderRequest {
  title?: string;
  description?: string;
  assignedTechnician?: string;
}

export interface ChangeStatusRequest {
  newStatus: OrderStatus;
  closingNotes?: string;
}

export interface ListOrdersParams {
  status?: OrderStatus;
  technicianId?: string;
}
