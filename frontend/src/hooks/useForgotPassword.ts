import { useMutation } from '@tanstack/react-query';
import { forgotPasswordUser, resetPasswordUser } from '../api/auth';
import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from '../types/types';

export function useForgotPassword() {
  return useMutation<void, Error, ForgotPasswordRequest>({
    mutationFn: forgotPasswordUser,
  });
}

export function useResetPassword() {
  return useMutation<void, Error, ResetPasswordRequest>({
    mutationFn: resetPasswordUser,
  });
}
