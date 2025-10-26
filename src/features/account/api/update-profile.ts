import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import type { User } from '@/types';

export type UpdateProfileData = {
  name: string;
  email: string;
};

export const updateProfile = (data: UpdateProfileData): Promise<User> => {
  return apiClient.patch('/account/profile', data);
};

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({ mutationConfig }: UseUpdateProfileOptions = {}) => {
  return useMutation({
    mutationFn: updateProfile,
    ...mutationConfig,
  });
};
