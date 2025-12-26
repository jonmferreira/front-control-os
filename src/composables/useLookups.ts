import { ref } from 'vue';
import { lookupsService, type CepData, type CnpjData } from '@/services/api/lookups';

export function useCepLookup() {
  const data = ref<CepData | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const search = async (cep: string) => {
    loading.value = true;
    error.value = null;
    try {
      data.value = await lookupsService.searchCep(cep);
    } catch (e) {
      error.value = e as Error;
      data.value = null;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = null;
    error.value = null;
    loading.value = false;
  };

  return { data, loading, error, search, reset };
}

export function useCnpjLookup() {
  const data = ref<CnpjData | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const search = async (cnpj: string) => {
    loading.value = true;
    error.value = null;
    try {
      data.value = await lookupsService.searchCnpj(cnpj);
    } catch (e) {
      error.value = e as Error;
      data.value = null;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = null;
    error.value = null;
    loading.value = false;
  };

  return { data, loading, error, search, reset };
}
