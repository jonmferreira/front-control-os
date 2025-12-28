<template>
  <Card>
    <template #title>{{ isEditing ? 'Editar Template' : 'Novo Template' }}</template>
    <template #content>
      <div class="space-y-4">
        <div class="space-y-2">
          <label for="template-name" class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Nome do Template *
          </label>
          <InputText
            id="template-name"
            v-model="formData.name"
            placeholder="Ex: Instalação de Rede"
            class="w-full"
            :invalid="!!errors.name"
          />
          <small v-if="errors.name" class="text-red-600">{{ errors.name }}</small>
        </div>

        <div class="space-y-2">
          <label for="template-description" class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Descrição
          </label>
          <Textarea
            id="template-description"
            v-model="formData.description"
            placeholder="Descreva o objetivo deste template..."
            rows="3"
            class="w-full"
          />
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label for="template-category" class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Categoria *
            </label>
            <Dropdown
              id="template-category"
              v-model="formData.category"
              :options="categories"
              placeholder="Selecione uma categoria"
              class="w-full"
              :invalid="!!errors.category"
            />
            <small v-if="errors.category" class="text-red-600">{{ errors.category }}</small>
          </div>

          <div class="space-y-2">
            <label for="template-status" class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Status
            </label>
            <div class="flex items-center gap-3 h-[42px]">
              <InputSwitch v-model="formData.isActive" input-id="template-status" />
              <label for="template-status" class="text-sm text-slate-600 dark:text-slate-300">
                {{ formData.isActive ? 'Ativo' : 'Inativo' }}
              </label>
            </div>
          </div>
        </div>

        <Divider />

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Itens do Checklist
            </h3>
            <Button
              icon="pi pi-plus"
              label="Adicionar Item"
              size="small"
              outlined
              @click="addItem"
            />
          </div>

          <Message v-if="errors.items" severity="error" :closable="false">
            {{ errors.items }}
          </Message>

          <div v-if="!formData.items.length" class="text-center py-8 text-slate-500 dark:text-slate-400">
            <i class="pi pi-inbox text-4xl mb-2"></i>
            <p class="text-sm">Nenhum item adicionado. Clique em "Adicionar Item" para começar.</p>
          </div>

          <div v-else class="space-y-2">
            <TemplateItemForm
              v-for="(item, index) in formData.items"
              :key="index"
              :item="item"
              :index="index"
              @update="updateItem(index, $event)"
              @remove="removeItem(index)"
              @move-up="moveItemUp(index)"
              @move-down="moveItemDown(index)"
            />
          </div>
        </div>

        <Divider />

        <div class="flex flex-wrap gap-2">
          <Button
            icon="pi pi-check"
            :label="isEditing ? 'Salvar Alterações' : 'Criar Template'"
            :loading="saving"
            @click="handleSave"
          />
          <Button
            icon="pi pi-times"
            label="Cancelar"
            severity="secondary"
            outlined
            :disabled="saving"
            @click="$emit('cancel')"
          />
          <Button
            v-if="isEditing"
            icon="pi pi-trash"
            label="Excluir"
            severity="danger"
            outlined
            :disabled="saving"
            @click="$emit('delete')"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import Message from 'primevue/message';
import { ChecklistInputType } from '@/modules/technician/service-orders/types';
import Divider from 'primevue/divider';
import type { CreateChecklistTemplatePayload, CreateTemplateItemPayload } from '../types';
import { validateTemplatePayload } from '../helpers';
import TemplateItemForm from './TemplateItemForm.vue';

interface Props {
  template?: CreateChecklistTemplatePayload;
  categories: string[];
  saving?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  template: undefined,
  saving: false
});

const emit = defineEmits<{
  save: [payload: CreateChecklistTemplatePayload];
  cancel: [];
  delete: [];
}>();

const isEditing = computed(() => !!props.template);

const formData = ref<CreateChecklistTemplatePayload>(
  props.template || {
    name: '',
    description: '',
    category: '',
    isActive: true,
    items: []
  }
);

const errors = ref<Record<string, string>>({});

function addItem() {
  const newItem: CreateTemplateItemPayload = {
    description: '',
    inputType: ChecklistInputType.TEXT,
    required: false,
    order: formData.value.items.length
  };
  formData.value.items.push(newItem);
}

function updateItem(index: number, updatedItem: CreateTemplateItemPayload) {
  formData.value.items[index] = updatedItem;
}

function removeItem(index: number) {
  formData.value.items.splice(index, 1);
  formData.value.items.forEach((item, i) => {
    item.order = i;
  });
}

function moveItemUp(index: number) {
  if (index === 0) return;
  const temp = formData.value.items[index - 1]!;
  formData.value.items[index - 1] = formData.value.items[index]!;
  formData.value.items[index] = temp!;
  formData.value.items.forEach((item, i) => {
    item.order = i;
  });
}

function moveItemDown(index: number) {
  if (index === formData.value.items.length - 1) return;
  const temp = formData.value.items[index + 1]!;
  formData.value.items[index + 1] = formData.value.items[index]!;
  formData.value.items[index] = temp!;
  formData.value.items.forEach((item, i) => {
    item.order = i;
  });
}

function handleSave() {
  errors.value = {};

  const validation = validateTemplatePayload(formData.value);
  if (!validation.isValid) {
    validation.errors.forEach((error, index) => {
      errors.value[`error_${index}`] = error;
    });
    if (validation.errors.length > 0) {
      errors.value.items = validation.errors.join('; ');
    }
    return;
  }

  emit('save', formData.value);
}
</script>
