import { type DefaultOptions, QueryClient, type UseMutationOptions, type UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Configuration par défaut pour React Query
export const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  },
};

// Type helper pour extraire les types des queryOptions
export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>;

// Type helper pour les configurations de requêtes
export type QueryConfig<T extends (...args: any) => any> = Omit<
  ReturnType<T>,
  'queryKey' | 'queryFn'
>;

// Type helper pour les mutations
export type MutationConfig<MutationFnType extends (...args: any) => any> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>;

// Créer le QueryClient avec la config par défaut
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});