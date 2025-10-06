import { useQuery, queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type Game } from '@/types';

export const getGame = ({ gameId }: { gameId: string }): Promise<Game> => {
  return apiClient.get(`/games/${gameId}`);
};

export const getGameQueryOptions = (gameId: string) => {
  return queryOptions({
    queryKey: ['games', gameId],
    queryFn: () => getGame({ gameId }),
  });
};

type UseGameOptions = {
  gameId: string;
  queryConfig?: QueryConfig<typeof getGameQueryOptions>;
};

export const useGame = ({ gameId, queryConfig }: UseGameOptions) => {
  return useQuery({
    ...getGameQueryOptions(gameId),
    ...queryConfig,
  });
};