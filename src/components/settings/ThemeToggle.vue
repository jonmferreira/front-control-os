<template>
  <div class="flex items-center gap-2">
    <i class="pi pi-sun text-slate-500 dark:text-slate-300 text-sm" aria-hidden="true"></i>
    <InputSwitch :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" :aria-label="label" />
    <i class="pi pi-moon text-slate-500 dark:text-slate-300 text-sm" aria-hidden="true"></i>
  </div>
</template>

<script setup lang="ts">
import InputSwitch from 'primevue/inputswitch';

interface Props {
  modelValue: boolean;
  label?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const label = props.label ?? 'Alternar tema';
</script>
