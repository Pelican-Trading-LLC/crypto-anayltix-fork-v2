export function formatPrice(value: number): string {
  if (value >= 1000) return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (value >= 1) return '$' + value.toFixed(2);
  if (value >= 0.01) return '$' + value.toFixed(4);
  if (value >= 0.0001) return '$' + value.toFixed(6);
  const str = value.toFixed(10);
  const match = str.match(/^0\.(0+)(\d{2})/);
  if (match) return '$0.' + match[1] + match[2];
  return '$' + value.toFixed(8);
}

export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1e9) return sign + '$' + (abs / 1e9).toFixed(1) + 'B';
  if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return sign + '$' + (abs / 1e3).toFixed(1) + 'K';
  return sign + '$' + abs.toFixed(0);
}

export function formatPercent(value: number | null): string {
  if (value === null || value === undefined) return '—';
  const sign = value > 0 ? '+' : '';
  if (Math.abs(value) >= 100) return sign + Math.round(value) + '%';
  return sign + value.toFixed(2) + '%';
}

export function formatInteger(value: number): string {
  return value.toLocaleString('en-US');
}
