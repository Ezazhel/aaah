import { useQuery, queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type Author } from '@/types';

export const getAuthors = (): Promise<{ data: Author[] }> => {
  return apiClient.get<Author[]>('/authors');
};

export const getAuthorsQueryOptions = () => {
  return queryOptions({
    queryKey: ['authors'],
    queryFn: () => getAuthors(),
  });
};

type UseAuthorsOptions = {
  queryConfig?: QueryConfig<typeof getAuthorsQueryOptions>;
};

export const useAuthors = ({ queryConfig }: UseAuthorsOptions = {}) => {
  return useQuery({
    ...getAuthorsQueryOptions(),
    ...queryConfig,
  });
};