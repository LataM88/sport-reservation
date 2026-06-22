import type { Reservations, ReservationCreate } from '../types/types';
import { apiClient } from './apiClient';
import { getToken } from './authUtils';

export async function createReservation(
  data: ReservationCreate,
): Promise<Reservations> {
  return apiClient<Reservations>('/api/reservations/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
}

export async function getFacilityReservations(
  facilityId: string,
  date: string,
): Promise<Reservations[]> {
  return apiClient<Reservations[]>(
    `/api/reservations/facility/${facilityId}?reservation_date=${date}`,
  );
}
