import { useQuery } from '@tanstack/react-query';
import { fileManagerApi } from '../../services/fileManagerApiService';
import { FolderItem } from '../../types';

export const useFolderItems = (folderId: string) => {
	return useQuery<FolderItem[]>({
		queryKey: ['file-manager', 'folder', folderId],
		queryFn: () => fileManagerApi.getFolderItems(folderId)
	});
};
