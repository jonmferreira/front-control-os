import type { ChartData, ChartOptions } from 'chart.js';

export interface LineSeries {
  label: string;
  borderColor: string;
  data: number[];
  dashed?: boolean;
  borderWidth?: number;
  fill?: boolean;
}

export interface LineChartConfig {
  labels: string[];
  series: LineSeries[];
}

export interface BuiltLineChartConfig {
  data: ChartData<'line'>;
  options: ChartOptions<'line'>;
}

export function buildLineChartConfig(config: LineChartConfig): BuiltLineChartConfig {
  return {
    data: {
      labels: config.labels,
      datasets: config.series.map((serie) => ({
        label: serie.label,
        data: serie.data,
        borderColor: serie.borderColor,
        borderWidth: serie.borderWidth ?? 2,
        borderDash: serie.dashed ? [6, 6] : undefined,
        backgroundColor: serie.fill ? `${serie.borderColor}33` : 'transparent',
        fill: serie.fill ?? false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  };
}
