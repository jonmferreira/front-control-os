import { apiRequest } from './client';
import type {
  ChecklistTemplate,
  CreateTemplateRequest,
  ChecklistResponseRequest,
} from '../types/checklist.types';

export const checklistsService = {
  async listTemplates(): Promise<ChecklistTemplate[]> {
    return apiRequest<ChecklistTemplate[]>('/checklist-templates');
  },

  async getTemplate(id: string): Promise<ChecklistTemplate> {
    return apiRequest<ChecklistTemplate>(`/checklist-templates/${id}`);
  },

  async createTemplate(data: CreateTemplateRequest): Promise<ChecklistTemplate> {
    return apiRequest<ChecklistTemplate>('/checklist-templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async submitResponse(data: ChecklistResponseRequest): Promise<void> {
    return apiRequest<void>('/checklist-responses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
