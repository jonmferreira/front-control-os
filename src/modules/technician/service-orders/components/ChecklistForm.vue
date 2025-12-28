<template>
  <div class="space-y-4">
    <div v-if="loading" class="space-y-2">
      <Skeleton height="6rem" border-radius="12px" />
      <Skeleton height="6rem" border-radius="12px" />
    </div>

    <Message v-else-if="error" severity="error" :closable="false">
      {{ error }}
    </Message>

    <div v-else class="space-y-3">
      <div
        v-for="item in sortedItems"
        :key="item.id"
        class="rounded-lg border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70"
      >
        <div class="flex items-start gap-3 mb-3">
          <Tag v-if="item.required" value="Obrigatório" severity="danger" />
          <Tag v-else value="Opcional" severity="secondary" />
          <div class="flex-1">
            <p class="font-semibold text-slate-800 dark:text-slate-100">{{ item.description }}</p>
          </div>
          <i
            v-if="item.completed"
            class="pi pi-check-circle text-green-600 dark:text-green-400"
            aria-label="Item completado"
          ></i>
        </div>

        <div class="space-y-3">
          <!-- Text Input -->
          <InputText
            v-if="item.inputType === ChecklistInputType.TEXT"
            :model-value="item.value as string"
            placeholder="Digite aqui..."
            class="w-full"
            :disabled="readonly"
            @update:model-value="(val) => updateValue(item.id, val ?? null)"
          />

          <!-- Number Input -->
          <InputNumber
            v-else-if="item.inputType === ChecklistInputType.NUMBER"
            :model-value="item.value as number"
            placeholder="Digite um número..."
            class="w-full"
            :disabled="readonly"
            @update:model-value="updateValue(item.id, $event)"
          />

          <!-- Boolean Input -->
          <div v-else-if="item.inputType === ChecklistInputType.BOOLEAN" class="flex gap-3">
            <Button
              label="Sim"
              :severity="item.value === true ? 'success' : 'secondary'"
              :outlined="item.value !== true"
              :disabled="readonly"
              @click="updateValue(item.id, true)"
            />
            <Button
              label="Não"
              :severity="item.value === false ? 'danger' : 'secondary'"
              :outlined="item.value !== false"
              :disabled="readonly"
              @click="updateValue(item.id, false)"
            />
          </div>

          <!-- Select Active -->
          <Dropdown
            v-else-if="item.inputType === ChecklistInputType.SELECT_ACTIVE"
            :model-value="item.value as string"
            :options="item.options || ['Ativo', 'Inativo']"
            placeholder="Selecione..."
            class="w-full"
            :disabled="readonly"
            @update:model-value="updateValue(item.id, $event)"
          />

          <!-- Select Municipality -->
          <Dropdown
            v-else-if="item.inputType === ChecklistInputType.SELECT_MUNICIPALITY"
            :model-value="item.value as string"
            :options="item.options || []"
            placeholder="Selecione o município..."
            class="w-full"
            :disabled="readonly"
            @update:model-value="updateValue(item.id, $event)"
          />

          <!-- Date Input -->
          <Calendar
            v-else-if="item.inputType === ChecklistInputType.DATE"
            :model-value="item.value ? new Date(item.value as string) : null"
            placeholder="Selecione uma data..."
            date-format="dd/mm/yy"
            class="w-full"
            :disabled="readonly"
            @update:model-value="(val) => updateValue(item.id, val instanceof Date ? val.toISOString() : null)"
          />

          <!-- Mark as Complete Button -->
          <Button
            v-if="!item.completed && item.value !== null && item.value !== undefined && item.value !== ''"
            label="Marcar como completo"
            icon="pi pi-check"
            size="small"
            severity="success"
            outlined
            :disabled="readonly"
            @click="$emit('complete', item.id, item.value)"
          />

          <div v-if="item.completed && item.completedAt" class="text-xs text-slate-500 dark:text-slate-400">
            Completado em {{ formatDate(item.completedAt) }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="!readonly && !loading && !error" class="pt-4">
      <ProgressBar :value="progressPercent" />
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        {{ summary.completed }} de {{ summary.total }} itens completados ({{ summary.percentComplete }}%)
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Message from 'primevue/message';
import Skeleton from 'primevue/skeleton';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import ProgressBar from 'primevue/progressbar';
import type { ChecklistItem } from '../types';
import { ChecklistInputType } from '../types';
import { calculateChecklistSummary, formatDate } from '../helpers';

interface Props {
  items: ChecklistItem[];
  loading?: boolean;
  error?: string;
  readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: '',
  readonly: false
});

const emit = defineEmits<{
  update: [itemId: string, value: string | number | boolean | null];
  complete: [itemId: string, value: string | number | boolean | null];
}>();

const sortedItems = computed(() => {
  return [...props.items].sort((a, b) => a.order - b.order);
});

const summary = computed(() => calculateChecklistSummary(props.items));

const progressPercent = computed(() => summary.value.percentComplete);

function updateValue(itemId: string, value: string | number | boolean | null | Date) {
  emit('update', itemId, value as string | number | boolean | null);
}
</script>
