// lib/day.ts
//
// Day boundaries follow the user's own clock, not UTC.
// toISOString() returns UTC, which rolls the day over at the wrong hour
// for anyone outside GMT — wrong for a morning reflection app.

export function localDay(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// The local day a stored ISO timestamp belongs to.
export function dayOf(iso: string): string {
  return localDay(new Date(iso));
}

export function todayKey(): string {
  return localDay();
}

// Yesterday, in local terms.
export function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return localDay(d);
}