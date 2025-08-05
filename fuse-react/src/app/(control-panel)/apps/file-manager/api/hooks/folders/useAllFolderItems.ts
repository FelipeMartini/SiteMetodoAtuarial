import { useQuery } from '@tanstack/react-query';
import { fileManagerApi } from '../../services/fileManagerApiService';
import { FolderItem } from '../../types';

export const useAllFolderItems = () => {
	return useQuery<FolderItem[]>({
		queryKey: ['file-manager', 'folder'],
		queryFn: () => fileManagerApi.getAllFolderItems()
	});
};
