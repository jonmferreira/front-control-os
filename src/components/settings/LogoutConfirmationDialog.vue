<template>
  <div class="space-y-6">
    <p class="text-sm text-slate-600 dark:text-slate-300">Tem certeza que deseja encerrar a sessão?</p>
    <div class="flex justify-end gap-3">
      <Button label="Cancelar" severity="secondary" text @click="onCancel" />
      <Button label="Confirmar" severity="danger" @click="onConfirm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import { useDialog } from 'primevue/usedialog';

const dialog = useDialog();

const closeDialog = (payload?: unknown) => {
  const instance = dialog as unknown as { close?: (params?: unknown) => void };
  instance.close?.(payload);
};

const onCancel = () => {
  closeDialog();
};

const onConfirm = () => {
  console.info('Logout confirmado');
  closeDialog({ confirmed: true });
};
</script>
