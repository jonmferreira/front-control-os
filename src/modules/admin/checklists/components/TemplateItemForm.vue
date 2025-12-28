<template>
  <div class="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
    <div class="flex items-start gap-3">
      <div class="flex flex-col gap-1">
        <Button
          icon="pi pi-arrow-up"
          size="small"
          text
          rounded
          :disabled="index === 0"
          @click="$emit('move-up')"
        />
        <Button
          icon="pi pi-arrow-down"
          size="small"
          text
          rounded
          @click="$emit('move-down')"
        />
      </div>

      <div class="flex-1 space-y-3">
        <div class="grid gap-3 md:grid-cols-2">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Descrição *
            </label>
            <InputText
              :model-value="item.description"
              placeholder="Ex: Verificar instalação elétrica"
              class="w-full"
              @update:model-value="updateField('description', $event)"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Tipo de Input *
            </label>
            <Dropdown
              :model-value="item.inputType"
              :options="inputTypeOptions"
              option-label="label"
              option-value="value"
              placeholder="Selecione o tipo"
              class="w-full"
              @update:model-value="updateField('inputType', $event)"
            />
          </div>
        </div>

        <div v-if="needsOptions" class="space-y-1">
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Opções (separadas por vírgula)
          </label>
          <InputText
            :model-value="optionsText"
            placeholder="Ex: Ativo, Inativo"
            class="w-full"
            @update:model-value="updateOptions"
          />
        </div>

        <div class="grid gap-3 md:grid-cols-2">
          <div class="flex items-center gap-2">
            <Checkbox
              :model-value="item.required"
              input-id={`required-${index}`}
              binary
              @update:model-value="updateField('required', $event)"
            />
            <label :for="`required-${index}`" class="text-xs text-slate-600 dark:text-slate-300">
              Campo obrigatório
            </label>
          </div>

          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Texto de ajuda
            </label>
            <InputText
              :model-value="item.helpText"
              placeholder="Dica para o técnico..."
              class="w-full"
              @update:model-value="updateField('helpText', $event)"
            />
          </div>
        </div>
      </div>

      <Button
        icon="pi pi-trash"
        size="small"
        severity="danger"
        text
        rounded
        @click="$emit('remove')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';
import type { CreateTemplateItemPayload } from '../types';

interface Props {
  item: CreateTemplateItemPayload;
  index: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  update: [item: CreateTemplateItemPayload];
  remove: [];
  'move-up': [];
  'move-down': [];
}>();

const inputTypeOptions = [
  { label: 'Texto', value: 'text' },
  { label: 'Número', value: 'number' },
  { label: 'Data', value: 'date' },
  { label: 'Sim/Não', value: 'boolean' },
  { label: 'Seleção - Ativo/Inativo', value: 'select_active' },
  { label: 'Seleção - Município', value: 'select_municipality' }
];

const needsOptions = computed(() => {
  return props.item.inputType === 'select_active' || props.item.inputType === 'select_municipality';
});

const optionsText = computed(() => {
  return props.item.options?.join(', ') || '';
});

function updateField(field: keyof CreateTemplateItemPayload, value: unknown) {
  const updated = { ...props.item, [field]: value };
  emit('update', updated);
}

function updateOptions(text: string | undefined) {
  const options = (text || '').split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);
  updateField('options', options);
}
</script>
