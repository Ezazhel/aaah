import { useMutation, useQuery, queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig, type QueryConfig } from '@/lib/react-query';
import type { Invitation } from '@/types';
import { queryClient } from '@/lib/react-query';

// ========== Create Invitation ==========
export type CreateInvitationData = {
  email: string;
};

export const createInvitation = (data: CreateInvitationData): Promise<Invitation> => {
  return apiClient.post('/admin/invitations', data);
};

type UseCreateInvitationOptions = {
  mutationConfig?: MutationConfig<typeof createInvitation>;
};

export const useCreateInvitation = ({ mutationConfig }: UseCreateInvitationOptions = {}) => {
  return useMutation({
    mutationFn: createInvitation,
    onSuccess: () => {
      // Invalidate invitations list to refetch
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
    ...mutationConfig,
  });
};

// ========== Get Invitations List ==========
export const getInvitations = (): Promise<{ data: Invitation[] }> => {
  return apiClient.get<Invitation[]>('/admin/invitations');
};

export const getInvitationsQueryOptions = () => {
  return queryOptions({
    queryKey: ['invitations'],
    queryFn: () => getInvitations(),
  });
};

type UseInvitationsOptions = {
  queryConfig?: QueryConfig<typeof getInvitationsQueryOptions>;
};

export const useInvitations = ({ queryConfig }: UseInvitationsOptions = {}) => {
  return useQuery({
    ...getInvitationsQueryOptions(),
    ...queryConfig,
  });
};

// ========== Delete Invitation ==========
export const deleteInvitation = (invitationId: string): Promise<{ success: boolean }> => {
  return apiClient.delete(`/admin/invitations/${invitationId}`);
};

type UseDeleteInvitationOptions = {
  mutationConfig?: MutationConfig<typeof deleteInvitation>;
};

export const useDeleteInvitation = ({ mutationConfig }: UseDeleteInvitationOptions = {}) => {
  return useMutation({
    mutationFn: deleteInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
    ...mutationConfig,
  });
};

// ========== Resend Invitation ==========
export const resendInvitation = (invitationId: string): Promise<{ success: boolean }> => {
  return apiClient.post(`/admin/invitations/${invitationId}/resend`, {});
};

type UseResendInvitationOptions = {
  mutationConfig?: MutationConfig<typeof resendInvitation>;
};

export const useResendInvitation = ({ mutationConfig }: UseResendInvitationOptions = {}) => {
  return useMutation({
    mutationFn: resendInvitation,
    ...mutationConfig,
  });
};
