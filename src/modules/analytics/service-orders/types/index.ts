/**
 * Tipos para análise e métricas de Ordens de Serviço
 */

/**
 * Métricas gerais de OS
 */
export interface ServiceOrderMetrics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  averageCompletionTime: number; // em horas
  completionRate: number; // percentual
  overdueCount: number;
}

/**
 * Dados para gráfico de linha temporal
 */
export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

/**
 * Dados por status
 */
export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color?: string;
}

/**
 * Dados por prioridade
 */
export interface PriorityDistribution {
  priority: string;
  count: number;
  percentage: number;
  color?: string;
}

/**
 * Métricas de técnico
 */
export interface TechnicianMetrics {
  id: string;
  name: string;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  pending: number;
  averageCompletionTime: number;
  completionRate: number;
}

/**
 * Dados de SLA
 */
export interface SLAMetrics {
  total: number;
  onTime: number;
  delayed: number;
  atRisk: number;
  complianceRate: number;
}

/**
 * Filtros para dashboards
 */
export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  status?: string[];
  priority?: string[];
  technicianId?: string;
}

/**
 * Dados consolidados do dashboard
 */
export interface DashboardData {
  metrics: ServiceOrderMetrics;
  statusDistribution: StatusDistribution[];
  priorityDistribution: PriorityDistribution[];
  timeSeriesCreated: TimeSeriesData[];
  timeSeriesCompleted: TimeSeriesData[];
  slaMetrics: SLAMetrics;
  topTechnicians: TechnicianMetrics[];
}
