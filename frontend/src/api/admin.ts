import type { Facility, FacilityUpdate, AdminReservation, ManualReservationCreate, User } from '../types/types';
import { apiClient } from './apiClient';
import { getToken } from './authUtils';

export async function getAdminFacility(): Promise<Facility> {
  return apiClient<Facility>('/api/admin/my-facility', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export async function updateAdminFacility(data: FacilityUpdate): Promise<Facility> {
  return apiClient<Facility>('/api/admin/my-facility', {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data),
  });
}

export async function uploadAdminFacilityPhoto(file: File): Promise<{ image_url: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiClient<{ image_url: string }>('/api/admin/my-facility/photo', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData as any,
  });
}

export async function getAdminFacilityReservations(): Promise<AdminReservation[]> {
  return apiClient<AdminReservation[]>('/api/admin/my-facility/reservations', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export async function updateReservationStatus(data: { reservationId: string, status: string }): Promise<AdminReservation> {
  return apiClient<AdminReservation>(`/api/admin/reservations/${data.reservationId}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ status: data.status }),
  });
}

export async function createManualReservation(data: ManualReservationCreate): Promise<AdminReservation> {
  return apiClient<AdminReservation>('/api/admin/reservations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data),
  });
}

export async function getAdminFacilityUsers(): Promise<User[]> {
  return apiClient<User[]>('/api/admin/my-facility/users', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export async function cancelReservationAdmin(reservationId: string): Promise<AdminReservation> {
  return apiClient<AdminReservation>(`/api/admin/reservations/${reservationId}/cancel`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}
