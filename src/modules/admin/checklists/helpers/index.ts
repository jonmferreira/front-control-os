import type { ChecklistTemplate, ChecklistTemplateItem, CreateChecklistTemplatePayload } from '../types';

/**
 * Valida se um template está completo
 */
export function validateTemplate(template: ChecklistTemplate): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!template.title || template.title.trim().length === 0) {
    errors.push('Título do template é obrigatório');
  }

  if (template.items.length === 0) {
    errors.push('Template deve ter pelo menos um item');
  }

  const itemsWithoutDescription = template.items.filter(
    item => !item.description || item.description.trim().length === 0
  );
  if (itemsWithoutDescription.length > 0) {
    errors.push(`${itemsWithoutDescription.length} item(ns) sem descrição`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Ordena items de um template
 */
export function sortTemplateItems(items: ChecklistTemplateItem[]): ChecklistTemplateItem[] {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Formata última atualização de forma relativa
 */
export function formatLastUpdate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `Há ${diffMins} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semana(s)`;
  if (diffDays < 365) return `Há ${Math.floor(diffDays / 30)} mês(es)`;

  return `Há ${Math.floor(diffDays / 365)} ano(s)`;
}

/**
 * Filtra templates por status (publicado/não publicado)
 */
export function filterByStatus(templates: ChecklistTemplate[], isPublished: boolean | null): ChecklistTemplate[] {
  if (isPublished === null) return templates;
  return templates.filter(t => t.isPublished === isPublished);
}

/**
 * Busca templates por texto
 */
export function searchTemplates(templates: ChecklistTemplate[], searchText: string): ChecklistTemplate[] {
  if (!searchText || searchText.trim().length === 0) return templates;

  const lowerSearch = searchText.toLowerCase().trim();
  return templates.filter(t =>
    t.title.toLowerCase().includes(lowerSearch)
  );
}

/**
 * Valida payload de criação
 */
export function validateTemplatePayload(payload: CreateChecklistTemplatePayload): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!payload.title || payload.title.trim().length === 0) {
    errors.push('Título é obrigatório');
  }

  if (!payload.publishedBy || payload.publishedBy.trim().length === 0) {
    errors.push('Publicador é obrigatório');
  }

  if (!payload.items || payload.items.length === 0) {
    errors.push('Template deve ter pelo menos um item');
  }

  payload.items.forEach((item, index) => {
    if (!item.description || item.description.trim().length === 0) {
      errors.push(`Item ${index + 1}: descrição é obrigatória`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}
