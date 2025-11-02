import { useQuery, queryOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { type QueryConfig } from '@/lib/react-query';
import { type Category } from '@/types';

export const getCategories = (): Promise<{ data: Category[] }> => {
  return apiClient.get<Category[]>('/categories');
};

export const getCategoriesQueryOptions = () => {
  return queryOptions({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
  });
};

type UseCategoriesOptions = {
  queryConfig?: QueryConfig<typeof getCategoriesQueryOptions>;
};

export const useCategories = ({ queryConfig }: UseCategoriesOptions = {}) => {
  return useQuery({
    ...getCategoriesQueryOptions(),
    ...queryConfig,
  });
};
