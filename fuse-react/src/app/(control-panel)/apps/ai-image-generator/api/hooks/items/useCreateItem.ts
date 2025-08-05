import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiImageGenApi } from '../../services/aiImageGenApiService';
import { itemsQueryKey } from './useItems';

export const useCreateItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: aiImageGenApi.createItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemsQueryKey });
		}
	});
};
