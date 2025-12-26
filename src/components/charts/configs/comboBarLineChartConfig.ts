import type { ChartData, ChartOptions } from 'chart.js';

export type ComboSeriesType = 'bar' | 'line';

export interface ComboBarLineSeries {
  label: string;
  data: number[];
  color: string;
  type: ComboSeriesType;
}

export interface ComboBarLineChartConfig {
  labels: string[];
  series: ComboBarLineSeries[];
}

export interface BuiltComboBarLineChartConfig {
  data: ChartData<'bar' | 'line'>;
  options: ChartOptions<'bar' | 'line'>;
}

export function buildComboBarLineChartConfig(config: ComboBarLineChartConfig): BuiltComboBarLineChartConfig {
  return {
    data: {
      labels: config.labels,
      datasets: config.series.map((serie) => ({
        type: serie.type,
        label: serie.label,
        data: serie.data,
        backgroundColor: serie.type === 'bar' ? serie.color : `${serie.color}33`,
        borderColor: serie.color,
        borderWidth: serie.type === 'line' ? 3 : 1,
        tension: 0.3,
        fill: serie.type === 'line' ? false : true,
        stack: serie.type === 'bar' ? 'stack' : undefined,
        pointRadius: serie.type === 'line' ? 0 : undefined,
        pointHoverRadius: serie.type === 'line' ? 4 : undefined,
        borderDash: serie.type === 'line' ? [6, 6] : undefined
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom' }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  };
}
