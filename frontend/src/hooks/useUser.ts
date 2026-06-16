import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/users';
import { getToken } from '../api/authUtils';
import type { User } from '../types/types';

export function useUser() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: getUser,
    enabled: !!getToken(),
    retry: false,
  });
}
