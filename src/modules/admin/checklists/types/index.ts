/**
 * Tipos para gerenciamento de Checklists (Admin)
 * Alinhado com backend: ChecklistTemplatesController.cs
 */

/**
 * Template de Checklist (Response do backend)
 */
export interface ChecklistTemplate {
  id: string;
  title: string;
  publishedBy: string;
  isPublished: boolean;
  updatedAt: string;
  items: ChecklistTemplateItem[];
}

/**
 * Item de template de checklist (Response do backend)
 */
export interface ChecklistTemplateItem {
  id: string;
  description: string;
  hasCustomInput: boolean;
  customInputComponentId?: string;
  defaultOutcome?: string; // "Approved" | "Rejected" | "NotApplicable"
  displayOrder: number;
}

/**
 * Payload para criar template (Request para backend)
 * Endpoint: POST /api/checklist-templates
 */
export interface CreateChecklistTemplatePayload {
  title: string;
  publishedBy: string;
  publishImmediately: boolean;
  items: CreateTemplateItemPayload[];
}

/**
 * Payload para criar item de template
 */
export interface CreateTemplateItemPayload {
  description: string;
  hasCustomInput: boolean;
  customInputComponentId?: string;
  defaultOutcome?: string; // "Approved" | "Rejected" | "NotApplicable"
  displayOrder: number;
}
