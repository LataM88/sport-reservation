import { apiClient } from './apiClient';
import { getToken } from './authUtils';
import type {
  ProfileDataChangeRequest,
  PasswordChangeRequest,
  ConfirmChangeRequest,
  NotificationPreferences,
} from '../types/types';

function authHeaders() {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }
  return { Authorization: `Bearer ${token}` };
}

export function requestProfileUpdate(
  data: ProfileDataChangeRequest,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/api/users/profile', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export function confirmProfileUpdate(
  data: ConfirmChangeRequest,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/api/users/profile/confirm', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export function requestPasswordChange(
  data: PasswordChangeRequest,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/api/users/password', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export function confirmPasswordChange(
  data: ConfirmChangeRequest,
): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/api/users/password/confirm', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export function getNotificationPreferences(): Promise<NotificationPreferences> {
  return apiClient<NotificationPreferences>('/api/users/notifications', {
    headers: authHeaders(),
  });
}

export function updateNotificationPreferences(
  data: NotificationPreferences,
): Promise<NotificationPreferences> {
  return apiClient<NotificationPreferences>('/api/users/notifications', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export function uploadAvatar(file: File): Promise<{ avatar_url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient<{ avatar_url: string }>('/api/users/avatar', {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });
}

