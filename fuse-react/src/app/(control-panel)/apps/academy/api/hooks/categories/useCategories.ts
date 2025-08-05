import { useQuery } from '@tanstack/react-query';
import { academyApi } from '../../services/academyApiService';

export const categoriesQueryKey = ['academy', 'categories'];

export const useCategories = () => {
	return useQuery({
		queryKey: categoriesQueryKey,
		queryFn: academyApi.getCategories
	});
};
