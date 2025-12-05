import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import type { Author } from '@/types';

export type UpdateAuthorInput = {
  firstname?: string;
  lastname?: string;
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
  data: UpdateAuthorInput | FormData;
}): Promise<Author> => {
  // Si c'est FormData, utiliser multipart/form-data
  if (data instanceof FormData) {
    return apiClient.put(`/authors/${authorId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Sinon, envoyer en JSON comme avant
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
