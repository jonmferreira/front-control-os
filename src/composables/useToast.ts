import { useToast as usePrimeToast } from 'primevue/usetoast';

export function useToast() {
  const toast = usePrimeToast();

  const showError = (message: string, detail?: string) => {
    toast.add({
      severity: 'error',
      summary: message,
      detail: detail,
      life: 5000,
    });
  };

  const showSuccess = (message: string, detail?: string) => {
    toast.add({
      severity: 'success',
      summary: message,
      detail: detail,
      life: 3000,
    });
  };

  const showWarning = (message: string, detail?: string) => {
    toast.add({
      severity: 'warn',
      summary: message,
      detail: detail,
      life: 4000,
    });
  };

  const showInfo = (message: string, detail?: string) => {
    toast.add({
      severity: 'info',
      summary: message,
      detail: detail,
      life: 3000,
    });
  };

  return { showError, showSuccess, showWarning, showInfo };
}
