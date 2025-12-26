<template>
  <div class="space-y-5">
    <Card>
      <template #title>Permissões de checklist</template>
      <template #content>
        <div class="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <div class="flex items-start gap-3">
            <Checkbox v-model="showStatus" inputId="status" binary />
            <div>
              <label for="status" class="font-semibold text-slate-700 dark:text-slate-200">Permitir salvar rascunhos</label>
              <p class="text-xs text-slate-500 dark:text-slate-400">Técnicos podem pausar o checklist e retomar depois.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Checkbox v-model="shareActivity" inputId="activity" binary />
            <div>
              <label for="activity" class="font-semibold text-slate-700 dark:text-slate-200">Checklist obrigatório antes de finalizar</label>
              <p class="text-xs text-slate-500 dark:text-slate-400">Bloqueia conclusão de OS sem todos os itens aprovados.</p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <Checkbox v-model="allowMessages" inputId="messages" binary />
            <div>
              <label for="messages" class="font-semibold text-slate-700 dark:text-slate-200">Permitir fotos como evidência</label>
              <p class="text-xs text-slate-500 dark:text-slate-400">Libera upload direto no item de checklist vinculado à OS.</p>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Integrações operacionais</template>
      <template #content>
        <Fieldset legend="Integrações externas" toggleable :collapsed="false">
          <div class="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <div class="flex items-center justify-between">
              <span>API de ordens de serviço</span>
              <Button label="Revogar" text severity="danger" />
            </div>
            <div class="flex items-center justify-between">
              <span>Storage de evidências</span>
              <Button label="Gerenciar" text />
            </div>
            <div class="flex items-center justify-between">
              <span>Webhooks de checklist</span>
              <Button label="Revogar" text severity="danger" />
            </div>
          </div>
        </Fieldset>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import Fieldset from 'primevue/fieldset';

const showStatus = ref(true);
const shareActivity = ref(false);
const allowMessages = ref(false);
</script>
