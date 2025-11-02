import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { queryClient } from '@/lib/react-query';
import type { Game, GameInput } from '@/types';

export type UpdateGameData = GameInput & {
  id: string;
};

export const updateGame = ({ id, ...data }: UpdateGameData): Promise<Game> => {
  // Remove mechanics array as backend expects IDs only
  const { mechanics, ...payloadData } = data;

  return apiClient.put(`/games/${id}`, {
    ...payloadData,
    mechanicIds: data.mechanics.map(m => m.id),
  });
};

type UseUpdateGameOptions = {
  mutationConfig?: MutationConfig<typeof updateGame>;
};

export const useUpdateGame = ({ mutationConfig }: UseUpdateGameOptions = {}) => {
  return useMutation({
    mutationFn: updateGame,
    onSuccess: (data) => {
      // Invalidate games list and specific game
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['game', data.id] });
    },
    ...mutationConfig,
  });
};
