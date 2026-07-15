import type { Reservations, Facility } from '../../../types/types';

export interface ReservationWithFacility extends Reservations {
  facility?: Facility;
}

export type Tab = 'upcoming' | 'history';

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Oczekujące',
  confirmed: 'Potwierdzone',
  cancelled: 'Anulowane',
  completed: 'Zakończone',
};

const MONTHS_PL = [
  'Stycznia', 'Lutego', 'Marca', 'Kwietnia', 'Maja', 'Czerwca',
  'Lipca', 'Sierpnia', 'Września', 'Października', 'Listopada', 'Grudnia',
];

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTHS_PL[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTime(timeStr: string): string {
  return timeStr.slice(0, 5);
}

export function isUpcoming(r: Reservations): boolean {
  if (r.status === 'cancelled' || r.status === 'completed') return false;
  const now = new Date();
  const resDate = new Date(r.reservation_date + 'T' + r.end_time);
  return resDate >= now;
}
