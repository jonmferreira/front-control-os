import type {
  ServiceOrderMetrics,
  StatusDistribution,
  PriorityDistribution,
  TimeSeriesData,
  TechnicianMetrics,
  SLAMetrics,
  DashboardData
} from '../types';

/**
 * Mock de métricas gerais
 */
export const mockMetrics: ServiceOrderMetrics = {
  total: 156,
  pending: 32,
  inProgress: 45,
  completed: 68,
  cancelled: 11,
  averageCompletionTime: 18.5,
  completionRate: 85.2,
  overdueCount: 8
};

/**
 * Mock de distribuição por status
 */
export const mockStatusDistribution: StatusDistribution[] = [
  { status: 'Pendente', count: 32, percentage: 20.5, color: '#f59e0b' },
  { status: 'Em Andamento', count: 45, percentage: 28.8, color: '#3b82f6' },
  { status: 'Concluída', count: 68, percentage: 43.6, color: '#10b981' },
  { status: 'Cancelada', count: 11, percentage: 7.1, color: '#ef4444' }
];

/**
 * Mock de distribuição por prioridade
 */
export const mockPriorityDistribution: PriorityDistribution[] = [
  { priority: 'Baixa', count: 42, percentage: 26.9, color: '#10b981' },
  { priority: 'Média', count: 65, percentage: 41.7, color: '#3b82f6' },
  { priority: 'Alta', count: 38, percentage: 24.4, color: '#f59e0b' },
  { priority: 'Urgente', count: 11, percentage: 7.0, color: '#ef4444' }
];

/**
 * Mock de série temporal de OS criadas
 */
export const mockTimeSeriesCreated: TimeSeriesData[] = [
  { date: '2025-12-22', value: 12 },
  { date: '2025-12-23', value: 8 },
  { date: '2025-12-24', value: 5 },
  { date: '2025-12-25', value: 3 },
  { date: '2025-12-26', value: 15 },
  { date: '2025-12-27', value: 18 },
  { date: '2025-12-28', value: 22 }
];

/**
 * Mock de série temporal de OS concluídas
 */
export const mockTimeSeriesCompleted: TimeSeriesData[] = [
  { date: '2025-12-22', value: 10 },
  { date: '2025-12-23', value: 9 },
  { date: '2025-12-24', value: 6 },
  { date: '2025-12-25', value: 4 },
  { date: '2025-12-26', value: 12 },
  { date: '2025-12-27', value: 14 },
  { date: '2025-12-28', value: 13 }
];

/**
 * Mock de métricas de SLA
 */
export const mockSLAMetrics: SLAMetrics = {
  total: 145,
  onTime: 112,
  delayed: 25,
  atRisk: 8,
  complianceRate: 77.2
};

/**
 * Mock de métricas por técnico
 */
export const mockTechnicianMetrics: TechnicianMetrics[] = [
  {
    id: 'tech-001',
    name: 'João Silva',
    totalAssigned: 48,
    completed: 35,
    inProgress: 10,
    pending: 3,
    averageCompletionTime: 16.2,
    completionRate: 87.5
  },
  {
    id: 'tech-002',
    name: 'Maria Santos',
    totalAssigned: 42,
    completed: 32,
    inProgress: 8,
    pending: 2,
    averageCompletionTime: 17.8,
    completionRate: 88.9
  },
  {
    id: 'tech-003',
    name: 'Pedro Costa',
    totalAssigned: 38,
    completed: 28,
    inProgress: 7,
    pending: 3,
    averageCompletionTime: 19.5,
    completionRate: 82.4
  },
  {
    id: 'tech-004',
    name: 'Ana Oliveira',
    totalAssigned: 28,
    completed: 22,
    inProgress: 5,
    pending: 1,
    averageCompletionTime: 15.3,
    completionRate: 91.7
  }
];

/**
 * Mock de dados consolidados do dashboard
 */
export const mockDashboardData: DashboardData = {
  metrics: mockMetrics,
  statusDistribution: mockStatusDistribution,
  priorityDistribution: mockPriorityDistribution,
  timeSeriesCreated: mockTimeSeriesCreated,
  timeSeriesCompleted: mockTimeSeriesCompleted,
  slaMetrics: mockSLAMetrics,
  topTechnicians: mockTechnicianMetrics
};
