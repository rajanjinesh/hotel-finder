const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (n: number) => String(n).padStart(2, "0");

export function toDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseDate(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, m - 1, d, 12);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

export function todayString(): string {
  return toDateString(new Date());
}

export function addDays(s: string, days: number): string {
  const d = parseDate(s) ?? new Date();
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseDate(checkIn);
  const b = parseDate(checkOut);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

export function formatDate(s: string): string {
  const d = parseDate(s);
  return d ? `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` : "";
}

// "29–30 Oct 2026", "29 Oct – 2 Nov 2026" or "29 Dec 2026 – 2 Jan 2027"
export function formatRange(checkIn: string, checkOut: string): string {
  const a = parseDate(checkIn);
  const b = parseDate(checkOut);
  if (!a || !b) return "";
  if (a.getFullYear() !== b.getFullYear()) return `${formatDate(checkIn)} – ${formatDate(checkOut)}`;
  if (a.getMonth() !== b.getMonth()) {
    return `${a.getDate()} ${MONTHS[a.getMonth()]} – ${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
  }
  return `${a.getDate()}–${b.getDate()} ${MONTHS[b.getMonth()]} ${b.getFullYear()}`;
}

export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
