import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiImageGenApi } from '../../services/aiImageGenApiService';
import { itemsQueryKey } from './useItems';

export const useUpdateItem = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: aiImageGenApi.updateItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemsQueryKey });
		}
	});
};
