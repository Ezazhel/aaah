import { useQuery, queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type Game } from '@/types';

export const getGames = (): Promise<{ data: Game[] }> => {
  return apiClient.get<Game[]>('/games');
};

export const getGamesQueryOptions = () => {
  return queryOptions({
    queryKey: ['games'],
    queryFn: () => getGames(),
  });
};

type UseGamesOptions = {
  queryConfig?: QueryConfig<typeof getGamesQueryOptions>;
};

export const useGames = ({ queryConfig }: UseGamesOptions = {}) => {
  return useQuery({
    ...getGamesQueryOptions(),
    ...queryConfig,
  });
};

export const useFeaturedGames = ({ queryConfig }: UseGamesOptions = {}) => {
  return useQuery({
    ...getGamesQueryOptions(),
    select: (data) => {
      // data is { data: Game[] }
      // Return the last 3 games (assuming most recent are last in array)
      return {data: data.data.slice(-3).reverse()};
    },
    ...queryConfig,
  });
};
