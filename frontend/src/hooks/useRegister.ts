import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/auth';
import type { RegisterRequest } from '../types/types';
import type { TokenResponse } from '../api/auth';

export function useRegister() {
  return useMutation<TokenResponse, Error, RegisterRequest>({
    mutationFn: registerUser,
  });
}
