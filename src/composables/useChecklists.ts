import { computed } from 'vue';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { checklistsService } from '@/services/api/checklists';
import type {
  CreateTemplateRequest,
  ChecklistResponseRequest,
} from '@/services/types/checklist.types';

const TEMPLATES_QUERY_KEY = ['checklist-templates'];

export function useChecklistTemplates() {
  return useQuery({
    queryKey: TEMPLATES_QUERY_KEY,
    queryFn: () => checklistsService.listTemplates(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useChecklistTemplate(id: string) {
  return useQuery({
    queryKey: computed(() => [...TEMPLATES_QUERY_KEY, id]),
    queryFn: () => checklistsService.getTemplate(id),
    enabled: computed(() => !!id),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateChecklistTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTemplateRequest) => checklistsService.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEMPLATES_QUERY_KEY });
    },
  });
}

export function useSubmitChecklistResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChecklistResponseRequest) => checklistsService.submitResponse(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['orders', variables.orderId] });
    },
  });
}
