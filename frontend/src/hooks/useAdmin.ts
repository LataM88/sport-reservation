import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAdminFacility, 
  getAdminFacilityReservations,
  updateAdminFacility,
  uploadAdminFacilityPhoto,
  updateReservationStatus,
  createManualReservation,
  getAdminFacilityUsers,
  cancelReservationAdmin
} from '../api/admin';

export function useAdminFacility() {
  return useQuery({
    queryKey: ['admin', 'my-facility'],
    queryFn: getAdminFacility,
  });
}

export function useUploadAdminFacilityPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAdminFacilityPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'my-facility'] });
    },
  });
}

export function useUpdateAdminFacility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdminFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'my-facility'] });
    },
  });
}

export function useAdminReservations() {
  return useQuery({
    queryKey: ['admin', 'my-facility', 'reservations'],
    queryFn: getAdminFacilityReservations,
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateReservationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'my-facility', 'reservations'] });
    },
  });
}

export function useCreateManualReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createManualReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'my-facility', 'reservations'] });
    },
  });
}

export function useAdminFacilityUsers() {
  return useQuery({
    queryKey: ['admin', 'my-facility', 'users'],
    queryFn: getAdminFacilityUsers,
  });
}

export function useAdminCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelReservationAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'my-facility', 'reservations'] });
    },
  });
}
