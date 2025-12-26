<template>
  <div class="space-y-5">
    <Card>
      <template #title>Tema</template>
      <template #content>
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="font-medium text-slate-700 dark:text-slate-200">Modo de cor</p>
            <p class="text-xs text-slate-500 dark:text-slate-400">Escolha entre claro e escuro. Sua preferência é lembrada.</p>
          </div>
          <SelectButton :options="themeOptions" v-model="currentTheme" option-label="label" option-value="value" />
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Densidade e destaque</template>
      <template #content>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300" for="density">Densidade</label>
            <SelectButton id="density" :options="densityOptions" v-model="density" option-label="label" option-value="value" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300" for="accent">Cor de destaque</label>
            <ColorPicker id="accent" v-model="accent" inline format="hex" />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>Pré-visualização</template>
      <template #content>
        <div class="rounded-xl border border-dashed border-slate-300 bg-white/60 p-6 dark:border-slate-700 dark:bg-slate-900/60">
          <p class="text-sm text-slate-500 dark:text-slate-400">Veja como suas escolhas impactam o console das ordens de serviço.</p>
          <div class="mt-4 grid gap-3 md:grid-cols-3">
            <div class="rounded-lg border border-slate-200/80 bg-slate-100/70 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200" :style="{ borderColor: accent, color: accent }">
              <i class="pi pi-clipboard text-xl"></i>
              <p class="mt-2 font-semibold">Checklist</p>
              <p class="text-xs opacity-70">Campos e destaques seguem a cor configurada.</p>
            </div>
            <div class="rounded-lg border border-slate-200/80 bg-slate-100/70 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
              <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Densidade</p>
              <p class="text-sm">{{ densityLabel }}</p>
              <p class="text-xs opacity-70">Controla o espaçamento das listas de OS e detalhes.</p>
            </div>
            <div class="rounded-lg border border-slate-200/80 bg-slate-100/70 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200">
              <p class="text-xs uppercase text-slate-500 dark:text-slate-400">Modo</p>
              <p class="text-sm">{{ isDark ? 'Escuro' : 'Claro' }}</p>
              <p class="text-xs opacity-70">Aplicado imediatamente no painel e nas rotas protegidas.</p>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Card from 'primevue/card';
import ColorPicker from 'primevue/colorpicker';
import SelectButton from 'primevue/selectbutton';

import { useTheme } from '@/composables/useTheme';

const { theme, isDark, setTheme } = useTheme();

const themeOptions = [
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' }
];

const densityOptions = [
  { label: 'Confortável', value: 'comfortable' },
  { label: 'Compacto', value: 'compact' }
];

const density = ref<'comfortable' | 'compact'>('comfortable');
const accent = ref('#3B82F6');

const currentTheme = computed({
  get: () => theme.value,
  set: (value: 'light' | 'dark') => {
    setTheme(value);
  }
});

const densityLabel = computed(() => (density.value === 'compact' ? 'Layout compacto' : 'Layout confortável'));

watch(accent, (value) => {
  document.documentElement.style.setProperty('--accent-preview', value);
});
</script>
