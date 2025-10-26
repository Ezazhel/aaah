import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type MutationConfig } from '@/lib/react-query';
import { queryClient } from '@/lib/react-query';

export const deleteGame = (gameId: string): Promise<{ success: boolean }> => {
  return apiClient.delete(`/games/${gameId}`);
};

type UseDeleteGameOptions = {
  mutationConfig?: MutationConfig<typeof deleteGame>;
};

export const useDeleteGame = ({ mutationConfig }: UseDeleteGameOptions = {}) => {
  return useMutation({
    mutationFn: deleteGame,
    onSuccess: () => {
      // Invalidate games list
      queryClient.invalidateQueries({ queryKey: ['games'] });
    },
    ...mutationConfig,
  });
};
