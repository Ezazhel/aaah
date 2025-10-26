import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import type { RegisterData, AuthResponse } from '@/types';

export const register = (data: RegisterData): Promise<AuthResponse> => {
  return apiClient.post('/auth/register', data);
};

type UseRegisterOptions = {
  mutationConfig?: MutationConfig<typeof register>;
};

export const useRegister = ({ mutationConfig }: UseRegisterOptions = {}) => {
  return useMutation({
    mutationFn: register,
    ...mutationConfig,
  });
};
