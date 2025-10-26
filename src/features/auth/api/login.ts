import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import type { LoginCredentials, AuthResponse } from '@/types';

export const login = (credentials: LoginCredentials): Promise<AuthResponse> => {
  return apiClient.post('/auth/login', credentials);
};

type UseLoginOptions = {
  mutationConfig?: MutationConfig<typeof login>;
};

export const useLogin = ({ mutationConfig }: UseLoginOptions = {}) => {
  return useMutation({
    mutationFn: login,
    ...mutationConfig,
  });
};
