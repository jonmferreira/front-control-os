import { GET, POST } from '@/lib/api';

// ============================================
// TIPOS
// ============================================

export interface ChecklistTemplate {
  id: string;
  title: string;
  publishedBy: string;
  isPublished: boolean;
  updatedAt: string;
  items: ChecklistTemplateItem[];
}

export interface ChecklistTemplateItem {
  id: string;
  description: string;
  displayOrder: number;
  defaultOutcome?: 'Approved' | 'Rejected' | 'NotApplicable';
  customInputComponentId?: string;
}

export interface CreateTemplateData {
  title: string;
  items: Array<{
    description: string;
    displayOrder: number;
    defaultOutcome?: 'Approved' | 'Rejected' | 'NotApplicable';
    customInputComponentId?: string;
  }>;
}

export interface ChecklistResponseData {
  orderId: string;
  templateId: string;
  items: Array<{
    templateItemId: string;
    outcome: 'Approved' | 'Rejected' | 'NotApplicable';
    observations?: string;
    customInputPayload?: Record<string, unknown>;
  }>;
}

// ============================================
// API FUNCTIONS
// ============================================

export async function listTemplates(): Promise<ChecklistTemplate[]> {
  return GET<ChecklistTemplate[]>('/checklist-templates');
}

export async function getTemplate(id: string): Promise<ChecklistTemplate> {
  return GET<ChecklistTemplate>(`/checklist-templates/${id}`);
}

export async function createTemplate(data: CreateTemplateData): Promise<ChecklistTemplate> {
  return POST<ChecklistTemplate>('/checklist-templates', data);
}

export async function submitChecklistResponse(data: ChecklistResponseData): Promise<void> {
  return POST<void>('/checklist-responses', data);
}
