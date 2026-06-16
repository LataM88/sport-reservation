import { apiClient } from './apiClient';
import { getToken } from './authUtils';
import type { User } from '../types/types';

export async function getUser(): Promise<User> {
  const token = getToken();
  if (!token) {
    throw new Error('Brak tokenu autoryzacji');
  }

  return apiClient<User>('/api/auth/get-user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
