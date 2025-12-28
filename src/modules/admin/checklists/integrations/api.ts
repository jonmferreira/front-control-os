import { apiRequest } from '@/services/api/client';
import type {
  ChecklistTemplate,
  CreateChecklistTemplatePayload
} from '../types';

/**
 * Busca todos os templates de checklist
 * Endpoint: GET /api/checklist-templates
 */
export async function fetchTemplates(): Promise<ChecklistTemplate[]> {
  const data = await apiRequest<ChecklistTemplate[]>('/api/checklist-templates');
  return data;
}

/**
 * Busca um template específico por ID
 * Endpoint: GET /api/checklist-templates/{id}
 */
export async function fetchTemplateById(id: string): Promise<ChecklistTemplate> {
  const data = await apiRequest<ChecklistTemplate>(`/api/checklist-templates/${id}`);
  return data;
}

/**
 * Cria um novo template de checklist
 * Endpoint: POST /api/checklist-templates
 */
export async function createTemplate(payload: CreateChecklistTemplatePayload): Promise<ChecklistTemplate> {
  const data = await apiRequest<ChecklistTemplate>('/api/checklist-templates', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return data;
}
