import type { TimeSeriesData, DashboardFilters } from '../types';

/**
 * Formata número com separador de milhar
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formata duração em horas para string legível
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return `${minutes} min`;
  }

  if (hours < 24) {
    return `${hours.toFixed(1)}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);

  if (remainingHours === 0) {
    return `${days}d`;
  }

  return `${days}d ${remainingHours}h`;
}

/**
 * Calcula tendência entre dois valores
 */
export function calculateTrend(current: number, previous: number): {
  value: number;
  percentage: number;
  isPositive: boolean;
} {
  const difference = current - previous;
  const percentage = previous !== 0 ? (difference / previous) * 100 : 0;

  return {
    value: difference,
    percentage: Math.abs(percentage),
    isPositive: difference >= 0
  };
}

/**
 * Agrupa dados de série temporal por período
 */
export function groupTimeSeriesByPeriod(
  data: TimeSeriesData[],
  period: 'day' | 'week' | 'month'
): TimeSeriesData[] {
  if (period === 'day') return data;

  const grouped = new Map<string, number>();

  data.forEach(item => {
    const date = new Date(item.date);
    let key: string;

    if (period === 'week') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split('T')[0]!;
    } else {
      // month
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    }

    grouped.set(key, (grouped.get(key) || 0) + item.value);
  });

  return Array.from(grouped.entries())
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Gera labels de eixo X para gráficos
 */
export function generateChartLabels(data: TimeSeriesData[]): string[] {
  return data.map(item => {
    const date = new Date(item.date);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short'
    }).format(date);
  });
}

/**
 * Calcula média de um array de números
 */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Serializa filtros para query string
 */
export function serializeFilters(filters: DashboardFilters): string {
  const params = new URLSearchParams();

  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.status) filters.status.forEach(s => params.append('status', s));
  if (filters.priority) filters.priority.forEach(p => params.append('priority', p));
  if (filters.technicianId) params.append('technicianId', filters.technicianId);

  return params.toString();
}

/**
 * Obtém cor baseada em valor de métrica
 */
export function getMetricColor(value: number, thresholds: { good: number; warning: number }): string {
  if (value >= thresholds.good) return '#10b981'; // green
  if (value >= thresholds.warning) return '#f59e0b'; // amber
  return '#ef4444'; // red
}

/**
 * Formata data para input de filtro
 */
export function formatDateForFilter(date: Date): string {
  return date.toISOString().split('T')[0]!;
}

/**
 * Obtém range de datas padrão (últimos 30 dias)
 */
export function getDefaultDateRange(): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  return {
    startDate: formatDateForFilter(startDate),
    endDate: formatDateForFilter(endDate)
  };
}
