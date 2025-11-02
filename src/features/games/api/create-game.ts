import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { queryClient } from '@/lib/react-query';
import type { Game, GameInput } from '@/types';

export const createGame = (data: GameInput): Promise<Game> => {
  // Remove mechanics array as backend expects IDs only
  const { mechanics, ...payloadData } = data;

  return apiClient.post('/games', {
    ...payloadData,
    mechanicIds: data.mechanics.map(m => m.id),
  });
};

type UseCreateGameOptions = {
  mutationConfig?: MutationConfig<typeof createGame>;
};

export const useCreateGame = ({ mutationConfig }: UseCreateGameOptions = {}) => {
  return useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      // Invalidate games list to refetch
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    ...mutationConfig,
  });
};
