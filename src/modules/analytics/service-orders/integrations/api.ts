import { apiRequest } from '@/services/api/client';
import type { DashboardData, DashboardFilters } from '../types';
import { serializeFilters } from '../helpers';

/**
 * Busca dados consolidados do dashboard
 */
export async function fetchDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
  const queryString = filters ? `?${serializeFilters(filters)}` : '';
  const data = await apiRequest<DashboardData>(`/analytics/dashboard${queryString}`);
  return data;
}

/**
 * Busca métricas gerais de OS
 */
export async function fetchServiceOrderMetrics(filters?: DashboardFilters) {
  const queryString = filters ? `?${serializeFilters(filters)}` : '';
  const data = await apiRequest(`/analytics/service-orders/metrics${queryString}`);
  return data;
}

/**
 * Busca distribuição por status
 */
export async function fetchStatusDistribution(filters?: DashboardFilters) {
  const queryString = filters ? `?${serializeFilters(filters)}` : '';
  const data = await apiRequest(`/analytics/service-orders/status-distribution${queryString}`);
  return data;
}

/**
 * Busca distribuição por prioridade
 */
export async function fetchPriorityDistribution(filters?: DashboardFilters) {
  const queryString = filters ? `?${serializeFilters(filters)}` : '';
  const data = await apiRequest(`/analytics/service-orders/priority-distribution${queryString}`);
  return data;
}

/**
 * Busca série temporal de OS
 */
export async function fetchTimeSeries(filters?: DashboardFilters) {
  const queryString = filters ? `?${serializeFilters(filters)}` : '';
  const data = await apiRequest(`/analytics/service-orders/time-series${queryString}`);
  return data;
}

/**
 * Busca métricas de SLA
 */
export async function fetchSLAMetrics(filters?: DashboardFilters) {
  const queryString = filters ? `?${serializeFilters(filters)}` : '';
  const data = await apiRequest(`/analytics/service-orders/sla-metrics${queryString}`);
  return data;
}

/**
 * Busca métricas de técnicos
 */
export async function fetchTechnicianMetrics(filters?: DashboardFilters) {
  const queryString = filters ? `?${serializeFilters(filters)}` : '';
  const data = await apiRequest(`/analytics/technicians/metrics${queryString}`);
  return data;
}

/**
 * Exporta relatório em PDF
 */
export async function exportReportPDF(filters?: DashboardFilters): Promise<Blob> {
  const queryString = filters ? `?${serializeFilters(filters)}` : '';
  const blob = await apiRequest<Blob>(`/analytics/reports/export-pdf${queryString}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/pdf'
    }
  });
  return blob;
}

/**
 * Exporta relatório em Excel
 */
export async function exportReportExcel(filters?: DashboardFilters): Promise<Blob> {
  const queryString = filters ? `?${serializeFilters(filters)}` : '';
  const blob = await apiRequest<Blob>(`/analytics/reports/export-excel${queryString}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  });
  return blob;
}
