import type { ChartData, ChartOptions } from 'chart.js';

export interface StackedBarSeries {
  label: string;
  backgroundColor: string;
  data: number[];
}

export interface StackedBarChartConfig {
  labels: string[];
  series: StackedBarSeries[];
}

export interface BuiltStackedBarChartConfig {
  data: ChartData<'bar'>;
  options: ChartOptions<'bar'>;
}

export function buildStackedBarChartConfig(config: StackedBarChartConfig): BuiltStackedBarChartConfig {
  return {
    data: {
      labels: config.labels,
      datasets: config.series.map((serie) => ({
        label: serie.label,
        data: serie.data,
        backgroundColor: serie.backgroundColor,
        borderRadius: 6,
        stack: 'stack'
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
