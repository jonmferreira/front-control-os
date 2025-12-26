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

export interface CreateTemplateRequest {
  title: string;
  items: Array<{
    description: string;
    displayOrder: number;
    defaultOutcome?: 'Approved' | 'Rejected' | 'NotApplicable';
    customInputComponentId?: string;
  }>;
}

export interface ChecklistResponseRequest {
  orderId: string;
  templateId: string;
  items: Array<{
    templateItemId: string;
    outcome: 'Approved' | 'Rejected' | 'NotApplicable';
    observations?: string;
    customInputPayload?: Record<string, unknown>;
  }>;
}
