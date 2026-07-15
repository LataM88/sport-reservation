import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  requestProfileUpdate,
  confirmProfileUpdate,
  requestPasswordChange,
  confirmPasswordChange,
  getNotificationPreferences,
  updateNotificationPreferences,
  uploadAvatar,
} from '../api/userProfile';
import type {
  ProfileDataChangeRequest,
  PasswordChangeRequest,
  ConfirmChangeRequest,
  NotificationPreferences,
} from '../types/types';
import { getToken } from '../api/authUtils';

export function useRequestProfileUpdate() {
  return useMutation<{ message: string }, Error, ProfileDataChangeRequest>({
    mutationFn: requestProfileUpdate,
  });
}

export function useConfirmProfileUpdate() {
  const queryClient = useQueryClient();
  return useMutation<{ message: string }, Error, ConfirmChangeRequest>({
    mutationFn: confirmProfileUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useRequestPasswordChange() {
  return useMutation<{ message: string }, Error, PasswordChangeRequest>({
    mutationFn: requestPasswordChange,
  });
}

export function useConfirmPasswordChange() {
  return useMutation<{ message: string }, Error, ConfirmChangeRequest>({
    mutationFn: confirmPasswordChange,
  });
}

export function useNotificationPreferences() {
  return useQuery<NotificationPreferences>({
    queryKey: ['notificationPreferences'],
    queryFn: getNotificationPreferences,
    enabled: !!getToken(),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation<NotificationPreferences, Error, NotificationPreferences>({
    mutationFn: updateNotificationPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences'] });
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation<{ avatar_url: string }, Error, File>({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}
