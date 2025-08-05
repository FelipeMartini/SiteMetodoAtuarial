import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileManagerApi } from '../../services/fileManagerApiService';
import { FolderItem } from '../../types';

export const useCreateFolder = () => {
	const queryClient = useQueryClient();

	return useMutation<FolderItem, Error, { path: string; name: string }>({
		mutationFn: ({ path, name }) => fileManagerApi.createFolder(path, name),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['file-manager', 'items'] });
		}
	});
};
