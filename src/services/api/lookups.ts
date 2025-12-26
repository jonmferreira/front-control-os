import { apiRequest } from './client';

export interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface CnpjData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
}

export const lookupsService = {
  async searchCep(cep: string): Promise<CepData> {
    const cleanCep = cep.replace(/\D/g, '');
    return apiRequest<CepData>(`/cep/${cleanCep}`);
  },

  async searchCnpj(cnpj: string): Promise<CnpjData> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    return apiRequest<CnpjData>(`/cnpj/${cleanCnpj}`);
  },
};
