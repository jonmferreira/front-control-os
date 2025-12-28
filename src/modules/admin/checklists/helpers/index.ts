import type { ChecklistTemplate, ChecklistTemplateItem, CreateChecklistTemplatePayload } from '../types';

/**
 * Valida se um template está completo e pode ser ativado
 */
export function validateTemplate(template: ChecklistTemplate, items: ChecklistTemplateItem[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar nome
  if (!template.name || template.name.trim().length === 0) {
    errors.push('Nome do template é obrigatório');
  }

  // Validar categoria
  if (!template.category || template.category.trim().length === 0) {
    errors.push('Categoria é obrigatória');
  }

  // Validar itens
  if (items.length === 0) {
    errors.push('Template deve ter pelo menos um item');
  }

  // Validar que cada item tem descrição
  const itemsWithoutDescription = items.filter(item => !item.description || item.description.trim().length === 0);
  if (itemsWithoutDescription.length > 0) {
    errors.push(`${itemsWithoutDescription.length} item(ns) sem descrição`);
  }

  // Validar que items com select têm options
  const selectItemsWithoutOptions = items.filter(
    item =>
      (item.inputType === 'select_active' || item.inputType === 'select_municipality') &&
      (!item.options || item.options.length === 0)
  );
  if (selectItemsWithoutOptions.length > 0) {
    errors.push(`${selectItemsWithoutOptions.length} item(ns) do tipo select sem opções`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Ordena items de um template pela propriedade order
 */
export function sortTemplateItems(items: ChecklistTemplateItem[]): ChecklistTemplateItem[] {
  return [...items].sort((a, b) => a.order - b.order);
}

/**
 * Reordena items após inserção, remoção ou movimentação
 */
export function reorderItems(items: ChecklistTemplateItem[], startIndex: number): ChecklistTemplateItem[] {
  return items.map((item, index) => ({
    ...item,
    order: index >= startIndex ? index + 1 : item.order
  }));
}

/**
 * Calcula estatísticas de uso de um template
 */
export function calculateTemplateStats(template: ChecklistTemplate): {
  usageRate: string;
  status: 'high' | 'medium' | 'low' | 'unused';
} {
  const { usageCount } = template;

  let status: 'high' | 'medium' | 'low' | 'unused';
  if (usageCount === 0) {
    status = 'unused';
  } else if (usageCount < 10) {
    status = 'low';
  } else if (usageCount < 30) {
    status = 'medium';
  } else {
    status = 'high';
  }

  return {
    usageRate: usageCount === 0 ? 'Não utilizado' : `${usageCount} uso(s)`,
    status
  };
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
 * Gera preview de um template para exibição
 */
export function generateTemplatePreview(_template: ChecklistTemplate, items: ChecklistTemplateItem[]): string {
  const sortedItems = sortTemplateItems(items);
  const preview = sortedItems.slice(0, 3).map(item => `• ${item.description}`).join('\n');
  const remaining = items.length - 3;

  if (remaining > 0) {
    return `${preview}\n... e mais ${remaining} item(ns)`;
  }

  return preview;
}

/**
 * Filtra templates por status (ativo/inativo)
 */
export function filterByStatus(templates: ChecklistTemplate[], isActive: boolean | null): ChecklistTemplate[] {
  if (isActive === null) return templates;
  return templates.filter(t => t.isActive === isActive);
}

/**
 * Filtra templates por categoria
 */
export function filterByCategory(templates: ChecklistTemplate[], category: string | null): ChecklistTemplate[] {
  if (!category) return templates;
  return templates.filter(t => t.category === category);
}

/**
 * Busca templates por texto (nome ou descrição)
 */
export function searchTemplates(templates: ChecklistTemplate[], searchText: string): ChecklistTemplate[] {
  if (!searchText || searchText.trim().length === 0) return templates;

  const lowerSearch = searchText.toLowerCase().trim();
  return templates.filter(
    t =>
      t.name.toLowerCase().includes(lowerSearch) ||
      (t.description && t.description.toLowerCase().includes(lowerSearch))
  );
}

/**
 * Valida payload de criação/atualização de template
 */
export function validateTemplatePayload(payload: CreateChecklistTemplatePayload): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!payload.name || payload.name.trim().length === 0) {
    errors.push('Nome é obrigatório');
  }

  if (!payload.category || payload.category.trim().length === 0) {
    errors.push('Categoria é obrigatória');
  }

  if (!payload.items || payload.items.length === 0) {
    errors.push('Template deve ter pelo menos um item');
  }

  // Validar items
  payload.items.forEach((item, index) => {
    if (!item.description || item.description.trim().length === 0) {
      errors.push(`Item ${index + 1}: descrição é obrigatória`);
    }

    if ((item.inputType === 'select_active' || item.inputType === 'select_municipality') &&
        (!item.options || item.options.length === 0)) {
      errors.push(`Item ${index + 1}: opções são obrigatórias para tipo select`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Converte ChecklistTemplate para CreateChecklistTemplatePayload
 */
export function templateToPayload(template: ChecklistTemplate,
  items: ChecklistTemplateItem[]
): CreateChecklistTemplatePayload {
  return {
    name: template.name,
    description: template.description,
    category: template.category,
    isActive: template.isActive,
    items: items.map(item => ({
      description: item.description,
      inputType: item.inputType,
      required: item.required,
      options: item.options,
      defaultValue: item.defaultValue,
      order: item.order,
      helpText: item.helpText
    }))
  };
}
