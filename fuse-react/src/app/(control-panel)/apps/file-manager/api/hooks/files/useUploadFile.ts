import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileManagerApi } from '../../services/fileManagerApiService';
import { FileItem } from '../../types';

export const useUploadFile = () => {
	const queryClient = useQueryClient();

	return useMutation<FileItem, Error, { path: string; file: File }>({
		mutationFn: ({ path, file }) => fileManagerApi.uploadFile(path, file),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['file-manager', 'items'] });
		}
	});
};
