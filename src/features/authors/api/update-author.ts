import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import type { Author } from '@/types';

export type UpdateAuthorInput = {
  name?: string;
  photoUrl?: string;
  region?: string;
  bio?: string;
  specialties?: string[];
  contactEmail?: string;
  achievements?: string[];
  website?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  bggUrl?: string;
};

export const updateAuthor = ({
  authorId,
  data,
}: {
  authorId: number;
  data: UpdateAuthorInput;
}): Promise<Author> => {
  return apiClient.put(`/authors/${authorId}`, data);
};

type UseUpdateAuthorOptions = {
  mutationConfig?: MutationConfig<typeof updateAuthor>;
};

export const useUpdateAuthor = ({ mutationConfig }: UseUpdateAuthorOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAuthor,
    onSuccess: (data) => {
      // Invalidate and refetch author queries
      queryClient.invalidateQueries({ queryKey: ['authors'] });
      queryClient.setQueryData(['authors', String(data.id)], data);
    },
    ...mutationConfig,
  });
};
