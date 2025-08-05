import { useQuery } from '@tanstack/react-query';
import { fileManagerApi } from '../../services/fileManagerApiService';
import { FileManagerItem } from '../../types';

export const itemQueryKey = (id: string) => ['file-manager', 'item', id];

export const useItem = (id: string) => {
	return useQuery<FileManagerItem>({
		queryFn: () => fileManagerApi.getItem(id),
		queryKey: itemQueryKey(id),
		enabled: !!id
	});
};
