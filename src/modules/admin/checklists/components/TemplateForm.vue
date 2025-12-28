<template>
  <Card>
    <template #title>{{ isEditing ? 'Editar Template' : 'Novo Template' }}</template>
    <template #content>
      <div class="space-y-4">
        <div class="space-y-2">
          <label for="template-title" class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Título do Template *
          </label>
          <InputText
            id="template-title"
            v-model="formData.title"
            placeholder="Ex: Instalação de Rede"
            class="w-full"
            :invalid="!!errors.title"
          />
          <small v-if="errors.title" class="text-red-600">{{ errors.title }}</small>
        </div>

        <div class="space-y-2">
          <label for="publish-immediately" class="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Publicação
          </label>
          <div class="flex items-center gap-3 h-[42px]">
            <InputSwitch v-model="formData.publishImmediately" input-id="publish-immediately" />
            <label for="publish-immediately" class="text-sm text-slate-600 dark:text-slate-300">
              {{ formData.publishImmediately ? 'Publicar imediatamente' : 'Salvar como rascunho' }}
            </label>
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
import InputSwitch from 'primevue/inputswitch';
import Message from 'primevue/message';
import Divider from 'primevue/divider';
import type { CreateChecklistTemplatePayload, CreateTemplateItemPayload } from '../types';
import { validateTemplatePayload } from '../helpers';
import TemplateItemForm from './TemplateItemForm.vue';
import { useAuthStore } from '@/stores/auth';

interface Props {
  template?: CreateChecklistTemplatePayload;
  saving?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  template: undefined,
  saving: false
});

const emit = defineEmits<{
  save: [payload: CreateChecklistTemplatePayload];
  cancel: [];
}>();

const authStore = useAuthStore();
const isEditing = computed(() => !!props.template);

const formData = ref<CreateChecklistTemplatePayload>(
  props.template || {
    title: '',
    publishedBy: authStore.profile?.username || 'admin',
    publishImmediately: true,
    items: []
  }
);

const errors = ref<Record<string, string>>({});

function addItem() {
  const newItem: CreateTemplateItemPayload = {
    description: '',
    hasCustomInput: false,
    displayOrder: formData.value.items.length
  };
  formData.value.items.push(newItem);
}

function updateItem(index: number, updatedItem: CreateTemplateItemPayload) {
  formData.value.items[index] = updatedItem;
}

function removeItem(index: number) {
  formData.value.items.splice(index, 1);
  formData.value.items.forEach((item, i) => {
    item.displayOrder = i;
  });
}

function moveItemUp(index: number) {
  if (index === 0) return;
  const temp = formData.value.items[index - 1]!;
  formData.value.items[index - 1] = formData.value.items[index]!;
  formData.value.items[index] = temp!;
  formData.value.items.forEach((item, i) => {
    item.displayOrder = i;
  });
}

function moveItemDown(index: number) {
  if (index === formData.value.items.length - 1) return;
  const temp = formData.value.items[index + 1]!;
  formData.value.items[index + 1] = formData.value.items[index]!;
  formData.value.items[index] = temp!;
  formData.value.items.forEach((item, i) => {
    item.displayOrder = i;
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
