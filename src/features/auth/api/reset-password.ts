import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import type { ResetPasswordRequest, ResetPasswordConfirm } from '@/types';

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
};

export const requestPasswordReset = (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  return apiClient.post('/auth/reset-password', data);
};

export const confirmPasswordReset = (data: ResetPasswordConfirm): Promise<ResetPasswordResponse> => {
  return apiClient.post('/auth/reset-password/confirm', data);
};

type UseRequestPasswordResetOptions = {
  mutationConfig?: MutationConfig<typeof requestPasswordReset>;
};

export const useRequestPasswordReset = ({ mutationConfig }: UseRequestPasswordResetOptions = {}) => {
  return useMutation({
    mutationFn: requestPasswordReset,
    ...mutationConfig,
  });
};

type UseConfirmPasswordResetOptions = {
  mutationConfig?: MutationConfig<typeof confirmPasswordReset>;
};

export const useConfirmPasswordReset = ({ mutationConfig }: UseConfirmPasswordResetOptions = {}) => {
  return useMutation({
    mutationFn: confirmPasswordReset,
    ...mutationConfig,
  });
};
