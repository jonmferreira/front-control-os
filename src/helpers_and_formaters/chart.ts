const palette: [string, ...string[]] = ['#0ea5e9', '#10b981', '#6366f1', '#f97316', '#f59e0b', '#ef4444'];

export function pickColor(index: number): string {
  return palette[index % palette.length]!;
}

export function applyPalette<T extends object>(items: T[]): Array<T & { color: string }> {
  return items.map((item, index) => ({ ...(item as object), color: pickColor(index) } as T & { color: string }));
}
