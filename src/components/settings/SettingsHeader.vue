<template>
  <header class="flex items-center justify-between gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/80 lg:px-6">
    <div class="flex min-w-0 items-center gap-3">
      <Button
        v-if="showBack"
        text
        rounded
        severity="secondary"
        icon="pi pi-arrow-left"
        @click="emit('back')"
        aria-label="Voltar"
        class="lg:hidden"
      />
      <div class="min-w-0">
        <h1 class="truncate text-lg font-semibold text-slate-800 dark:text-slate-100">{{ title }}</h1>
        <p v-if="subtitle" class="truncate text-sm text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
      </div>
    </div>
    <div class="flex items-center gap-4">
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from 'primevue/button';

defineProps<{
  title: string;
  subtitle?: string;
  showBack?: boolean;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
}>();
</script>
