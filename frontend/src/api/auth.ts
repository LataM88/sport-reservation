import { apiClient } from './apiClient';
import type { RegisterRequest, LoginRequest } from '../types/types';

export interface TokenResponse {
  token: string;
  user_id: string;
}

export function registerUser(data: RegisterRequest): Promise<TokenResponse> {
  return apiClient<TokenResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function loginUser(data: LoginRequest): Promise<TokenResponse> {
  return apiClient<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
