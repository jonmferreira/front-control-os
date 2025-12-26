import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { ordersService } from '@/services/api/orders';
import type {
  CreateOrderRequest,
  UpdateOrderRequest,
  ChangeStatusRequest,
  ListOrdersParams,
} from '@/services/types/order.types';

const ORDERS_QUERY_KEY = ['orders'];

export function useOrders(params?: ListOrdersParams) {
  return useQuery({
    queryKey: computed(() => [...ORDERS_QUERY_KEY, params]),
    queryFn: () => ordersService.list(params),
    staleTime: 1000 * 60 * 2,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: computed(() => [...ORDERS_QUERY_KEY, id]),
    queryFn: () => ordersService.getById(id),
    enabled: computed(() => !!id),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => ordersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderRequest }) =>
      ordersService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, variables.id] });
    },
  });
}

export function useChangeOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangeStatusRequest }) =>
      ordersService.changeStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, variables.id] });
    },
  });
}
