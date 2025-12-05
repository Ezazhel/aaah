import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';

export type InvitationVerification = {
  valid: boolean;
  email: string;
  expiresAt: string;
  authorId?: number;
  authorFirstname?: string;
  authorLastname?: string;
};

export const verifyInvitation = (token: string): Promise<InvitationVerification> => {
  return apiClient.get(`/auth/invitation/verify/${token}`);
};

type UseVerifyInvitationOptions = {
  token: string;
  queryConfig?: QueryConfig<typeof verifyInvitation>;
};

export const useVerifyInvitation = ({ token, queryConfig }: UseVerifyInvitationOptions) => {
  return useQuery({
    queryKey: ['invitation', 'verify', token],
    queryFn: () => verifyInvitation(token),
    enabled: !!token,
    ...queryConfig,
  });
};
