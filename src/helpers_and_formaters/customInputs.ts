import { defineComponent } from 'vue';

export type CustomInputId = 'dadosCarro' | 'checklistEpi' | 'medicaoPressao' | string | null | undefined;

const fallbackComponent = defineComponent({
  name: 'FallbackCustomInput',
  template: `<p class="text-xs text-slate-500">Preview indisponível.</p>`
});

const emptyComponent = defineComponent({
  name: 'EmptyCustomInput',
  template: `<p class="text-xs text-slate-500">Nenhum componente selecionado.</p>`
});

export const customInputRegistry: Record<string, ReturnType<typeof defineComponent>> = {
  dadosCarro: defineComponent({
    name: 'CustomInputDadosCarro',
    props: { schema: { type: Object, default: () => ({}) } },
    template: `
      <div class="grid gap-2 md:grid-cols-2 text-sm text-slate-700 dark:text-slate-200">
        <p><strong>Modelo:</strong> {{ schema.modelo ?? 'N/D' }}</p>
        <p><strong>Ano:</strong> {{ schema.ano ?? 'N/D' }}</p>
        <p><strong>Placa:</strong> {{ schema.placa ?? 'N/D' }}</p>
        <p><strong>Chassi:</strong> {{ schema.chassi ?? 'N/D' }}</p>
      </div>
    `
  }),
  checklistEpi: defineComponent({
    name: 'CustomInputChecklistEpi',
    props: { schema: { type: Object, default: () => ({}) } },
    template: `
      <ul class="space-y-1 text-sm text-slate-700 dark:text-slate-200">
        <li v-for="epi in schema.epis ?? []" :key="epi"><i class="pi pi-check-circle text-emerald-500 mr-1"></i>{{ epi }}</li>
      </ul>
    `
  }),
  medicaoPressao: defineComponent({
    name: 'CustomInputMedicaoPressao',
    props: { schema: { type: Object, default: () => ({}) } },
    template: `
      <div class="space-y-1 text-sm text-slate-700 dark:text-slate-200">
        <p><strong>Ponto de medição:</strong> {{ schema.ponto ?? 'N/D' }}</p>
        <p><strong>Valor lido:</strong> {{ schema.valor ?? 'N/D' }} {{ schema.unidade ?? '' }}</p>
        <p><strong>Limite:</strong> {{ schema.limite ?? '-' }}</p>
      </div>
    `
  })
};

const customInputLabels: Record<string, string> = {
  dadosCarro: 'DadosCarro',
  checklistEpi: 'ChecklistEPI',
  medicaoPressao: 'MediçãoPressão'
};

export function resolveCustomInputComponent(customInputId: CustomInputId) {
  if (!customInputId) return emptyComponent;
  return customInputRegistry[customInputId] ?? fallbackComponent;
}

export function displayCustomInputLabel(customInputId: CustomInputId) {
  if (!customInputId) return 'Sem componente customizado';
  return customInputLabels[customInputId] ?? 'Componente não mapeado';
}
