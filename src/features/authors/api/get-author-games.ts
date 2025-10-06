import { useQuery, queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type Game } from '@/types';

export const getAuthorGames = ({ authorId }: { authorId: string }): Promise<Game[]> => {
  return apiClient.get(`/authors/${authorId}/games`);
};

export const getAuthorGamesQueryOptions = (authorId: string) => {
  return queryOptions({
    queryKey: ['authors', authorId, 'games'],
    queryFn: () => getAuthorGames({ authorId }),
  });
};

type UseAuthorGamesOptions = {
  authorId: string;
  queryConfig?: QueryConfig<typeof getAuthorGamesQueryOptions>;
};

export const useAuthorGames = ({ authorId, queryConfig }: UseAuthorGamesOptions) => {
  return useQuery({
    ...getAuthorGamesQueryOptions(authorId),
    ...queryConfig,
  });
};
