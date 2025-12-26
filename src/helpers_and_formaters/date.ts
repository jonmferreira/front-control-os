export function formatDayMonth(date: Date | string): string {
  const target = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(target.getTime())) return '--/--';
  return target.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function formatMonthAbbr(date: Date | string): string {
  const target = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(target.getTime())) return '--';
  return target.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
}

export function buildLastNDaysLabels(days: number): string[] {
  const today = new Date();
  return Array.from({ length: days }).map((_, index) => {
    const current = new Date(today);
    current.setDate(current.getDate() - (days - 1 - index));
    return formatDayMonth(current);
  });
}
