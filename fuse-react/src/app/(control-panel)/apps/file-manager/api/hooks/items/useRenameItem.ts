import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileManagerApi } from '../../services/fileManagerApiService';
import { itemsQueryKey } from './useItems';

export const useRenameItem = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: fileManagerApi.renameItem,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: itemsQueryKey('') });
		}
	});
};
