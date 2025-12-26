<template>
  <div class="space-y-5" aria-label="Painel de ordens de serviço">
    <Card>
      <template #title>Fila de ordens de serviço</template>
      <template #content>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Acompanhe o volume por status, distribua a carga entre os técnicos responsáveis e inicie as OS que aguardam execução.
        </p>
        <div class="mt-4 grid gap-3 md:grid-cols-3">
          <div
            v-for="card in statusCards"
            :key="card.label"
            class="rounded-xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ card.label }}</p>
                <p class="text-2xl font-semibold text-slate-800 dark:text-slate-100">{{ card.value }}</p>
              </div>
              <span :class="['flex h-10 w-10 items-center justify-center rounded-lg text-lg', card.iconClass]">
                <i :class="['pi', card.icon]" aria-hidden="true"></i>
              </span>
            </div>
            <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">{{ card.description }}</p>
          </div>
        </div>
      </template>
    </Card>

    <div class="grid gap-5 lg:grid-cols-3">
      <TechnicianPerformanceCard />
      <TeamProductivityCard />
      <ManagerStatusCard />
    </div>

    <div class="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
      <Card>
        <template #title>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <span>Lista de OS por status</span>
            <TabMenu :model="statusTabs" :active-index="activeStatusIndex" @tab-change="handleStatusTabChange" />
          </div>
        </template>
        <template #content>
          <p class="mb-4 text-xs text-slate-500 dark:text-slate-400">
            Selecione uma OS para abrir o detalhe. Pendentes podem ser iniciadas pelo técnico responsável.
          </p>
          <div class="space-y-3" aria-live="polite">
            <div class="flex flex-wrap gap-2">
              <Button icon="pi pi-refresh" label="Recarregar" size="small" :loading="ordersLoading" @click="refreshOrders" />
              <Button
                icon="pi pi-exclamation-triangle"
                label="Simular erro"
                severity="warning"
                size="small"
                outlined
                @click="simulateError"
              />
            </div>
            <Message
              v-if="ordersError"
              severity="error"
              :closable="false"
              class="rounded-xl"
              aria-label="Erro ao carregar ordens de serviço"
            >
              {{ ordersError }}
            </Message>
            <div v-if="ordersLoading" class="space-y-2">
              <Skeleton height="2.5rem" border-radius="12px" />
              <Skeleton height="2.5rem" border-radius="12px" />
              <Skeleton height="2.5rem" border-radius="12px" />
            </div>
            <Message
              v-else-if="!filteredOrders.length && !ordersError"
              severity="info"
              :closable="false"
              class="rounded-xl"
              aria-label="Nenhuma ordem encontrada"
            >
              Nenhuma OS no status selecionado. Use o painel acima para iniciar uma OS pendente.
            </Message>
            <DataTable
              v-else
              :value="filteredOrders"
              size="small"
              responsive-layout="scroll"
              selection-mode="single"
              data-key="id"
              :selection="selectedOrder"
              @row-select="onSelectOrder"
              @row-unselect="onUnselectOrder"
              @row-click="onRowClick"
            >
              <Column field="code" header="OS"></Column>
              <Column field="title" header="Título"></Column>
              <Column field="technician" header="Responsável"></Column>
              <Column header="Ações" style="width: 160px">
                <template #body="{ data }">
                  <div class="flex flex-wrap gap-2">
                    <Button
                      v-if="data.status === 'pendente'"
                      size="small"
                      icon="pi pi-play"
                      label="Iniciar"
                      aria-label="Iniciar ordem de serviço"
                      @click.stop="startOrder(data.id)"
                    />
                    <Button
                      size="small"
                      outlined
                      icon="pi pi-eye"
                      label="Detalhes"
                      aria-label="Abrir detalhes da ordem de serviço"
                      @click.stop="selectOrderById(data.id)"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </template>
      </Card>

      <Card v-if="selectedOrder" class="h-full" aria-live="polite">
        <template #title>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ selectedOrder.code }}</p>
              <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">{{ selectedOrder.title }}</h3>
            </div>
            <Tag :value="statusLabel(selectedOrder.status)" :severity="statusSeverity(selectedOrder.status)" />
          </div>
        </template>
        <template #content>
          <div class="space-y-4 text-sm">
            <div class="space-y-1">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Descrição</p>
              <p class="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 leading-relaxed dark:border-slate-800 dark:bg-slate-900/60">
                {{ selectedOrder.description }}
              </p>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-2">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Responsável</p>
                <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <i class="pi pi-user"></i>
                  <span>{{ selectedOrder.technician }}</span>
                </div>
              </div>
              <div class="space-y-2">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Checklist</p>
                <div class="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <i class="pi pi-list-check"></i>
                  <span>{{ selectedOrder.checklistTitle }}</span>
                </div>
              </div>
            </div>

            <Divider />

            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Anexos</p>
                <Tag :value="`${selectedOrder.attachments.length} arquivos`" severity="secondary" />
              </div>
              <div class="flex flex-wrap gap-2" aria-live="polite">
                <div v-for="file in selectedOrder.attachments" :key="file.name" class="flex items-center gap-2">
                  <Chip :label="file.name" :image="file.previewUrl" class="max-w-[220px]" />
                  <Tag v-if="file.pendingSync" value="Fila offline" severity="warning" />
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-2" aria-label="Upload de evidências">
                <FileUpload
                  mode="basic"
                  name="attachments[]"
                  choose-label="Adicionar evidências"
                  accept="image/*"
                  :custom-upload="true"
                  :max-file-size="MAX_ATTACHMENT_SIZE"
                  auto
                  @uploader="onUpload"
                  @select="onUploadSelect"
                />
                <Message
                  v-if="!isOnline"
                  severity="info"
                  :closable="false"
                  class="rounded-xl"
                  aria-label="Modo offline"
                >
                  Modo offline: os arquivos ficam na fila local até reconectar.
                </Message>
              </div>
              <Message v-if="uploadWarning" severity="warn" :closable="false" class="rounded-xl">{{ uploadWarning }}</Message>
            </div>

            <Divider />

            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Histórico</p>
                <Tag :value="`${selectedOrder.history.length} eventos`" severity="info" />
              </div>
              <Timeline :value="selectedOrder.history" align="alternate">
                <template #opposite="slotProps">
                  <small class="text-xs text-slate-500 dark:text-slate-400">{{ slotProps.item.at }}</small>
                </template>
                <template #content="slotProps">
                  <p class="text-sm text-slate-700 dark:text-slate-200">{{ slotProps.item.label }}</p>
                </template>
              </Timeline>
            </div>

            <Divider />

            <div class="space-y-3">
              <div class="flex flex-wrap items-center gap-3">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Checklist vinculado</p>
                <Tag :value="checklistProgressLabel" :severity="checklistProgressSeverity" />
              </div>
              <div class="space-y-3">
                <div
                  v-for="item in selectedOrder.checklist"
                  :key="item.id"
                  class="rounded-lg border border-slate-200/70 bg-white/70 p-3 dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                      <Tag v-if="item.required" value="Obrigatório" severity="danger" />
                      <Tag v-else value="Opcional" severity="secondary" />
                      <p class="font-semibold text-slate-800 dark:text-slate-100">{{ item.title }}</p>
                    </div>
                    <SelectButton
                      :options="checklistOptions"
                      :model-value="item.value"
                      option-label="label"
                      option-value="value"
                      @update:model-value="(value) => updateChecklistValue(item.id, value)"
                    />
                  </div>
                  <div class="mt-3 space-y-2">
                    <Textarea
                      v-model="item.notes"
                      auto-resize
                      rows="2"
                      placeholder="Observações ou evidências adicionais"
                      aria-label="Observações da checklist"
                      class="w-full"
                    />
                    <div v-if="item.hasCustomInput" class="rounded-lg border border-dashed border-primary-200/70 p-3 dark:border-primary-400/30">
                      <p class="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-200">
                        Input customizado: {{ item.customInputName }}
                      </p>
                      <component :is="resolveCustomInput(item.customInputId)" :schema="item.customInputSchema" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Message v-if="validationMessage" severity="warn" :closable="false" class="rounded-xl">
              {{ validationMessage }}
            </Message>

            <div class="flex flex-wrap gap-2">
              <Button icon="pi pi-play" label="Iniciar OS" :disabled="selectedOrder.status !== 'pendente'" @click="startOrder(selectedOrder.id)" />
              <Button
                icon="pi pi-check"
                label="Finalizar OS"
                severity="success"
                :disabled="!canFinalize(selectedOrder)"
                @click="finalizeOrder(selectedOrder.id)"
              />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <div class="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <CollaboratorPerformanceCard />
      <GoalConfigurationCard />
    </div>

    <Card>
      <template #title>OS com risco de SLA</template>
      <template #content>
        <DataTable :value="atRiskOrders" size="small" responsive-layout="scroll">
          <Column field="code" header="OS"></Column>
          <Column field="title" header="Título"></Column>
          <Column field="technician" header="Técnico responsável"></Column>
          <Column header="SLA">
            <template #body="{ data }">
              <Tag :value="data.sla" :severity="data.slaSeverity" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <Card>
      <template #title>Andamento dos checklists</template>
      <template #content>
        <div class="space-y-4">
          <div
            v-for="checklist in checklistSummary"
            :key="checklist.title"
            class="rounded-lg border border-slate-200/80 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="font-semibold text-slate-800 dark:text-slate-100">{{ checklist.title }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ checklist.subtitle }}</p>
              </div>
              <Tag :value="checklist.status" :severity="checklist.tagSeverity" />
            </div>
            <ProgressBar :value="checklist.progress" class="mt-3" />
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {{ checklist.progress }}% das OS vinculadas já possuem checklist completo.
            </p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import Column from 'primevue/column';
import DataTable, { type DataTableRowClickEvent } from 'primevue/datatable';
import Divider from 'primevue/divider';
import FileUpload, { type FileUploadSelectEvent, type FileUploadUploaderEvent } from 'primevue/fileupload';
import Message from 'primevue/message';
import ProgressBar from 'primevue/progressbar';
import SelectButton from 'primevue/selectbutton';
import TabMenu from 'primevue/tabmenu';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Timeline from 'primevue/timeline';
import Skeleton from 'primevue/skeleton';
import type { MenuItem } from 'primevue/menuitem';

import CollaboratorPerformanceCard from './service-orders/components/CollaboratorPerformanceCard.vue';
import GoalConfigurationCard from './service-orders/components/GoalConfigurationCard.vue';
import ManagerStatusCard from './service-orders/components/ManagerStatusCard.vue';
import TeamProductivityCard from './service-orders/components/TeamProductivityCard.vue';
import TechnicianPerformanceCard from './service-orders/components/TechnicianPerformanceCard.vue';
import { resolveCustomInputComponent } from '@/helpers_and_formaters/customInputs';

type Status = 'pendente' | 'em_andamento' | 'finalizada';
type ChecklistValue = 'aprovado' | 'rejeitado' | 'nao_aplica' | null;

interface ChecklistItem {
  id: string;
  title: string;
  required: boolean;
  value: ChecklistValue;
  notes: string;
  hasCustomInput?: boolean;
  customInputId?: string;
  customInputName?: string;
  customInputSchema?: Record<string, unknown>;
}

interface ServiceOrder {
  id: string;
  code: string;
  title: string;
  technician: string;
  status: Status;
  description: string;
  checklistTitle: string;
  history: Array<{ at: string; label: string }>;
  attachments: Array<{ name: string; previewUrl?: string; pendingSync?: boolean }>;
  checklist: ChecklistItem[];
}

const statusCards = computed(() => [
  {
    label: 'Pendentes',
    value: serviceOrders.value.filter((order) => order.status === 'pendente').length,
    description: 'Aguardando início e distribuição entre técnicos.',
    icon: 'pi-hourglass',
    iconClass: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
  },
  {
    label: 'Em andamento',
    value: serviceOrders.value.filter((order) => order.status === 'em_andamento').length,
    description: 'Com checklist liberado e coleta de evidências ativa.',
    icon: 'pi-spinner',
    iconClass: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200'
  },
  {
    label: 'Finalizadas',
    value: serviceOrders.value.filter((order) => order.status === 'finalizada').length,
    description: 'Prontas para validação do gerente ou envio ao cliente.',
    icon: 'pi-check-circle',
    iconClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
  }
]);

const statusTabs: MenuItem[] = [
  { label: 'Pendentes', value: 'pendente' },
  { label: 'Em andamento', value: 'em_andamento' },
  { label: 'Finalizadas', value: 'finalizada' }
];

const checklistOptions: Array<{ label: string; value: ChecklistValue }> = [
  { label: 'Aprovado', value: 'aprovado' },
  { label: 'Rejeitado', value: 'rejeitado' },
  { label: 'N/A', value: 'nao_aplica' }
];

const MAX_ATTACHMENT_SIZE = 2 * 1024 * 1024;
const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine;

const serviceOrders = ref<ServiceOrder[]>([
  {
    id: 'os-1',
    code: 'OS-1243',
    title: 'Substituir quadro elétrico',
    technician: 'Luana Pires',
    status: 'pendente',
    description: 'Substituição do quadro elétrico principal com checklist de segurança obrigatório.',
    checklistTitle: 'Checklist padrão de instalação',
    history: [
      { at: 'Hoje 08:15', label: 'OS criada pela manutenção' },
      { at: 'Hoje 09:00', label: 'Checklist vinculado' }
    ],
    attachments: [],
    checklist: [
      {
        id: 'item-1',
        title: 'Bloqueio de energia realizado',
        required: true,
        value: null,
        notes: '',
        hasCustomInput: false
      },
      {
        id: 'item-2',
        title: 'Fotos do painel antes da troca',
        required: true,
        value: null,
        notes: '',
        hasCustomInput: false
      },
      {
        id: 'item-3',
        title: 'Dados do equipamento',
        required: false,
        value: null,
        notes: '',
        hasCustomInput: true,
        customInputId: 'dadosCarro',
        customInputName: 'DadosCarro',
        customInputSchema: { modelo: 'Painel 220V', ano: 2018, placa: 'N/A', chassi: 'ELQ-2291' }
      }
    ]
  },
  {
    id: 'os-2',
    code: 'OS-1251',
    title: 'Revisão preventiva de bomba',
    technician: 'João Mendes',
    status: 'em_andamento',
    description: 'Revisão de bomba hidráulica com coleta de vibração e checklist crítico.',
    checklistTitle: 'Vistoria de segurança',
    history: [
      { at: 'Ontem 14:10', label: 'OS criada pelo gerente' },
      { at: 'Hoje 07:30', label: 'OS iniciada por João Mendes' }
    ],
    attachments: [{ name: 'foto-bomba.jpg' }],
    checklist: [
      {
        id: 'item-4',
        title: 'Registro de vibração',
        required: true,
        value: 'aprovado',
        notes: 'Dentro do esperado',
        hasCustomInput: false
      },
      {
        id: 'item-5',
        title: 'Checklist de EPI',
        required: true,
        value: 'aprovado',
        notes: '',
        hasCustomInput: false
      }
    ]
  },
  {
    id: 'os-3',
    code: 'OS-1259',
    title: 'Entrega pós-serviço',
    technician: 'Carlos Lima',
    status: 'finalizada',
    description: 'Validação com cliente e anexos finais para encerramento da OS.',
    checklistTitle: 'Entrega pós-serviço',
    history: [
      { at: 'Seg 11:00', label: 'OS criada pelo responsável' },
      { at: 'Seg 11:20', label: 'Iniciada por Carlos Lima' },
      { at: 'Seg 15:10', label: 'Checklist finalizado' }
    ],
    attachments: [{ name: 'assinatura-cliente.png' }],
    checklist: [
      {
        id: 'item-6',
        title: 'Feedback do cliente',
        required: true,
        value: 'aprovado',
        notes: 'Cliente satisfeito',
        hasCustomInput: false
      },
      {
        id: 'item-7',
        title: 'Upload de evidências',
        required: true,
        value: 'aprovado',
        notes: 'Fotos anexadas',
        hasCustomInput: false
      }
    ]
  }
]);

const activeStatus = ref<Status>('pendente');
const selectedOrder = ref<ServiceOrder | null>(serviceOrders.value.find((order) => order.status === activeStatus.value) ?? null);
const uploadWarning = ref('');
const ordersLoading = ref(true);
const ordersError = ref('');

const filteredOrders = computed(() => serviceOrders.value.filter((order) => order.status === activeStatus.value));

watch(
  () => activeStatus.value,
  () => {
    const next = filteredOrders.value[0] ?? null;
    selectedOrder.value = next;
  }
);

const activeStatusIndex = computed(() => statusTabs.findIndex((tab) => tab.value === activeStatus.value));

onMounted(() => {
  refreshOrders();
});

const checklistProgressLabel = computed(() => {
  if (!selectedOrder.value) return '';
  const total = selectedOrder.value.checklist.length;
  const completed = selectedOrder.value.checklist.filter((item) => item.value !== null).length;
  return `${completed}/${total} itens respondidos`;
});

const checklistProgressSeverity = computed(() => {
  if (!selectedOrder.value) return 'secondary';
  const total = selectedOrder.value.checklist.length;
  const completed = selectedOrder.value.checklist.filter((item) => item.value !== null).length;
  if (completed === total && total > 0) return 'success';
  if (completed === 0) return 'danger';
  return 'warning';
});

const validationMessage = computed(() => {
  if (!selectedOrder.value) return '';
  if (!selectedOrder.value.title || !selectedOrder.value.technician) {
    return 'Título e responsável são obrigatórios.';
  }

  const hasPendingChecklist = selectedOrder.value.checklist.some((item) => item.required && !item.value);
  if (hasPendingChecklist) {
    return 'Finalize o checklist obrigatório antes de concluir a OS.';
  }

  return '';
});

function statusLabel(status: Status) {
  if (status === 'pendente') return 'Pendente';
  if (status === 'em_andamento') return 'Em andamento';
  return 'Finalizada';
}

function statusSeverity(status: Status) {
  if (status === 'pendente') return 'warning';
  if (status === 'em_andamento') return 'info';
  return 'success';
}

function handleStatusTabChange(event: { index: number }) {
  const tab = statusTabs[event.index];
  if (tab) {
    activeStatus.value = tab.value;
  }
}

function selectOrderById(id: string) {
  const order = serviceOrders.value.find((item) => item.id === id) ?? null;
  selectedOrder.value = order;
}

function onSelectOrder(event: { data: ServiceOrder }) {
  selectedOrder.value = event.data;
}

function onUnselectOrder() {
  selectedOrder.value = null;
}

function onRowClick(event: DataTableRowClickEvent) {
  if (event.data?.id) {
    selectOrderById(event.data.id as string);
  }
}

function startOrder(id: string) {
  updateOrder(id, (order) => {
    order.status = 'em_andamento';
    order.history.push({ at: 'Agora', label: 'OS iniciada pelo técnico' });
  });
  activeStatus.value = 'em_andamento';
}

function finalizeOrder(id: string) {
  updateOrder(id, (order) => {
    if (!canFinalize(order)) return;
    order.status = 'finalizada';
    order.history.push({ at: 'Agora', label: 'OS finalizada com checklist aprovado' });
  });
  activeStatus.value = 'finalizada';
}

function canFinalize(order: ServiceOrder) {
  const hasPendingChecklist = order.checklist.some((item) => item.required && !item.value);
  return !hasPendingChecklist && !!order.title && !!order.technician;
}

function updateOrder(id: string, updater: (order: ServiceOrder) => void) {
  const index = serviceOrders.value.findIndex((item) => item.id === id);
  if (index === -1) return;
  const current = serviceOrders.value[index];
  if (!current) return;
  const clone: ServiceOrder = {
    ...current,
    checklist: current.checklist.map((item) => ({ ...item })),
    attachments: [...current.attachments],
    history: [...current.history]
  };

  updater(clone);
  serviceOrders.value.splice(index, 1, clone);
  if (selectedOrder.value?.id === id) {
    selectedOrder.value = clone;
  }
}

function updateChecklistValue(id: string, value: ChecklistValue) {
  if (!selectedOrder.value) return;
  const orderIndex = serviceOrders.value.findIndex((order) => order.id === selectedOrder.value?.id);
  if (orderIndex === -1) return;

  const order = serviceOrders.value[orderIndex];
  if (!order) return;
  const checklistIndex = order.checklist.findIndex((item) => item.id === id);
  if (checklistIndex === -1) return;

  const updatedChecklist = [...order.checklist];
  const targetItem = updatedChecklist[checklistIndex];
  if (!targetItem) return;
  const updatedItem: ChecklistItem = { ...targetItem, value };
  updatedChecklist[checklistIndex] = updatedItem;

  const updatedOrder: ServiceOrder = { ...order, checklist: updatedChecklist };
  serviceOrders.value.splice(orderIndex, 1, updatedOrder);
  selectedOrder.value = updatedOrder;
}

function resolveCustomInput(customInputId?: string) {
  return resolveCustomInputComponent(customInputId);
}

function onUploadSelect(event: FileUploadSelectEvent) {
  const files = event.files;
  const fileList: File[] = Array.isArray(files) ? files : files ? [files] : [];
  const invalid = fileList.find((file: File) => file.size && file.size > MAX_ATTACHMENT_SIZE);
  uploadWarning.value = invalid ? 'Arquivo acima de 2MB não será enviado.' : '';
}

function onUpload(event: FileUploadUploaderEvent) {
  if (!selectedOrder.value) return;

  const files = event.files;
  const fileList: File[] = Array.isArray(files) ? files : files ? [files] : [];
  const validFiles = fileList.filter((file: File) => !file.size || file.size <= MAX_ATTACHMENT_SIZE);
  if (!validFiles.length) return;

  const newAttachments = validFiles.map((file: File) => {
    const previewUrl =
      'objectURL' in file && typeof (file as { objectURL?: unknown }).objectURL === 'string'
        ? (file as { objectURL?: string }).objectURL
        : undefined;
    return {
      name: file.name,
      previewUrl
    };
  });

  const orderIndex = serviceOrders.value.findIndex((order) => order.id === selectedOrder.value?.id);
  if (orderIndex === -1) return;

  const order = serviceOrders.value[orderIndex];
  if (!order) return;
  const updatedAttachments = [...order.attachments, ...newAttachments.map((file) => ({ ...file, pendingSync: !isOnline }))];
  const updatedOrder: ServiceOrder = { ...order, attachments: updatedAttachments };
  serviceOrders.value.splice(orderIndex, 1, updatedOrder);
  selectedOrder.value = updatedOrder;
}

function refreshOrders() {
  ordersError.value = '';
  ordersLoading.value = true;
  setTimeout(() => {
    ordersLoading.value = false;
    if (!selectedOrder.value) {
      selectedOrder.value = filteredOrders.value[0] ?? null;
    }
  }, 450);
}

function simulateError() {
  ordersLoading.value = false;
  ordersError.value = 'Falha ao carregar ordens de serviço. Tente novamente ou revise sua conexão.';
  selectedOrder.value = null;
}

const atRiskOrders = [
  { code: 'OS-1243', title: 'Substituir quadro elétrico', technician: 'Luana Pires', sla: 'vence em 2h', slaSeverity: 'warning' },
  { code: 'OS-1251', title: 'Revisão preventiva de bomba', technician: 'João Mendes', sla: 'atraso de 1h', slaSeverity: 'danger' },
  { code: 'OS-1259', title: 'Checklist de liberação de máquina', technician: 'Carlos Lima', sla: 'vence hoje', slaSeverity: 'info' }
];

const checklistSummary = [
  { title: 'Checklist padrão de instalação', subtitle: '15 itens, 2 inputs customizados', progress: 72, status: 'Em uso', tagSeverity: 'success' },
  { title: 'Vistoria de segurança', subtitle: 'Campos obrigatórios para EPI e fotos', progress: 54, status: 'Revisão', tagSeverity: 'warning' },
  { title: 'Entrega pós-serviço', subtitle: 'Feedback do cliente e anexos finais', progress: 88, status: 'Estável', tagSeverity: 'info' }
];
</script>
