import { useQuery, queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type Game } from '@/types';

// Get games created by the current user (including drafts)
export const getMyGames = (): Promise<Game[]> => {
  return apiClient.get('/games/my-games');
};

export const getMyGamesQueryOptions = () => {
  return queryOptions({
    queryKey: ['games', 'my-games'],
    queryFn: () => getMyGames(),
  });
};

type UseMyGamesOptions = {
  queryConfig?: QueryConfig<typeof getMyGamesQueryOptions>;
};

export const useMyGames = ({ queryConfig }: UseMyGamesOptions = {}) => {
  return useQuery({
    ...getMyGamesQueryOptions(),
    ...queryConfig,
  });
};
