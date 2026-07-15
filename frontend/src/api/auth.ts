import { apiClient } from './apiClient';
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../types/types';

export interface TokenResponse {
  token: string;
  user_id: string;
}

export function registerUser(data: RegisterRequest): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function verifyEmail(data: { email: string; code: string }): Promise<TokenResponse> {
  return apiClient<TokenResponse>('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function resendActivationCode(data: { email: string }): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/api/auth/resend-code', {
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

export function forgotPasswordUser(data: ForgotPasswordRequest): Promise<void> {
  return apiClient('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function resetPasswordUser(data: ResetPasswordRequest): Promise<void> {
  return apiClient('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
