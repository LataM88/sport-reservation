import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Reservations, ReservationCreate } from '../types/types';
import { createReservation, getFacilityReservations, getMyReservations, cancelReservation } from '../api/reservations';

export function useCreateReservation() {
  return useMutation<Reservations, Error, ReservationCreate>({
    mutationFn: createReservation,
  });
}

export function useMyReservations() {
  return useQuery<Reservations[]>({
    queryKey: ['myReservations'],
    queryFn: getMyReservations,
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation<Reservations, Error, string>({
    mutationFn: cancelReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
    },
  });
}

export function useFacilityReservations(facilityId: string, date: string) {
  return useQuery<Reservations[]>({
    queryKey: ['facilityReservations', facilityId, date],
    queryFn: () => getFacilityReservations(facilityId, date),
    enabled: !!facilityId && !!date,
  });
}

