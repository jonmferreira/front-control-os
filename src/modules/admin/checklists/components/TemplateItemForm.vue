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
              Resultado Padrão
            </label>
            <Dropdown
              :model-value="item.defaultOutcome"
              :options="outcomeOptions"
              option-label="label"
              option-value="value"
              placeholder="Nenhum (técnico decide)"
              class="w-full"
              @update:model-value="updateField('defaultOutcome', $event)"
            />
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Checkbox
            :model-value="item.hasCustomInput"
            :input-id="`custom-input-${index}`"
            binary
            @update:model-value="updateField('hasCustomInput', $event)"
          />
          <label :for="`custom-input-${index}`" class="text-xs text-slate-600 dark:text-slate-300">
            Possui input customizado
          </label>
        </div>

        <div v-if="item.hasCustomInput" class="space-y-1">
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            ID do Componente Customizado
          </label>
          <InputText
            :model-value="item.customInputComponentId"
            placeholder="Ex: dadosCarro, equipamentoRede"
            class="w-full"
            @update:model-value="updateField('customInputComponentId', $event)"
          />
          <small class="text-xs text-slate-500">
            Identificador do componente customizado que será renderizado
          </small>
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

const outcomeOptions = [
  { label: 'Aprovado', value: 'Approved' },
  { label: 'Rejeitado', value: 'Rejected' },
  { label: 'Não Aplicável', value: 'NotApplicable' }
];

function updateField(field: keyof CreateTemplateItemPayload, value: unknown) {
  const updated = { ...props.item, [field]: value };
  emit('update', updated);
}
</script>
