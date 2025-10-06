import { useQuery, queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type Author } from '@/types';

export const getAuthor = ({ authorId }: { authorId: string }): Promise<Author> => {
  return apiClient.get(`/authors/${authorId}`);
};

export const getAuthorQueryOptions = (authorId: string) => {
  return queryOptions({
    queryKey: ['authors', authorId],
    queryFn: () => getAuthor({ authorId }),
    enabled: !!authorId,
  });
};

type UseAuthorOptions = {
  authorId: string;
  queryConfig?: QueryConfig<typeof getAuthorQueryOptions>;
};

export const useAuthor = ({ authorId, queryConfig }: UseAuthorOptions) => {
  return useQuery({
    ...getAuthorQueryOptions(authorId),
    ...queryConfig,
  });
};