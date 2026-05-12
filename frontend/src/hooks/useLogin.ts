import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/auth';
import type { LoginRequest } from '../types/types';
import type { TokenResponse } from '../api/auth';

export function useLogin() {
  return useMutation<TokenResponse, Error, LoginRequest>({
    mutationFn: loginUser,
  });
}
