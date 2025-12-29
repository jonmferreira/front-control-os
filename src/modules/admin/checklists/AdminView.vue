<template>
  <div class="space-y-6">
    <Card>
      <template #title>
        <div class="flex items-center justify-between">
          <span>Gerenciamento de Templates de Checklist</span>
          <Button
            icon="pi pi-plus"
            label="Novo Template"
            @click="showCreateForm = true"
          />
        </div>
      </template>
      <template #content>
        <p class="mb-4 text-sm text-slate-600 dark:text-slate-300">
          Crie e gerencie templates de checklist para padronizar a execução de ordens de serviço.
        </p>

        <!-- Lista de Templates -->
        <TemplateList
          v-if="!showCreateForm && !editingTemplate"
          :templates="templates"
          @create="showCreateForm = true"
          @view="handleViewTemplate"
        />

        <!-- Formulário de Criação/Edição -->
        <TemplateForm
          v-if="showCreateForm || editingTemplate"
          :template="editingTemplate"
          :saving="saving"
          @save="handleSaveTemplate"
          @cancel="handleCancelForm"
        />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import TemplateList from './components/TemplateList.vue';
import TemplateForm from './components/TemplateForm.vue';
import { mockChecklistTemplates } from './mocks';
import type { ChecklistTemplate, CreateChecklistTemplatePayload } from './types';

const templates = ref(mockChecklistTemplates);
const editingTemplate = ref<CreateChecklistTemplatePayload>();
const showCreateForm = ref(false);
const saving = ref(false);

function handleViewTemplate(template: ChecklistTemplate) {
  // Converter ChecklistTemplate para CreateChecklistTemplatePayload
  editingTemplate.value = {
    title: template.title,
    publishedBy: template.publishedBy,
    publishImmediately: template.isPublished,
    items: template.items.map(item => ({
      description: item.description,
      hasCustomInput: item.hasCustomInput,
      customInputComponentId: item.customInputComponentId,
      defaultOutcome: item.defaultOutcome,
      displayOrder: item.displayOrder
    }))
  };
  showCreateForm.value = false;
}

async function handleSaveTemplate(payload: CreateChecklistTemplatePayload) {
  saving.value = true;

  try {
    // Simular salvamento (depois integrar com API)
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Template salvo:', payload);

    // Resetar formulário
    handleCancelForm();
  } catch (error) {
    console.error('Erro ao salvar template:', error);
  } finally {
    saving.value = false;
  }
}

function handleCancelForm() {
  showCreateForm.value = false;
  editingTemplate.value = undefined;
}
</script>
