import { apiRequest } from '@/services/api/client';
import type {
  ChecklistTemplate,
  ChecklistTemplateItem,
  ChecklistCategory,
  CreateChecklistTemplatePayload,
  CreateTemplateItemPayload,
  ChecklistTemplateHistory,
  ChecklistTemplateUsage
} from '../types';

/**
 * Busca todas as categorias de checklist
 */
export async function fetchCategories(): Promise<ChecklistCategory[]> {
  const data = await apiRequest<ChecklistCategory[]>('/admin/checklist-categories');
  return data;
}

/**
 * Cria uma nova categoria
 */
export async function createCategory(name: string, description?: string): Promise<ChecklistCategory> {
  const data = await apiRequest<ChecklistCategory>('/admin/checklist-categories', {
    method: 'POST',
    body: JSON.stringify({ name, description })
  });
  return data;
}

/**
 * Busca todos os templates de checklist
 */
export async function fetchTemplates(filters?: {
  category?: string;
  isActive?: boolean;
  search?: string;
}): Promise<ChecklistTemplate[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.append('category', filters.category);
  if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
  if (filters?.search) params.append('search', filters.search);

  const queryString = params.toString();
  const url = queryString ? `/admin/checklist-templates?${queryString}` : '/admin/checklist-templates';

  const data = await apiRequest<ChecklistTemplate[]>(url);
  return data;
}

/**
 * Busca um template específico por ID
 */
export async function fetchTemplateById(id: string): Promise<ChecklistTemplate> {
  const data = await apiRequest<ChecklistTemplate>(`/admin/checklist-templates/${id}`);
  return data;
}

/**
 * Cria um novo template de checklist
 */
export async function createTemplate(payload: CreateChecklistTemplatePayload): Promise<ChecklistTemplate> {
  const data = await apiRequest<ChecklistTemplate>('/admin/checklist-templates', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data;
}

/**
 * Atualiza um template existente
 */
export async function updateTemplate(
  id: string,
  payload: Partial<CreateChecklistTemplatePayload>
): Promise<ChecklistTemplate> {
  const data = await apiRequest<ChecklistTemplate>(`/admin/checklist-templates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
  return data;
}

/**
 * Deleta um template
 */
export async function deleteTemplate(id: string): Promise<void> {
  await apiRequest<void>(`/admin/checklist-templates/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Ativa ou desativa um template
 */
export async function toggleTemplateStatus(id: string, isActive: boolean): Promise<ChecklistTemplate> {
  const data = await apiRequest<ChecklistTemplate>(`/admin/checklist-templates/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ isActive })
  });
  return data;
}

/**
 * Busca os itens de um template
 */
export async function fetchTemplateItems(templateId: string): Promise<ChecklistTemplateItem[]> {
  const data = await apiRequest<ChecklistTemplateItem[]>(`/admin/checklist-templates/${templateId}/items`);
  return data;
}

/**
 * Adiciona um novo item ao template
 */
export async function addTemplateItem(
  templateId: string,
  payload: CreateTemplateItemPayload
): Promise<ChecklistTemplateItem> {
  const data = await apiRequest<ChecklistTemplateItem>(`/admin/checklist-templates/${templateId}/items`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data;
}

/**
 * Atualiza um item do template
 */
export async function updateTemplateItem(
  templateId: string,
  itemId: string,
  payload: Partial<CreateTemplateItemPayload>
): Promise<ChecklistTemplateItem> {
  const data = await apiRequest<ChecklistTemplateItem>(
    `/admin/checklist-templates/${templateId}/items/${itemId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }
  );
  return data;
}

/**
 * Remove um item do template
 */
export async function deleteTemplateItem(templateId: string, itemId: string): Promise<void> {
  await apiRequest<void>(`/admin/checklist-templates/${templateId}/items/${itemId}`, {
    method: 'DELETE'
  });
}

/**
 * Reordena os itens de um template
 */
export async function reorderTemplateItems(
  templateId: string,
  itemIds: string[]
): Promise<ChecklistTemplateItem[]> {
  const data = await apiRequest<ChecklistTemplateItem[]>(
    `/admin/checklist-templates/${templateId}/items/reorder`,
    {
      method: 'POST',
      body: JSON.stringify({ itemIds })
    }
  );
  return data;
}

/**
 * Busca histórico de alterações de um template
 */
export async function fetchTemplateHistory(templateId: string): Promise<ChecklistTemplateHistory[]> {
  const data = await apiRequest<ChecklistTemplateHistory[]>(
    `/admin/checklist-templates/${templateId}/history`
  );
  return data;
}

/**
 * Busca estatísticas de uso de um template
 */
export async function fetchTemplateUsage(templateId: string): Promise<ChecklistTemplateUsage> {
  const data = await apiRequest<ChecklistTemplateUsage>(`/admin/checklist-templates/${templateId}/usage`);
  return data;
}

/**
 * Duplica um template existente
 */
export async function duplicateTemplate(id: string, newName: string): Promise<ChecklistTemplate> {
  const data = await apiRequest<ChecklistTemplate>(`/admin/checklist-templates/${id}/duplicate`, {
    method: 'POST',
    body: JSON.stringify({ name: newName })
  });
  return data;
}
