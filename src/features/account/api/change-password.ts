import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import type { ChangePasswordData } from '@/types';

export type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export const changePassword = (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
  return apiClient.post('/account/change-password', data);
};

type UseChangePasswordOptions = {
  mutationConfig?: MutationConfig<typeof changePassword>;
};

export const useChangePassword = ({ mutationConfig }: UseChangePasswordOptions = {}) => {
  return useMutation({
    mutationFn: changePassword,
    ...mutationConfig,
  });
};
