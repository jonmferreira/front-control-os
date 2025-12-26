export function formatInteger(value: number | null | undefined): string {
  if (value === null || value === undefined) return '0';
  return value.toLocaleString('pt-BR');
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '0%';
  return `${value.toFixed(0)}%`;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
