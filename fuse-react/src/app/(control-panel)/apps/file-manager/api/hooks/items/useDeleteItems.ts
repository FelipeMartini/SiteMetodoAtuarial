import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileManagerApi } from '../../services/fileManagerApiService';
import { itemsQueryKey } from './useItems';

export const useDeleteItems = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string[]>({
		mutationFn: fileManagerApi.deleteItems,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemsQueryKey('') });
		}
	});
};
