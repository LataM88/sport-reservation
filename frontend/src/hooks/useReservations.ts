import { useMutation, useQuery } from '@tanstack/react-query';
import type { Reservations, ReservationCreate } from '../types/types';
import { createReservation, getFacilityReservations } from '../api/reservations';

export function useCreateReservation() {
  return useMutation<Reservations, Error, ReservationCreate>({
    mutationFn: createReservation,
  });
}

export function useFacilityReservations(facilityId: string, date: string) {
  return useQuery<Reservations[]>({
    queryKey: ['facilityReservations', facilityId, date],
    queryFn: () => getFacilityReservations(facilityId, date),
    enabled: !!facilityId && !!date,
  });
}
