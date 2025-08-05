import { useQuery } from '@tanstack/react-query';
import { aiImageGenApi } from '../../services/aiImageGenApiService';

export const itemsQueryKey = ['aiImageGen', 'items'];

export const useItems = () => {
	return useQuery({
		queryFn: aiImageGenApi.getItems,
		queryKey: itemsQueryKey
	});
};
