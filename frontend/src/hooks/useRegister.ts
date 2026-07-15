import { useMutation } from '@tanstack/react-query';
import { registerUser, verifyEmail, resendActivationCode } from '../api/auth';
import type { RegisterRequest } from '../types/types';
import type { TokenResponse } from '../api/auth';

export function useRegister() {
  return useMutation<{ message: string }, Error, RegisterRequest>({
    mutationFn: registerUser,
  });
}

export function useVerifyEmail() {
  return useMutation<TokenResponse, Error, { email: string; code: string }>({
    mutationFn: verifyEmail,
  });
}

export function useResendActivationCode() {
  return useMutation<{ message: string }, Error, { email: string }>({
    mutationFn: resendActivationCode,
  });
}
