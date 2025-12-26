<template>
  <div class="space-y-5">
    <Card>
      <template #title>Gestão de checklists</template>
      <template #content>
        <div class="grid gap-3 md:grid-cols-3">
          <div class="rounded-xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Checklists ativos</p>
            <p class="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">{{ checklists.length }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Em uso pelos técnicos responsáveis.</p>
          </div>
          <div class="rounded-xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Inputs customizados</p>
            <p class="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">{{ customInputLibrary.length }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Componentes mapeados para itens especiais.</p>
          </div>
          <div class="rounded-xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Itens versionados</p>
            <p class="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">{{ totalItems }}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Reordene por drag-and-drop para persistir a prioridade.</p>
          </div>
        </div>
      </template>
    </Card>

    <div class="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <template #title>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Lista de checklists</p>
              <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">Selecione para editar</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <Button icon="pi pi-plus" label="Nova checklist" size="small" @click="createChecklist" />
              <Button
                icon="pi pi-trash"
                label="Remover"
                size="small"
                severity="danger"
                :disabled="!selectedChecklist"
                @click="deleteChecklist"
              />
            </div>
      </div>
    </template>
    <template #content>
      <div class="space-y-3" aria-live="polite">
        <div class="flex flex-wrap gap-2">
          <Button icon="pi pi-refresh" label="Recarregar" size="small" :loading="checklistsLoading" @click="refreshChecklists" />
          <Button
            icon="pi pi-exclamation-triangle"
            label="Simular erro"
            size="small"
            severity="warning"
            outlined
            @click="simulateChecklistError"
          />
        </div>
        <Message v-if="checklistsError" severity="error" :closable="false" class="rounded-xl">
          {{ checklistsError }}
        </Message>
        <div v-if="checklistsLoading" class="space-y-2">
          <Skeleton height="2.5rem" border-radius="12px" />
          <Skeleton height="2.5rem" border-radius="12px" />
          <Skeleton height="2.5rem" border-radius="12px" />
        </div>
        <Message
          v-else-if="!checklists.length && !checklistsError"
          severity="info"
          :closable="false"
          class="rounded-xl"
        >
          Nenhuma checklist cadastrada. Crie a primeira para iniciar o fluxo de OS.
        </Message>
        <DataTable
          v-else
          v-model:selection="tableSelection"
          :value="checklists"
          data-key="id"
          selection-mode="single"
          size="small"
          responsive-layout="scroll"
        >
          <Column field="title" header="Título"></Column>
          <Column field="owner" header="Responsável"></Column>
          <Column header="Itens">
            <template #body="{ data }">
              <Tag :value="`${data.items.length} itens`" severity="info" />
            </template>
          </Column>
          <Column header="Atualizado">
            <template #body="{ data }">
              <span class="text-sm text-slate-700 dark:text-slate-200">{{ formatDate(data.updatedAt) }}</span>
            </template>
          </Column>
          <Column header="Status">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <Tag v-if="data.inUseByFinalizedOs" value="Em OS finalizadas" severity="warning" />
                <Tag :value="`v${data.version}`" severity="secondary" />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </template>
  </Card>

      <Card>
        <template #title>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Checklist selecionada</p>
              <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {{ editableChecklist?.title ?? 'Nenhuma checklist selecionada' }}
              </h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <Button
                icon="pi pi-save"
                label="Salvar alterações"
                size="small"
                :disabled="!editableChecklist || !hasUnsavedChanges"
                @click="saveChecklist"
              />
              <Button icon="pi pi-refresh" label="Descartar" size="small" outlined @click="resetEdits" />
            </div>
          </div>
        </template>
        <template #content>
          <div v-if="editableChecklist" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Título</label>
                <InputText v-model="editableChecklist.title" placeholder="Ex.: Checklist de instalação" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Responsável técnico</label>
                <InputText v-model="editableChecklist.owner" placeholder="Nome do responsável" />
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-3">
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Última atualização</label>
                <Calendar v-model="updatedAtModel" date-format="dd/mm/yy" show-icon icon-display="input" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Versão</label>
                <div class="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/60">
                  <i class="pi pi-history text-slate-500"></i>
                  <span>v{{ editableChecklist.version }}</span>
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">OS finalizadas</label>
                <div class="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/60 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/60">
                  <i class="pi pi-check-circle text-emerald-500"></i>
                  <span>{{ editableChecklist.linkedFinalizedOs }} OS utilizam esta checklist</span>
                </div>
              </div>
            </div>

            <Message v-if="versioningWarning" severity="warn" :closable="false" class="rounded-xl">
              {{ versioningWarning }}
            </Message>

            <Divider />

            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Itens da checklist</p>
                <p class="text-sm text-slate-600 dark:text-slate-300">Arraste para reordenar e vincule inputs customizados.</p>
              </div>
              <Button icon="pi pi-plus" label="Adicionar item" size="small" outlined @click="addItem" />
            </div>

            <div v-if="!sortedEditableItems.length" class="rounded-lg border border-dashed border-slate-200/80 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Nenhum item cadastrado. Adicione o primeiro item obrigatório ou opcional.
            </div>

            <div class="space-y-3">
              <div
                v-for="(item, index) in sortedEditableItems"
                :key="item.id"
                class="group rounded-xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
                draggable="true"
                @dragstart="() => onDragStart(index)"
                @dragenter.prevent="() => onDragEnter(index)"
                @dragover.prevent
                @drop.prevent="onDrop"
                @dragend="resetDragState"
              >
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <Button icon="pi pi-bars" size="small" text class="cursor-grab text-slate-500 group-hover:text-slate-800 dark:text-slate-400" />
                    <Tag :value="`Ordem ${index + 1}`" severity="secondary" />
                    <Tag :value="item.required ? 'Obrigatório' : 'Opcional'" :severity="item.required ? 'danger' : 'info'" />
                    <Tag v-if="item.hasCustomInput" :value="displayCustomInput(item.customInputId)" severity="success" />
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <InputSwitch :input-id="`required-${item.id}`" v-model="item.required" />
                    <label class="text-xs text-slate-600 dark:text-slate-300" :for="`required-${item.id}`">Obrigatório</label>
                    <Button icon="pi pi-times" text severity="danger" size="small" @click="removeItem(item.id)" />
                  </div>
                </div>

                <div class="mt-3 grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
                  <div class="space-y-2">
                    <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Descrição</label>
                    <Textarea
                      v-model="item.description"
                      auto-resize
                      rows="2"
                      placeholder="Ex.: Confirmar bloqueio de energia"
                      class="w-full"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Valor padrão</label>
                    <Dropdown v-model="item.defaultValue" :options="defaultValueOptions" option-label="label" option-value="value" />
                  </div>
                </div>

                <div class="mt-3 grid gap-3 md:grid-cols-[0.6fr_1.4fr]">
                  <div class="space-y-2">
                    <label class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Input customizado</label>
                    <div class="flex items-center gap-3">
                      <InputSwitch v-model="item.hasCustomInput" @update:model-value="(value) => handleCustomToggle(item, value)" />
                      <Dropdown
                        v-model="item.customInputId"
                        :options="customInputOptions"
                        option-label="label"
                        option-value="id"
                        :disabled="!item.hasCustomInput"
                        placeholder="Selecione o componente"
                        class="w-full"
                        @change="(event) => onCustomInputChange(item, event.value)"
                      />
                    </div>
                  </div>
                  <div v-if="item.hasCustomInput && item.customInputId" class="space-y-2 rounded-lg border border-primary-100 bg-primary-50/50 p-3 dark:border-primary-400/30 dark:bg-primary-500/10">
                    <p class="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
                      Preview de {{ displayCustomInput(item.customInputId) }}
                    </p>
                    <component :is="resolveCustomInput(item.customInputId)" :schema="findCustomInputSchema(item.customInputId)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="rounded-lg border border-dashed border-slate-200/80 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            Selecione ou crie uma checklist para editar seus itens e inputs customizados.
          </div>
        </template>
      </Card>
    </div>

    <Card>
      <template #title>Biblioteca de inputs customizados</template>
      <template #content>
        <div class="grid gap-4 md:grid-cols-3">
          <div
            v-for="input in customInputLibrary"
            :key="input.id"
            class="rounded-xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-slate-800 dark:text-slate-100">{{ input.name }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ input.description }}</p>
              </div>
              <Tag :value="`ID: ${input.id}`" severity="secondary" />
            </div>
            <div class="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <p><strong>Componente:</strong> {{ input.componentName }}</p>
              <p><strong>Campos:</strong> {{ Object.keys(input.jsonBody).join(', ') }}</p>
            </div>
            <div class="mt-3 rounded-lg border border-dashed border-primary-100 bg-primary-50/50 p-3 text-sm dark:border-primary-400/30 dark:bg-primary-500/10">
              <p class="text-xs font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">Preview</p>
              <component :is="resolveCustomInput(input.id)" :schema="input.jsonBody" />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Calendar from 'primevue/calendar';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Skeleton from 'primevue/skeleton';
import { displayCustomInputLabel, resolveCustomInputComponent } from '@/helpers_and_formaters/customInputs';

type ChecklistItemValue = 'pendente' | 'aprovado' | 'rejeitado' | 'nao_aplica';

interface ChecklistItem {
  id: string;
  description: string;
  required: boolean;
  hasCustomInput: boolean;
  customInputId?: string | null;
  defaultValue: ChecklistItemValue;
  order: number;
}

interface Checklist {
  id: string;
  title: string;
  owner: string;
  updatedAt: string;
  version: number;
  inUseByFinalizedOs: boolean;
  linkedFinalizedOs: number;
  items: ChecklistItem[];
}

interface CustomInput {
  id: string;
  name: string;
  description: string;
  componentName: string;
  jsonBody: Record<string, unknown>;
}

const customInputLibrary = ref<CustomInput[]>([
  {
    id: 'dadosCarro',
    name: 'DadosCarro',
    description: 'Ficha técnica do equipamento ou veículo vinculado à OS.',
    componentName: 'CustomInputDadosCarro',
    jsonBody: { modelo: 'Painel 220V', ano: 2018, placa: 'N/A', chassi: 'ELQ-2291' }
  },
  {
    id: 'checklistEpi',
    name: 'ChecklistEPI',
    description: 'Itens obrigatórios de segurança antes da execução.',
    componentName: 'CustomInputChecklistEpi',
    jsonBody: { epis: ['Capacete', 'Luva isolante', 'Óculos de proteção'] }
  },
  {
    id: 'medicaoPressao',
    name: 'MediçãoPressão',
    description: 'Registro de pressão e limites do equipamento testado.',
    componentName: 'CustomInputMedicaoPressao',
    jsonBody: { ponto: 'Linha hidráulica A', valor: '12.4', unidade: 'bar', limite: '15 bar' }
  }
]);

const checklists = ref<Checklist[]>([
  {
    id: 'chk-1',
    title: 'Checklist padrão de instalação',
    owner: 'Luana Pires',
    updatedAt: new Date('2024-11-05').toISOString(),
    version: 3,
    inUseByFinalizedOs: true,
    linkedFinalizedOs: 6,
    items: [
      {
        id: 'item-1',
        description: 'Confirmar bloqueio de energia e liberação do equipamento.',
        required: true,
        hasCustomInput: false,
        customInputId: null,
        defaultValue: 'pendente',
        order: 1
      },
      {
        id: 'item-2',
        description: 'Registrar fotos do painel antes da troca.',
        required: true,
        hasCustomInput: false,
        customInputId: null,
        defaultValue: 'pendente',
        order: 2
      },
      {
        id: 'item-3',
        description: 'Dados do equipamento vinculado para conferência.',
        required: false,
        hasCustomInput: true,
        customInputId: 'dadosCarro',
        defaultValue: 'nao_aplica',
        order: 3
      }
    ]
  },
  {
    id: 'chk-2',
    title: 'Vistoria de segurança',
    owner: 'João Mendes',
    updatedAt: new Date('2024-10-28').toISOString(),
    version: 1,
    inUseByFinalizedOs: false,
    linkedFinalizedOs: 1,
    items: [
      {
        id: 'item-4',
        description: 'Checklist de EPI assinado pelo técnico.',
        required: true,
        hasCustomInput: true,
        customInputId: 'checklistEpi',
        defaultValue: 'pendente',
        order: 1
      },
      {
        id: 'item-5',
        description: 'Registrar medição de pressão antes do acionamento.',
        required: true,
        hasCustomInput: true,
        customInputId: 'medicaoPressao',
        defaultValue: 'pendente',
        order: 2
      }
    ]
  }
]);

const checklistsLoading = ref(true);
const checklistsError = ref('');
const tableSelection = ref<Checklist | null>(checklists.value[0] ?? null);
const selectedChecklistId = ref<string | null>(checklists.value[0]?.id ?? null);

onMounted(() => {
  refreshChecklists();
});

watch(
  tableSelection,
  (value) => {
    selectedChecklistId.value = value?.id ?? null;
  },
  { immediate: true }
);

const selectedChecklist = computed<Checklist | null>(() => {
  if (!selectedChecklistId.value) return null;
  return checklists.value.find((item) => item.id === selectedChecklistId.value) ?? null;
});

const editableChecklist = ref<Checklist | null>(selectedChecklist.value ? cloneChecklist(selectedChecklist.value) : null);

watch(
  selectedChecklist,
  (value) => {
    editableChecklist.value = value ? cloneChecklist(value) : null;
    resetDragState();
  },
  { immediate: true }
);

const defaultValueOptions = [
  { label: 'Pendente', value: 'pendente' },
  { label: 'Aprovado', value: 'aprovado' },
  { label: 'Rejeitado', value: 'rejeitado' },
  { label: 'N/A', value: 'nao_aplica' }
];

const customInputOptions = computed(() =>
  customInputLibrary.value.map((input) => ({
    id: input.id,
    label: `${input.name} (${input.componentName})`
  }))
);

const totalItems = computed(() => checklists.value.reduce((sum, checklist) => sum + checklist.items.length, 0));

const sortedEditableItems = computed(() => {
  if (!editableChecklist.value) return [];
  return [...editableChecklist.value.items].sort((a, b) => a.order - b.order);
});

const updatedAtModel = computed<Date | null>({
  get() {
    if (!editableChecklist.value) return null;
    return new Date(editableChecklist.value.updatedAt);
  },
  set(value) {
    if (!editableChecklist.value || !value) return;
    editableChecklist.value.updatedAt = value.toISOString();
  }
});

const hasUnsavedChanges = computed(() => {
  if (!editableChecklist.value || !selectedChecklist.value) return false;
  return JSON.stringify(selectedChecklist.value) !== JSON.stringify(editableChecklist.value);
});

const versioningWarning = computed(() => {
  if (!editableChecklist.value) return '';
  if (!editableChecklist.value.inUseByFinalizedOs) return '';
  if (!hasUnsavedChanges.value) return '';
  return 'Esta checklist já foi usada em OS finalizadas. Salvando as alterações criaremos uma nova versão para manter o histórico.';
});

const dragState = reactive<{ sourceIndex: number | null; targetIndex: number | null }>({
  sourceIndex: null,
  targetIndex: null
});

function cloneChecklist(checklist: Checklist): Checklist {
  return {
    ...checklist,
    items: checklist.items.map((item) => ({ ...item }))
  };
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data inválida';
  return date.toLocaleDateString('pt-BR');
}

function refreshChecklists() {
  checklistsError.value = '';
  checklistsLoading.value = true;
  setTimeout(() => {
    checklistsLoading.value = false;
  }, 450);
}

function simulateChecklistError() {
  checklistsLoading.value = false;
  checklistsError.value = 'Falha ao carregar checklists. Recarregue para tentar novamente.';
  tableSelection.value = null;
  selectedChecklistId.value = null;
  editableChecklist.value = null;
}

function createChecklist() {
  const newChecklist: Checklist = {
    id: `chk-${Math.random().toString(36).slice(2, 7)}`,
    title: 'Nova checklist',
    owner: 'Técnico responsável',
    updatedAt: new Date().toISOString(),
    version: 1,
    inUseByFinalizedOs: false,
    linkedFinalizedOs: 0,
    items: []
  };

  checklists.value = [newChecklist, ...checklists.value];
  tableSelection.value = newChecklist;
  selectedChecklistId.value = newChecklist.id;
  editableChecklist.value = cloneChecklist(newChecklist);
}

function deleteChecklist() {
  if (!selectedChecklist.value) return;
  const shouldDelete = window.confirm('Remover esta checklist? As OS em andamento devem ser vinculadas a outra.');
  if (!shouldDelete) return;

  checklists.value = checklists.value.filter((item) => item.id !== selectedChecklist.value?.id);
  tableSelection.value = checklists.value[0] ?? null;
  selectedChecklistId.value = checklists.value[0]?.id ?? null;
}

function addItem() {
  if (!editableChecklist.value) return;
  const nextOrder = editableChecklist.value.items.length + 1;
  const newItem: ChecklistItem = {
    id: `item-${Math.random().toString(36).slice(2, 7)}`,
    description: 'Novo item de checklist',
    required: false,
    hasCustomInput: false,
    customInputId: null,
    defaultValue: 'pendente',
    order: nextOrder
  };
  editableChecklist.value.items = [...editableChecklist.value.items, newItem];
}

function removeItem(id: string) {
  if (!editableChecklist.value) return;
  editableChecklist.value.items = editableChecklist.value.items
    .filter((item) => item.id !== id)
    .map((item, index) => ({ ...item, order: index + 1 }));
}

function handleCustomToggle(item: ChecklistItem, value: boolean) {
  item.hasCustomInput = value;
  if (!value) {
    item.customInputId = null;
  } else if (!item.customInputId) {
    item.customInputId = customInputLibrary.value[0]?.id ?? null;
  }
}

function onCustomInputChange(item: ChecklistItem, value: string) {
  item.customInputId = value;
}

function saveChecklist() {
  if (!editableChecklist.value) return;
  const index = checklists.value.findIndex((item) => item.id === editableChecklist.value?.id);
  if (index === -1) return;

  const normalizedItems = sortedEditableItems.value.map((item, idx) => ({ ...item, order: idx + 1 }));
  const shouldBumpVersion = editableChecklist.value.inUseByFinalizedOs && hasUnsavedChanges.value;
  const updated: Checklist = {
    ...editableChecklist.value,
    items: normalizedItems,
    updatedAt: new Date().toISOString(),
    version: shouldBumpVersion ? editableChecklist.value.version + 1 : editableChecklist.value.version
  };

  checklists.value.splice(index, 1, updated);
  editableChecklist.value = cloneChecklist(updated);
  tableSelection.value = updated;
}

function resetEdits() {
  if (!selectedChecklist.value) return;
  editableChecklist.value = cloneChecklist(selectedChecklist.value);
}

function displayCustomInput(customInputId?: string | null) {
  const input = customInputLibrary.value.find((item) => item.id === customInputId);
  return input ? input.name : displayCustomInputLabel(customInputId);
}

function resolveCustomInput(customInputId?: string | null) {
  return resolveCustomInputComponent(customInputId);
}

function findCustomInputSchema(customInputId?: string | null) {
  return customInputLibrary.value.find((input) => input.id === customInputId)?.jsonBody ?? {};
}

function onDragStart(index: number) {
  dragState.sourceIndex = index;
}

function onDragEnter(index: number) {
  dragState.targetIndex = index;
}

function onDrop() {
  if (dragState.sourceIndex === null || dragState.targetIndex === null || !editableChecklist.value) return;
  const items = [...sortedEditableItems.value];
  const [moved] = items.splice(dragState.sourceIndex, 1);
  if (!moved) {
    resetDragState();
    return;
  }
  items.splice(dragState.targetIndex, 0, moved);
  editableChecklist.value.items = items.map((item, idx) => ({ ...item, order: idx + 1 }));
  resetDragState();
}

function resetDragState() {
  dragState.sourceIndex = null;
  dragState.targetIndex = null;
}
</script>
