import { useQuery, queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type Mechanic } from '@/types';

export const getMechanics = (): Promise<{ data: Mechanic[] }> => {
  return apiClient.get<Mechanic[]>('/mechanics');
};

export const getMechanicsQueryOptions = () => {
  return queryOptions({
    queryKey: ['mechanics'],
    queryFn: () => getMechanics(),
  });
};

type UseMechanicsOptions = {
  queryConfig?: QueryConfig<typeof getMechanicsQueryOptions>;
};

export const useMechanics = ({ queryConfig }: UseMechanicsOptions = {}) => {
  return useQuery({
    ...getMechanicsQueryOptions(),
    ...queryConfig,
  });
};
