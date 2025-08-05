import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiImageGenApi } from '../../services/aiImageGenApiService';
import { itemsQueryKey } from './useItems';

export const useDeleteItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: aiImageGenApi.deleteItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemsQueryKey });
		}
	});
};
