const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Formats `YYYY-MM-DD` as `DD-MMM-YYYY` (e.g. 14-May-2025). */
export function formatLeaderDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const mon = MONTHS[m - 1];
  if (!mon) return isoDate;
  const day = String(d).padStart(2, '0');
  return `${day}-${mon}-${y}`;
}
